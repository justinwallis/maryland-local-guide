import { promises as dns } from "node:dns";
import { mkdir, writeFile } from "node:fs/promises";

const domain = "marylandlocalguide.com";
const outPath = "artifacts/mail-dns-preflight.json";

async function safe(name, fn) {
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

const report = {
  checkedAt: new Date().toISOString(),
  domain,
  policy: {
    mode: "public DNS read-only",
    writes: false,
    authenticated: false,
  },
  records: {},
};

report.records.ns = await safe("ns", () => dns.resolveNs(domain));
report.records.soa = await safe("soa", () => dns.resolveSoa(domain));
report.records.mx = await safe("mx", () => dns.resolveMx(domain));
report.records.txt = await safe("txt", () => dns.resolveTxt(domain));
report.records.dmarc = await safe("dmarc", () => dns.resolveTxt(`_dmarc.${domain}`));
report.records.sendMx = await safe("sendMx", () => dns.resolveMx(`send.${domain}`));
report.records.sendTxt = await safe("sendTxt", () => dns.resolveTxt(`send.${domain}`));
report.records.dkim = await safe("dkim", () => dns.resolveTxt(`resend._domainkey.${domain}`));
report.records.rsend = await safe("rsend", () => dns.resolveCname(`rsend.${domain}`));

function flattenTxt(result) {
  if (!result?.ok) return [];
  return result.value.map((chunks) => chunks.join(""));
}

report.summary = {
  nameservers: report.records.ns.ok ? report.records.ns.value : [],
  soaPrimary: report.records.soa.ok ? report.records.soa.value.nsname : null,
  rootMx: report.records.mx.ok ? report.records.mx.value : [],
  rootSpf: flattenTxt(report.records.txt).filter((v) => v.toLowerCase().startsWith("v=spf1")),
  dmarc: flattenTxt(report.records.dmarc),
  resendRecordsPresent: {
    sendMx: report.records.sendMx.ok && report.records.sendMx.value.length > 0,
    sendSpf: flattenTxt(report.records.sendTxt).some((v) => v === "v=spf1 include:amazonses.com ~all"),
    dkim: flattenTxt(report.records.dkim).length > 0,
    rsendCname: report.records.rsend.ok && report.records.rsend.value.length > 0,
  },
};

report.result = "PASS_READ_ONLY";

await mkdir("artifacts", { recursive: true });
await writeFile(outPath, JSON.stringify(report, null, 2) + "\n");

console.log(JSON.stringify(report.summary, null, 2));
console.log("Artifact:", outPath);
