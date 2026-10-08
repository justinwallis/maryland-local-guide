export type DirectoryLocationMode = "service-area" | "exact";
export type DirectorySource = "representative" | "wordpress";

export type DirectoryListingSummary = {
  canonicalId?: number;
  canonicalUrl?: string;
  slug: string;
  title: string;
  category: string;
  locationLabel: string;
  precisionLabel: "Service area" | "Exact-location record";
  summary: string;
  representative: boolean;
  source: DirectorySource;
};

export type DirectoryListingDetail = DirectoryListingSummary & {
  description: string;
  services: readonly string[];
  serviceArea: string;
  locationDetail: string;
  locationMode: DirectoryLocationMode;
};

export type DirectorySearchInput = {
  query?: string;
  community?: string;
  directory?: string;
  page?: number;
  perPage?: number;
};

export type DirectorySearchResult = {
  source: DirectorySource;
  items: readonly DirectoryListingSummary[];
  total?: number;
  page?: number;
  totalPages?: number;
};

export interface DirectoryReadAdapter {
  searchListings(input: DirectorySearchInput): Promise<DirectorySearchResult>;
  getListing(slug: string): Promise<DirectoryListingDetail | null>;
}
