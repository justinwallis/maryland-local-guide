import { notFound } from "next/navigation";
import { GuideTemplate } from "../../../components/GuideTemplate";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

const guides = {
  "planning-a-home-project": {
    title: "Planning a Home Project Without Wasting the First Week",
    eyebrow: "Home project guide",
    dek:
      "A practical Harford County-first framework for defining the job, finding the right kind of help, and gathering the information a contractor or supplier will actually need.",
    areaLabel: "Harford County context",
    updatedLabel: "Representative content",
    readingTime: "6 min read",
    takeaways: [
      "Define the problem before shopping for a contractor.",
      "Separate contractor work, materials, and equipment needs.",
      "Keep location and access details ready before requesting help.",
    ],
    sections: [
      {
        heading: "Start with the problem, not a company name",
        body: [
          "A useful local search starts with what needs to be solved. Write down the visible problem, where it is on the property, what changed, and what result you want.",
          "That description makes category selection more accurate and gives a service professional enough context to decide whether the job fits their work.",
        ],
      },
      {
        heading: "Separate labor, materials, and equipment",
        body: [
          "Many home projects involve three different local searches: a qualified service provider, a source for materials, and sometimes a rental or equipment option.",
          "Maryland Local Guide is designed to keep those paths connected without pretending every project requires all three.",
        ],
      },
      {
        heading: "Keep local constraints visible",
        body: [
          "Property access, service area, community, and the difference between a storefront and a mobile service business can materially change which local options are useful.",
          "The public product should preserve those distinctions rather than flattening every result into a generic map pin.",
        ],
      },
    ],
    relatedServices: ["Masonry", "Landscaping", "Water & Well", "Tree Service"],
    toolTitle: "Project-call preparation checklist",
    toolIntro:
      "Use this lightweight worksheet before contacting a service provider. It intentionally avoids estimating price or telling you what professional work is required.",
    toolItems: [
      "Describe the problem in one or two sentences.",
      "Note the property/community and any access limitations.",
      "Take clear photos for your own reference.",
      "List materials already on hand, if any.",
      "Write down the outcome you want and any timing constraint.",
    ],
  },
  "well-service-basics": {
    title: "Before You Call for Well or Water Service",
    eyebrow: "Local service guide",
    dek:
      "A representative guide template for gathering useful context before contacting a Harford County well or water-service professional.",
    areaLabel: "Harford County context",
    updatedLabel: "Representative content",
    readingTime: "5 min read",
    takeaways: [
      "Write down the symptom and when it started.",
      "Know whether the issue affects the whole house or one fixture.",
      "Do not treat a service-area business like a storefront pin.",
    ],
    sections: [
      {
        heading: "Describe what changed",
        body: [
          "A short timeline is more useful than guessing at the cause. Note whether the change was sudden or gradual and whether pressure, taste, odor, staining, or interruptions are involved.",
          "Production versions of this guide should distinguish general preparation from safety-critical or regulated advice and cite authoritative sources where appropriate.",
        ],
      },
      {
        heading: "Gather system context",
        body: [
          "Useful non-diagnostic context can include whether the property uses a private well, whether treatment equipment is present, and whether the issue appears throughout the home.",
          "The directory should help a resident reach the right service category without presenting the guide itself as professional diagnosis.",
        ],
      },
    ],
    relatedServices: ["Water & Well", "Plumbing"],
    toolTitle: "Service-call notes",
    toolIntro: "A simple checklist for organizing what you already know before making a call.",
    toolItems: [
      "Note when the issue began.",
      "Record which fixtures or areas are affected.",
      "Identify any treatment equipment you know is present.",
      "Write down recent work or outages that may be relevant.",
    ],
  },
} as const;

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = guides[slug as keyof typeof guides];

  if (!guide) {
    notFound();
  }

  return <GuideTemplate {...guide} />;
}
