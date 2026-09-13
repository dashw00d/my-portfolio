import { useEffect, useState } from "react";

import {
  WORKSHEET_PDF,
  checklistItems,
} from "../../lib/community-data-center";

export default function MeetingChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    setEnhanced(true);
  }, []);

  const count = checklistItems.filter((item) => checked[item.id]).length;
  const progress = `${(count / checklistItems.length) * 100}%`;

  const toggle = (id: string) => {
    setChecked((previous) => ({ ...previous, [id]: !previous[id] }));
  };

  return (
    <div className="ct-checklist">
      <ul className="ct-checklist-list">
        {checklistItems.map((item) => {
          const inputId = `ct-check-${item.id}`;
          return (
            <li className="ct-checklist-item" key={item.id}>
              <label className="ct-checklist-label" htmlFor={inputId}>
                <input
                  id={inputId}
                  type="checkbox"
                  checked={Boolean(checked[item.id])}
                  onChange={() => toggle(item.id)}
                />
                <span className="ct-checklist-text">
                  <span className="ct-checklist-title">{item.label}</span>
                  <span className="ct-checklist-helper">{item.helper}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {enhanced ? (
        <div className="ct-checklist-status">
          <p className="ct-checklist-count" aria-live="polite">
            {count} of {checklistItems.length} topics prepared
          </p>
          <div className="ct-progress" aria-hidden="true">
            <span style={{ width: progress }} />
          </div>
        </div>
      ) : (
        <p className="ct-checklist-nojs">
          Use your browser's Print command for a blank meeting sheet.
        </p>
      )}

      {enhanced && count === checklistItems.length && (
        <p className="ct-checklist-complete">
          Your meeting outline is ready. Bring the worksheet and record what is
          still unknown.
        </p>
      )}

      <p className="ct-checklist-note">
        This tracks preparation, not whether a project is ready for approval.
        Selections last until you reload or leave this page.
      </p>

      {enhanced && (
        <div className="ct-checklist-actions">
          <button
            type="button"
            className="ct-button"
            onClick={() => window.print()}
          >
            Print meeting sheet
          </button>
          <a className="ct-button ct-button--secondary" href={WORKSHEET_PDF}>
            Open the fillable worksheet
          </a>
        </div>
      )}
    </div>
  );
}
