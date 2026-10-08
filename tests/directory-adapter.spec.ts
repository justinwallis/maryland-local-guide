import { expect, test } from "@playwright/test";
import { getDirectoryReadAdapter } from "../lib/directory/provider";
import { createWordPressDirectoryAdapter } from "../lib/directory/wordpress-adapter";

function response(
  body: unknown,
  headers: Record<string, string> = {},
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  });
}

function createMockFetch() {
  const seen: string[] = [];

  const fetchImpl: typeof fetch = async (input) => {
    const url = new URL(
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url,
    );
    seen.push(url.toString());

    if (url.pathname === "/wp-json/directorist/v1/directories") {
      return response([
        {
          id: 2,
          name: "Home Services",
          slug: "home-services",
        },
      ]);
    }

    if (url.pathname === "/wp-json/directorist/v1/listings/categories") {
      return response([
        {
          id: 19,
          name: "Masonry",
          slug: "masonry",
          directory: [2],
        },
      ]);
    }

    if (url.pathname === "/wp-json/directorist/v1/listings/locations") {
      return response([
        {
          id: 9,
          name: "Harford County",
          slug: "harford-county",
          parent: 8,
          directory: [2],
        },
        {
          id: 10,
          name: "Aberdeen",
          slug: "aberdeen",
          parent: 9,
          directory: [2],
        },
      ]);
    }

    if (url.pathname === "/wp-json/directorist/v1/listings") {
      if (url.searchParams.get("slug") === "exact-shop") {
        return response(
          [
            {
              id: 102,
              slug: "exact-shop",
              name: "Example Supply",
              status: "publish",
              permalink: "https://marylandlocalguide.com/listing/example-supply/",
              categories: [19],
              locations: [10],
              description: "<p>Public exact-location listing.</p>",
              short_description: "Local materials and pickup.",
              "custom-textarea": "Building materials; Local pickup",
              "custom-textarea-2": "Aberdeen and nearby Harford County",
              address: "100 Example Street, Aberdeen, MD",
              latitude: "39.5000",
              longitude: "-76.1600",
              map_hidden: false,
            },
          ],
          { "x-wp-total": "1", "x-wp-totalpages": "1" },
        );
      }

      if (url.searchParams.get("search") === "pending-fixture") {
        return response(
          [
            {
              id: 103,
              slug: "pending-fixture",
              name: "Pending Fixture",
              status: "pending",
              categories: [19],
              locations: [10],
            },
          ],
          { "x-wp-total": "1", "x-wp-totalpages": "1" },
        );
      }

      return response(
        [
          {
            id: 101,
            slug: "service-area-business",
            name: "Example Masonry",
            status: "publish",
            categories: [19],
            locations: [10],
            short_description: "Brick and block work across the local service area.",
            address: "Private service address",
            latitude: "39.5000",
            longitude: "-76.1600",
            map_hidden: true,
          },
        ],
        { "x-wp-total": "1", "x-wp-totalpages": "1" },
      );
    }

    return response({ message: "not found" }, {}, 404);
  };

  return { fetchImpl, seen };
}

test("staged WordPress adapter maps canonical search params and service-area truthfully", async () => {
  const mock = createMockFetch();
  const adapter = createWordPressDirectoryAdapter({
    origin: "https://example.test",
    fetchImpl: mock.fetchImpl,
  });

  const result = await adapter.searchListings({
    query: "masonry",
    community: "aberdeen",
  });

  expect(result.source).toBe("wordpress");
  expect(result.total).toBe(1);
  expect(result.items).toHaveLength(1);
  expect(result.items[0]).toMatchObject({
    canonicalId: 101,
    slug: "service-area-business",
    title: "Example Masonry",
    category: "Masonry",
    locationLabel: "Aberdeen",
    precisionLabel: "Service area",
    representative: false,
    source: "wordpress",
  });

  const listingsUrl = new URL(
    mock.seen.find((url) => url.includes("/wp-json/directorist/v1/listings?"))!,
  );
  expect(listingsUrl.searchParams.get("directory")).toBe("2");
  expect(listingsUrl.searchParams.get("status")).toBe("publish");
  expect(listingsUrl.searchParams.get("search")).toBe("masonry");
  expect(listingsUrl.searchParams.get("locations")).toBe("10");
  expect(listingsUrl.searchParams.get("radius")).toBeNull();
});

test("staged WordPress adapter requires address coordinates and visible map for exact location", async () => {
  const mock = createMockFetch();
  const adapter = createWordPressDirectoryAdapter({
    origin: "https://example.test",
    fetchImpl: mock.fetchImpl,
  });

  const listing = await adapter.getListing("exact-shop");

  expect(listing).not.toBeNull();
  expect(listing).toMatchObject({
    canonicalId: 102,
    title: "Example Supply",
    locationMode: "exact",
    precisionLabel: "Exact-location record",
    locationLabel: "100 Example Street, Aberdeen, MD",
    representative: false,
    source: "wordpress",
  });
  expect(listing?.description).toBe("Public exact-location listing.");
  expect(listing?.services).toEqual(["Building materials", "Local pickup"]);
  expect(listing?.serviceArea).toBe("Aberdeen and nearby Harford County");
});

test("staged WordPress adapter drops non-published records even if an upstream response includes one", async () => {
  const mock = createMockFetch();
  const adapter = createWordPressDirectoryAdapter({
    origin: "https://example.test",
    fetchImpl: mock.fetchImpl,
  });

  const result = await adapter.searchListings({
    query: "pending-fixture",
    community: "aberdeen",
  });

  expect(result.items).toEqual([]);
});

test("provider keeps WordPress adapter double-locked until explicit acceptance", () => {
  const previousSource = process.env.MLG_DIRECTORY_SOURCE;
  const previousAccepted = process.env.MLG_LIVE_DIRECTORY_ACCEPTED;

  try {
    process.env.MLG_DIRECTORY_SOURCE = "wordpress";
    delete process.env.MLG_LIVE_DIRECTORY_ACCEPTED;

    expect(() => getDirectoryReadAdapter()).toThrow(/staged but not accepted/i);

    process.env.MLG_LIVE_DIRECTORY_ACCEPTED = "true";
    expect(getDirectoryReadAdapter()).toBeDefined();
  } finally {
    if (previousSource === undefined) delete process.env.MLG_DIRECTORY_SOURCE;
    else process.env.MLG_DIRECTORY_SOURCE = previousSource;

    if (previousAccepted === undefined) delete process.env.MLG_LIVE_DIRECTORY_ACCEPTED;
    else process.env.MLG_LIVE_DIRECTORY_ACCEPTED = previousAccepted;
  }
});
