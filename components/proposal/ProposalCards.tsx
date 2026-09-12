import { Check } from "lucide-react";

import type {
  ProposalOption,
  ProposalRecurringOption,
  ProposalSection,
} from "@/lib/proposal/config";
import type {
  DoodleStroke,
  FeedbackStatus,
  SectionFeedback,
} from "@/lib/proposal/types";
import ProposalMarkup from "./ProposalMarkup";

interface MarkupProps {
  doodles: DoodleStroke[];
  onDraw?: (stroke: DoodleStroke) => void;
  onUndo?: (targetId: string) => void;
  onClear?: (targetId: string) => void;
}

export function ProposalOptionCard({
  option,
  selected,
  onSelect,
  ...markup
}: MarkupProps & {
  option: ProposalOption;
  selected: boolean;
  onSelect?: (selected: boolean) => void;
}) {
  return (
    <ProposalMarkup {...markup} targetId={option.id} title={option.label}>
      <label
        className={`proposal-card ${onSelect ? "cursor-pointer" : ""} ${selected ? "proposal-card--selected" : ""}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="proposal-eyebrow text-brand-600">Optional addition</p>
            <h3 className="mt-2 text-lg font-semibold text-brand-950">
              {option.label}
            </h3>
          </div>
          <input
            type="checkbox"
            aria-label={`Include ${option.label}`}
            checked={selected}
            disabled={!onSelect}
            onChange={(event) => onSelect?.(event.target.checked)}
            className="mt-1 h-5 w-5 flex-none accent-brand-600"
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-brand-900/75">
          {option.summary}
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-brand-900/65">
          {option.includes.map((item) => (
            <li key={item} className="flex gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-brand-200/50 pt-4 text-xl font-bold text-brand-950">
          ${option.price.toLocaleString("en-US")}{" "}
          <span className="text-sm font-normal text-brand-900/50">
            one time
          </span>
        </p>
      </label>
    </ProposalMarkup>
  );
}

export function ProposalSectionCard({
  section,
  feedback,
  onFeedback,
  ...markup
}: MarkupProps & {
  section: ProposalSection;
  feedback: SectionFeedback;
  onFeedback?: (patch: Partial<SectionFeedback>) => void;
}) {
  const labels: Record<FeedbackStatus, string> = {
    interested: "Interested",
    question: "Question",
    maybe_later: "Maybe later",
  };
  return (
    <ProposalMarkup {...markup} targetId={section.id} title={section.title}>
      <div className="proposal-card">
        <h3 className="text-lg font-semibold text-brand-950">
          {section.title}
        </h3>
        <p className="mt-1 text-sm text-brand-900/75">{section.summary}</p>
        <ul className="mt-4 space-y-2 text-sm text-brand-900/75">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <Check className="mt-1 h-4 w-4 flex-none text-success-600" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <textarea
          aria-label={`Note on ${section.title}`}
          value={feedback.comment}
          disabled={!onFeedback}
          onChange={(event) => onFeedback?.({ comment: event.target.value })}
          placeholder="Add a question or note"
          rows={2}
          maxLength={1200}
          className="proposal-input mt-5 resize-none"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(labels).map(([value, label]) => (
            <button
              key={value}
              type="button"
              disabled={!onFeedback}
              aria-pressed={feedback.status === value}
              onClick={() =>
                onFeedback?.({
                  status:
                    feedback.status === value ? "" : (value as FeedbackStatus),
                })
              }
              className={`min-h-9 rounded-full border px-4 py-2 text-sm font-semibold ${feedback.status === value ? "border-brand-500 bg-brand-500 text-white" : "border-brand-200 bg-white text-brand-900/75"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </ProposalMarkup>
  );
}

export function ProposalRecurringCard({
  option,
  selected,
  onSelect,
  ...markup
}: MarkupProps & {
  option: ProposalRecurringOption;
  selected: boolean;
  onSelect?: (selected: boolean) => void;
}) {
  return (
    <ProposalMarkup {...markup} targetId={option.id} title={option.label}>
      <label
        className={`proposal-card flex items-start gap-3 text-sm ${selected ? "proposal-card--selected" : ""} ${onSelect ? "cursor-pointer" : ""}`}
      >
        <input
          type="checkbox"
          aria-label={`Include ${option.label}`}
          checked={selected}
          disabled={!onSelect}
          onChange={(event) => onSelect?.(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-brand-600"
        />
        <span>
          <span className="block font-semibold text-brand-950">
            {option.label}
          </span>
          <span className="text-brand-900/75">{option.summary}</span>
            <span className="mt-1 block font-bold text-brand-600">
            ${option.price.toLocaleString("en-US")} / {option.period}
          </span>
        </span>
      </label>
    </ProposalMarkup>
  );
}
