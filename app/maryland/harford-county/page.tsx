import { HubTemplate } from "../../../components/HubTemplate";

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
