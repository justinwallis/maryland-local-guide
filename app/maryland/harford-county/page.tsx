import type { Metadata } from "next";
import { HubTemplate } from "../../../components/HubTemplate";

export const metadata: Metadata = {
  title: "Harford County",
  description:
    "Explore local services, communities, practical guides, and project resources across Harford County, Maryland.",
};

export default function HarfordCountyPage() {
  return (
    <HubTemplate
      title="Harford County"
      eyebrow="Explore Maryland"
      description="The launch-area front door for practical local services, project resources, communities, guides, and curated places."
      searchCommunity="harford"
      breadcrumb="Maryland / Harford County"
      contextLabel="Harford County, Maryland"
      communities={[
        { name: "Aberdeen", slug: "aberdeen" },
        { name: "Havre de Grace", slug: "havre-de-grace" },
        { name: "Bel Air", slug: "bel-air" },
      ]}
    />
  );
}
