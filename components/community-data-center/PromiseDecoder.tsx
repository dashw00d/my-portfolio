import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { decoderExamples } from "../../lib/community-data-center";

type DecoderId = (typeof decoderExamples)[number]["id"];

export default function PromiseDecoder() {
  const [selectedId, setSelectedId] = useState<DecoderId>("jobs");
  const [enhanced, setEnhanced] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    setEnhanced(true);
  }, []);

  const handleSelect = (id: DecoderId, label: string) => {
    setSelectedId(id);
    setAnnouncement(`${label} example selected.`);
  };

  return (
    <div className="ct-decoder">
      <fieldset className="ct-decoder-fieldset">
        <legend className="ct-decoder-legend">Choose a promise to unpack</legend>
        <div className="ct-segmented">
          {decoderExamples.map((example) => (
            <label key={example.id} className="ct-segmented-option">
              <input
                type="radio"
                name="ct-decoder-choice"
                value={example.id}
                checked={selectedId === example.id}
                onChange={() => handleSelect(example.id, example.label)}
              />
              <span>{example.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <p role="status" aria-live="polite" className="ct-visually-hidden">
        {announcement}
      </p>

      <div className="ct-decoder-articles">
        {decoderExamples.map((example) => (
          <article
            key={example.id}
            className="ct-decoder-article"
            hidden={enhanced && example.id !== selectedId}
            aria-labelledby={`ct-decoder-${example.id}-statement`}
          >
            <p className="ct-decoder-tag">Illustrative statement</p>
            <h3
              id={`ct-decoder-${example.id}-statement`}
              className="ct-decoder-statement"
            >
              {example.statement}
            </h3>
            <details
              key={`${example.id}-${selectedId}`}
              className="ct-decoder-answer"
            >
              <summary className="ct-decoder-summary">
                <span className="ct-decoder-summary-label">
                  <span className="ct-label-closed">Show the better question</span>
                  <span className="ct-label-open">Hide the better question</span>
                </span>
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <div className="ct-decoder-body">
                <p className="ct-decoder-question">{example.question}</p>
                <div className="ct-decoder-evidence">
                  <h4>Evidence to request</h4>
                  <p>{example.evidence}</p>
                </div>
              </div>
            </details>
          </article>
        ))}
      </div>
    </div>
  );
}
