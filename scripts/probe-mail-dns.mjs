import { promises as dns } from "node:dns";
import { mkdir, writeFile } from "node:fs/promises";

const domain = "marylandlocalguide.com";
const outPath = "artifacts/mail-dns-preflight.json";

const expected = {
  nameservers: ["alpha1.kc.epik.com", "alpha2.kc.epik.com"],
  rootMx: [{ exchange: "mail.marylandlocalguide.com", priority: 0 }],
  rootSpf: "v=spf1 +a +mx +ip4:66.223.49.20 include:_spf.epikwebhosting.com ~all",
  dmarc: "v=DMARC1; p=none;",
  sendMx: { exchange: "feedback-smtp.us-east-1.amazonses.com", priority: 10 },
  sendSpf: "v=spf1 include:amazonses.com ~all",
  dkim:
    "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDMw3fYZG8W9IcmWTZL6nTjO+avlBif5Sn66qwy9/wSNJEB9azCl1q5q2dwd85CzLksNAN09eqIUvKvLPiVf+fixiN9PKFGKmZILYtw61puvHjWNE6Q/g+Vbcbs/W0iLNSCqZfKnlvp00BJ09KrnTZ1Yx/2FgAZVxJ9pqZ77mYwQIDAQAB",
  rsendCname: "send.forge.rmta.net",
};

async function safe(fn) {
  try {
    return { ok: true, value: await fn() };
  } catch (error) {
    return {
      ok: false,
      code: error?.code ?? null,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

function flattenTxt(result) {
  if (!result?.ok) return [];
  return result.value.map((chunks) => chunks.join(""));
}

function normalizeHost(value) {
  return String(value || "").replace(/.$/, "").toLowerCase();
}

function sorted(values) {
  return [...values].sort();
}

function sameStringSet(actual, wanted) {
  return JSON.stringify(sorted(actual.map(normalizeHost))) === JSON.stringify(sorted(wanted.map(normalizeHost)));
}

function mxHas(result, wanted) {
  if (!result?.ok) return false;
  return result.value.some(
    (item) =>
      normalizeHost(item.exchange) === normalizeHost(wanted.exchange) &&
      Number(item.priority) === Number(wanted.priority),
  );
}

const report = {
  checkedAt: new Date().toISOString(),
  domain,
  policy: {
    mode: "public DNS read-only",
    writes: false,
    authenticated: false,
  },
  expected,
  records: {},
};

report.records.ns = await safe(() => dns.resolveNs(domain));
report.records.soa = await safe(() => dns.resolveSoa(domain));
report.records.mx = await safe(() => dns.resolveMx(domain));
report.records.txt = await safe(() => dns.resolveTxt(domain));
report.records.dmarc = await safe(() => dns.resolveTxt(`_dmarc.${domain}`));
report.records.sendMx = await safe(() => dns.resolveMx(`send.${domain}`));
report.records.sendTxt = await safe(() => dns.resolveTxt(`send.${domain}`));
report.records.dkim = await safe(() => dns.resolveTxt(`resend._domainkey.${domain}`));
report.records.rsend = await safe(() => dns.resolveCname(`rsend.${domain}`));

const rootSpfRecords = flattenTxt(report.records.txt).filter((v) =>
  v.toLowerCase().startsWith("v=spf1"),
);
const dmarcRecords = flattenTxt(report.records.dmarc);
const sendTxtRecords = flattenTxt(report.records.sendTxt);
const dkimRecords = flattenTxt(report.records.dkim);
const rsendValues = report.records.rsend.ok ? report.records.rsend.value : [];

const baseline = {
  nameserversMatch:
    report.records.ns.ok &&
    sameStringSet(report.records.ns.value, expected.nameservers),
  rootMxMatch: mxHas(report.records.mx, expected.rootMx[0]),
  exactlyOneRootSpf:
    rootSpfRecords.length === 1 && rootSpfRecords[0] === expected.rootSpf,
  dmarcPreserved:
    dmarcRecords.length === 1 && dmarcRecords[0] === expected.dmarc,
};

const resend = {
  sendMx: mxHas(report.records.sendMx, expected.sendMx),
  sendSpf: sendTxtRecords.includes(expected.sendSpf),
  dkim: dkimRecords.includes(expected.dkim),
  rsendCname: rsendValues.some(
    (value) => normalizeHost(value) === normalizeHost(expected.rsendCname),
  ),
};

const hostConflicts = {
  sendMx:
    report.records.sendMx.ok &&
    report.records.sendMx.value.length > 0 &&
    !resend.sendMx,
  sendTxt:
    report.records.sendTxt.ok &&
    sendTxtRecords.some((value) => value !== expected.sendSpf),
  dkim:
    report.records.dkim.ok &&
    dkimRecords.length > 0 &&
    !resend.dkim,
  rsend:
    report.records.rsend.ok &&
    rsendValues.length > 0 &&
    !resend.rsendCname,
};

const baselineOk = Object.values(baseline).every(Boolean);
const resendReady = Object.values(resend).every(Boolean);
const conflict = Object.values(hostConflicts).some(Boolean);

let state = "WAITING_DNS";
if (!baselineOk) state = "STOP_BASELINE_CHANGED";
else if (conflict) state = "STOP_CONFLICT";
else if (resendReady) state = "READY_FOR_RESEND_VERIFY";

report.summary = {
  nameservers: report.records.ns.ok ? report.records.ns.value : [],
  soaPrimary: report.records.soa.ok ? report.records.soa.value.nsname : null,
  rootMx: report.records.mx.ok ? report.records.mx.value : [],
  rootSpf: rootSpfRecords,
  dmarc: dmarcRecords,
  baseline,
  resend,
  hostConflicts,
  state,
};

report.result = state;

await mkdir("artifacts", { recursive: true });
await writeFile(outPath, JSON.stringify(report, null, 2) + "\n");

console.log(JSON.stringify(report.summary, null, 2));
console.log("State:", state);
console.log("Artifact:", outPath);

if (state === "STOP_BASELINE_CHANGED" || state === "STOP_CONFLICT") {
  process.exitCode = 2;
}
