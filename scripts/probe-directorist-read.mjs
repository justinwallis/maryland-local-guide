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
  if (Array.isArray(value)) {
    return value.length ? [shape(value[0], depth - 1)] : [];
  }
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

async function get(path) {
  const url = `${base}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "user-agent": "MarylandLocalGuide-ReadOnly-Preflight/1.0",
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
      status: response.status,
      contentType: response.headers.get("content-type"),
      total: response.headers.get("x-wp-total"),
      totalPages: response.headers.get("x-wp-totalpages"),
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
    writes: false,
    userEndpointsQueried: false,
    rawListingValuesLogged: false,
  },
  vendorBaseline: {
    officialDocsCandidateV1: "/wp-json/directorist/v1/listings",
    note: "Candidate only until advertised by this site's REST root.",
  },
};

try {
  const root = await get("/wp-json/");
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
    args: routeArgs(routes[name]),
  }));

  const wpTypes = await get("/wp-json/wp/v2/types?context=view");
  report.wpTypes = {
    status: wpTypes.status,
    total: wpTypes.total,
    totalPages: wpTypes.totalPages,
    shape: wpTypes.json ? shape(wpTypes.json, 2) : null,
  };

  const v1ListingsRoute = relevantRouteNames.find(
    (name) => /^\/directorist\/v1\/listings\/?$/.test(name),
  );

  if (v1ListingsRoute && routeMethods(routes[v1ListingsRoute]).includes("GET")) {
    const listings = await get(
      "/wp-json/directorist/v1/listings?per_page=1&order=desc&orderby=date",
    );
    const first = Array.isArray(listings.json)
      ? listings.json[0]
      : listings.json && typeof listings.json === "object"
        ? (listings.json.data?.[0] ?? listings.json.listings?.[0] ?? null)
        : null;

    report.listingsV1 = {
      advertised: true,
      status: listings.status,
      total: listings.total,
      totalPages: listings.totalPages,
      responseShape: listings.json ? shape(listings.json, 2) : null,
      firstItemShape: first ? shape(first, 3) : null,
      mapSignalCandidates: mapSignals(first),
    };

    const categories = await get(
      "/wp-json/directorist/v1/listings/categories?per_page=3&hide_empty=true",
    );
    report.categoriesV1 = {
      status: categories.status,
      total: categories.total,
      totalPages: categories.totalPages,
      responseShape: categories.json ? shape(categories.json, 2) : null,
    };

    const locations = await get(
      "/wp-json/directorist/v1/listings/locations?per_page=3&hide_empty=true",
    );
    report.locationsV1 = {
      status: locations.status,
      total: locations.total,
      totalPages: locations.totalPages,
      responseShape: locations.json ? shape(locations.json, 2) : null,
    };
  } else {
    report.listingsV1 = {
      advertised: false,
      note: "The official-docs v1 collection route was not advertised with GET by this site's REST root.",
    };
  }

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
console.log("Relevant Directorist routes:", report.directoristRoutes?.length ?? 0);
console.log("V1 listings advertised:", report.listingsV1?.advertised ?? false);
if (report.listingsV1?.status) console.log("V1 listings status:", report.listingsV1.status);
console.log("Artifact:", outPath);

if (report.result !== "PASS_READ_DISCOVERY") process.exitCode = 2;
