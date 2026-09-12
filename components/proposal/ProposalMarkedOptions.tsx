import { PROPOSAL_CONFIG as config } from "@/lib/proposal/config";
import type { ProposalState } from "@/lib/proposal/types";
import { ProposalOptionCard, ProposalRecurringCard, ProposalSectionCard } from "./ProposalCards";

export default function ProposalMarkedOptions({ state }: { state: ProposalState }) {
  const targets = new Set(state.doodles.map((stroke) => stroke.targetId));
  const sections = config.sections.filter((section) => targets.has(section.id));
  const options = config.oneTimeOptions.filter((option) => targets.has(option.id));
  const recurring = config.recurringOptions.filter((option) => targets.has(option.id));

  if (sections.length + options.length + recurring.length === 0) {
    return <p className="text-sm text-brand-200">No options marked up yet.</p>;
  }

  return (
    <div className="grid items-start gap-5 sm:grid-cols-2">
      {sections.map((section) => <ProposalSectionCard key={section.id} section={section} doodles={state.doodles} feedback={state.selections.sectionFeedback[section.id] ?? { comment: "", status: "" }} />)}
      {options.map((option) => <ProposalOptionCard key={option.id} option={option} doodles={state.doodles} selected={state.selections.oneTimeOptionIds.includes(option.id)} />)}
      {recurring.map((option) => <ProposalRecurringCard key={option.id} option={option} doodles={state.doodles} selected={state.selections.recurringOptionIds.includes(option.id)} />)}
    </div>
  );
}
