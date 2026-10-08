import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubTemplate } from "../../../../components/HubTemplate";

type CommunityPageProps = {
  params: Promise<{ community: string }>;
};

const communities: Record<
  string,
  { title: string; description: string; searchCommunity: string }
> = {
  aberdeen: {
    title: "Aberdeen",
    description:
      "A hyperlocal Harford County hub for practical services, project resources, useful guides, and nearby discovery.",
    searchCommunity: "aberdeen",
  },
  "havre-de-grace": {
    title: "Havre de Grace",
    description:
      "A community-level Harford County guide focused on useful local services, practical resources, guides, and discovery.",
    searchCommunity: "havre-de-grace",
  },
  "bel-air": {
    title: "Bel Air",
    description:
      "A Harford County community hub for practical services, project resources, local guides, and nearby discovery.",
    searchCommunity: "bel-air",
  },
};

export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const { community } = await params;
  const current = communities[community];

  if (!current) {
    return {
      title: "Harford County Community",
      description: "Explore a Harford County community with Maryland Local Guide.",
    };
  }

  return {
    title: current.title,
    description: current.description,
  };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { community } = await params;
  const current = communities[community];

  if (!current) {
    notFound();
  }

  return (
    <HubTemplate
      title={current.title}
      eyebrow="Harford County community"
      description={current.description}
      searchCommunity={current.searchCommunity}
      breadcrumb={`Maryland / Harford County / ${current.title}`}
      contextLabel={`${current.title}, Harford County`}
    />
  );
}
