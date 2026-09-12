import type { ProposalConfig } from "./config";

export function newProposalTemplate(): ProposalConfig {
  return {
    id: "draft",
    title: "",
    clientName: "",
    clientNames: [],
    senderName: "Ryan Stefan",
    senderEmail: "ryan@dashwood.net",
    introduction:
      "Here’s a starting point for what we could create together. Explore the ideas below, choose what feels right, and leave your thoughts as you go.",
    baseOption: {
      id: "foundation",
      label: "Website design & build",
      price: 0,
      effort: "Medium",
      summary: "A thoughtful, easy-to-use website built around your business.",
      includes: [],
      selectedByDefault: true,
    },
    sections: [
      {
        id: "design",
        title: "Design & direction",
        summary: "A look and feel that tells your story.",
        bullets: [
          "Layouts tailored to your brand",
          "A great experience on mobile and desktop",
        ],
      },
      {
        id: "launch",
        title: "Build & launch",
        summary: "Everything ready for your next chapter.",
        bullets: [
          "Fast, accessible pages",
          "Launch checks and a personal handover",
        ],
      },
    ],
    oneTimeOptions: [],
    recurringOptions: [],
    thirdPartyCosts: [],
    previewCaption:
      "A first look at the direction. Circle anything you’d like to discuss.",
    previewImage: null,
    previewDimensions: { width: 1200, height: 800 },
    closingNote:
      "Share your thoughts when you’re ready and I’ll follow up with next steps.",
  };
}

export function proposalToken(value: string): string {
  const trimmed = value.trim();
  try {
    return new URL(trimmed).searchParams.get("admin") ?? trimmed;
  } catch {
    return trimmed;
  }
}
