import { mkdir, writeFile } from "node:fs/promises";

const base = (process.env.MLG_SITE_ORIGIN || "https://marylandlocalguide.com").replace(/\/$/, "");
const outPath = "artifacts/directorist-read-preflight.json";

function typeOf(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function shape(value, depth = 2) {
  if (depth < 0) return typeOf(value);
  if (Array.isArray(value)) return value.length ? [shape(value[0], depth - 1)] : [];
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, shape(child, depth - 1)]),
    );
  }
  return typeOf(value);
}

function routeMethods(routeInfo) {
  const entries = Array.isArray(routeInfo) ? routeInfo : [routeInfo];
  return [...new Set(entries.flatMap((entry) => entry?.methods || []))].sort();
}

function routeArgs(routeInfo) {
  const entries = Array.isArray(routeInfo) ? routeInfo : [routeInfo];
  const names = new Set();
  for (const entry of entries) {
    for (const name of Object.keys(entry?.args || {})) names.add(name);
  }
  return [...names].sort();
}

function firstRecord(json) {
  if (Array.isArray(json)) return json[0] ?? null;
  if (!json || typeof json !== "object") return null;
  for (const key of ["data", "listings", "items", "results"]) {
    if (Array.isArray(json[key])) return json[key][0] ?? null;
  }
  return null;
}

function mapSignals(item) {
  if (!item || typeof item !== "object" || Array.isArray(item)) return {};
  const interesting = /(lat|lng|long|map|address|location|service|area|geo)/i;
  const result = {};
  for (const [key, value] of Object.entries(item)) {
    if (!interesting.test(key)) continue;
    const kind = typeOf(value);
    if (kind === "boolean") result[key] = value;
    else if (kind === "number") result[key] = "number:present";
    else if (kind === "string") result[key] = value ? "string:present" : "string:empty";
    else result[key] = kind;
  }
  return result;
}

function publicTermIdentity(json) {
  const list = Array.isArray(json)
    ? json
    : json && typeof json === "object"
      ? (json.data ?? json.items ?? json.results ?? [])
      : [];
  if (!Array.isArray(list)) return [];
  return list.slice(0, 100).map((item) => {
    const result = {};
    for (const key of ["id", "term_id", "name", "slug", "parent", "count"]) {
      if (item && Object.hasOwn(item, key)) result[key] = item[key];
    }
    return result;
  });
}

function optionSummary(json) {
  if (!json || typeof json !== "object") return null;
  const endpoints = Array.isArray(json.endpoints) ? json.endpoints : [];
  return endpoints.map((endpoint) => ({
    methods: endpoint.methods ?? [],
    argNames: Object.keys(endpoint.args ?? {}).sort(),
  }));
}

async function request(path, method = "GET") {
  const url = `${base}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      method,
      headers: {
        accept: "application/json",
        "user-agent": "MarylandLocalGuide-ReadOnly-Preflight/1.1",
      },
      redirect: "follow",
      signal: controller.signal,
    });
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    return {
      url,
      method,
      status: response.status,
      contentType: response.headers.get("content-type"),
      total: response.headers.get("x-wp-total"),
      totalPages: response.headers.get("x-wp-totalpages"),
      allow: response.headers.get("allow"),
      json,
      bodyType: json === null ? "non-json" : typeOf(json),
    };
  } finally {
    clearTimeout(timer);
  }
}

const report = {
  probedAt: new Date().toISOString(),
  origin: base,
  policy: {
    mode: "read-only public REST discovery",
    authenticated: false,
    writeMethodsSent: false,
    userEndpointsQueried: false,
    rawListingValuesLogged: false,
    methodsUsed: ["GET", "OPTIONS"],
  },
};

try {
  const root = await request("/wp-json/");
  report.restRoot = {
    status: root.status,
    contentType: root.contentType,
    bodyType: root.bodyType,
  };

  if (root.status !== 200 || !root.json || typeof root.json !== "object") {
    throw new Error(`REST root unavailable or non-JSON (status ${root.status})`);
  }

  const namespaces = Array.isArray(root.json.namespaces) ? root.json.namespaces : [];
  const routes = root.json.routes && typeof root.json.routes === "object" ? root.json.routes : {};

  report.namespaces = {
    directorist: namespaces.filter((ns) => /directorist/i.test(ns)),
    wordpress: namespaces.filter((ns) => /^wp\/v\d+/i.test(ns)),
  };

  const relevantRouteNames = Object.keys(routes)
    .filter((name) =>
      /directorist/i.test(name) &&
      /(listing|categor|location|director|type|builder)/i.test(name),
    )
    .sort();

  report.directoristRoutes = relevantRouteNames.map((name) => ({
    route: name,
    methods: routeMethods(routes[name]),
    argsFromRoot: routeArgs(routes[name]),
  }));

  const [wpTypes, wpTaxonomies] = await Promise.all([
    request("/wp-json/wp/v2/types?context=view"),
    request("/wp-json/wp/v2/taxonomies?context=view"),
  ]);

  report.wpTypes = {
    status: wpTypes.status,
    shape: wpTypes.json ? shape(wpTypes.json, 2) : null,
  };
  report.wpTaxonomies = {
    status: wpTaxonomies.status,
    shape: wpTaxonomies.json ? shape(wpTaxonomies.json, 2) : null,
  };

  const v1Options = await request("/wp-json/directorist/v1/listings", "OPTIONS");
  const v2Options = await request("/wp-json/directorist/v2/listings", "OPTIONS");
  report.listingCollectionOptions = {
    v1: { status: v1Options.status, endpoints: optionSummary(v1Options.json) },
    v2: { status: v2Options.status, endpoints: optionSummary(v2Options.json) },
  };

  const [directories, listingsV1, listingsV2, categoriesAll, locationsAll] = await Promise.all([
    request("/wp-json/directorist/v1/directories"),
    request("/wp-json/directorist/v1/listings?per_page=1&order=desc&orderby=date"),
    request("/wp-json/directorist/v2/listings?per_page=1&order=desc&orderby=date"),
    request("/wp-json/directorist/v1/listings/categories?per_page=100&hide_empty=false"),
    request("/wp-json/directorist/v1/listings/locations?per_page=100&hide_empty=false"),
  ]);

  report.directoriesV1 = {
    status: directories.status,
    responseShape: directories.json ? shape(directories.json, 3) : null,
  };

  const firstV1 = firstRecord(listingsV1.json);
  report.listingsV1 = {
    status: listingsV1.status,
    total: listingsV1.total,
    totalPages: listingsV1.totalPages,
    responseShape: listingsV1.json ? shape(listingsV1.json, 2) : null,
    firstItemShape: firstV1 ? shape(firstV1, 3) : null,
    mapSignalCandidates: mapSignals(firstV1),
  };

  const firstV2 = firstRecord(listingsV2.json);
  report.listingsV2 = {
    status: listingsV2.status,
    total: listingsV2.total,
    totalPages: listingsV2.totalPages,
    responseShape: listingsV2.json ? shape(listingsV2.json, 2) : null,
    firstItemShape: firstV2 ? shape(firstV2, 3) : null,
    mapSignalCandidates: mapSignals(firstV2),
  };

  report.categoriesV1 = {
    status: categoriesAll.status,
    total: categoriesAll.total,
    totalPages: categoriesAll.totalPages,
    responseShape: categoriesAll.json ? shape(categoriesAll.json, 2) : null,
    publicTerms: publicTermIdentity(categoriesAll.json),
  };

  report.locationsV1 = {
    status: locationsAll.status,
    total: locationsAll.total,
    totalPages: locationsAll.totalPages,
    responseShape: locationsAll.json ? shape(locationsAll.json, 2) : null,
    publicTerms: publicTermIdentity(locationsAll.json),
  };

  report.result = "PASS_READ_DISCOVERY";
} catch (error) {
  report.result = "BLOCKED";
  report.error = error instanceof Error ? error.message : String(error);
}

await mkdir("artifacts", { recursive: true });
await writeFile(outPath, JSON.stringify(report, null, 2) + "\n", "utf8");

console.log("Directorist read-only preflight:", report.result);
console.log("REST root:", report.restRoot?.status ?? "unavailable");
console.log("Directorist namespaces:", report.namespaces?.directorist ?? []);
console.log("V1 listings:", report.listingsV1?.status, "total", report.listingsV1?.total);
console.log("V2 listings:", report.listingsV2?.status, "total", report.listingsV2?.total);
console.log("Categories exposed:", report.categoriesV1?.publicTerms?.length ?? 0);
console.log("Locations exposed:", report.locationsV1?.publicTerms?.length ?? 0);
console.log("Artifact:", outPath);

if (report.result !== "PASS_READ_DISCOVERY") process.exitCode = 2;
