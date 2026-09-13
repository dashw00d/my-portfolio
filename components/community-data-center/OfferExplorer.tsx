import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  OFFER_DOMAIN_MAX,
  OFFER_DOMAIN_MIN,
  compareOffers,
} from "../../lib/community-data-center";

const DOMAIN_SPAN = OFFER_DOMAIN_MAX - OFFER_DOMAIN_MIN;
const ZERO_PERCENT = ((0 - OFFER_DOMAIN_MIN) / DOMAIN_SPAN) * 100;

const TICKS = [OFFER_DOMAIN_MIN, 0, 60, OFFER_DOMAIN_MAX];

const INPUT_ROWS: Array<[string, string, string]> = [
  ["Annual taxes before discretionary abatement", "8.00", "8.00"],
  ["Annual abatement, deducted", "5.00", "0.00"],
  ["Annual contractual benefit", "0.50", "1.50"],
  ["Annual services and monitoring, deducted", "1.50", "1.50"],
  ["Annual net recurring value", "2.00", "8.00"],
  ["Unreimbursed public capital at year zero, deducted", "12.00", "0.00"],
  ["One-time benefit at year zero", "5.00", "2.00"],
];

function formatMillions(value: number): string {
  const sign = value < 0 ? "−" : "";
  return `${sign}$${Math.abs(value).toFixed(2)}m`;
}

function formatMillionsLong(value: number): string {
  const sign = value < 0 ? "−" : "";
  return `${sign}$${Math.abs(value).toFixed(2)} million`;
}

function yearLabel(year: number): string {
  return year === 1 ? "1 year" : `${year} years`;
}

function toPercent(value: number): number {
  return ((value - OFFER_DOMAIN_MIN) / DOMAIN_SPAN) * 100;
}

function barGeometry(value: number): { left: string; width: string } {
  const valuePercent = toPercent(value);
  return {
    left: `${Math.min(valuePercent, ZERO_PERCENT)}%`,
    width: `${Math.abs(valuePercent - ZERO_PERCENT)}%`,
  };
}

function tickAlignment(value: number): string {
  if (value === OFFER_DOMAIN_MIN) {
    return "none";
  }
  if (value === OFFER_DOMAIN_MAX) {
    return "translateX(-100%)";
  }
  return "translateX(-50%)";
}

export default function OfferExplorer() {
  const [years, setYears] = useState(20);
  const [enhanced, setEnhanced] = useState(false);
  const [announcedYears, setAnnouncedYears] = useState(20);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setEnhanced(true);
  }, []);

  useEffect(() => {
    if (!enhanced) {
      return;
    }
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setAnnouncedYears(years);
      timerRef.current = null;
    }, 250);
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [years, enhanced]);

  const result = compareOffers(years);
  const announced = compareOffers(announcedYears);
  const statusSentence = `Over ${yearLabel(announced.years)}, Offer B has ${formatMillionsLong(announced.difference)} more net present value under these assumptions.`;

  const rows = [
    { key: "a", label: "Offer A", value: result.offerA },
    { key: "b", label: "Offer B", value: result.offerB },
  ];

  return (
    <div className="ct-offer">
      <p className="ct-offer-disclaimer">
        Fictional example from the toolkit · Not market rates or a valuation of a
        real project
      </p>

      {enhanced && (
        <div className="ct-slider">
          <label className="ct-slider-label" htmlFor="ct-offer-years">
            Years of operation included
            <output className="ct-slider-value" htmlFor="ct-offer-years">
              {result.years}
            </output>
          </label>
          <input
            id="ct-offer-years"
            type="range"
            min={1}
            max={20}
            step={1}
            value={years}
            aria-valuetext={`${yearLabel(result.years)} of operation`}
            onChange={(event) => setYears(Number(event.target.value))}
          />
          <div className="ct-slider-endpoints" aria-hidden="true">
            <span>1 year</span>
            <span>20 years</span>
          </div>
        </div>
      )}

      <div className="ct-offer-results">
        <div className="ct-offer-result" data-offer="a">
          <p className="ct-offer-result-label">Offer A</p>
          <p className="ct-offer-result-value ct-numeric">
            {formatMillions(result.offerA)}
          </p>
          <p className="ct-offer-result-caption">Value in today's dollars</p>
        </div>
        <div className="ct-offer-result" data-offer="b">
          <p className="ct-offer-result-label">Offer B</p>
          <p className="ct-offer-result-value ct-numeric">
            {formatMillions(result.offerB)}
          </p>
          <p className="ct-offer-result-caption">Value in today's dollars</p>
        </div>
      </div>

      <div className="ct-offer-chart" aria-hidden="true">
        <div className="ct-offer-row ct-offer-row--ticks">
          <span />
          <div className="ct-offer-ticks">
            {TICKS.map((tick) => (
              <span
                key={tick}
                className={`ct-offer-tick${tick === 0 ? " ct-offer-tick--zero" : ""}`}
                style={{
                  left: `${toPercent(tick)}%`,
                  transform: tickAlignment(tick),
                }}
              >
                {tick < 0 ? `−${Math.abs(tick)}` : tick}
              </span>
            ))}
          </div>
          <span />
        </div>
        {rows.map((row) => (
          <div className="ct-offer-row" key={row.key}>
            <span className="ct-offer-row-label">{row.label}</span>
            <div className="ct-offer-track">
              <span
                className="ct-offer-zero"
                style={{ left: `${ZERO_PERCENT}%` }}
              />
              <span
                className={`ct-offer-bar ct-offer-bar--${row.key}`}
                style={barGeometry(row.value)}
              />
            </div>
            <span className="ct-offer-row-value ct-numeric">
              {formatMillions(row.value)}
            </span>
          </div>
        ))}
      </div>

      <p className="ct-offer-sentence">
        Over {yearLabel(result.years)}, Offer B has{" "}
        {formatMillionsLong(result.difference)} more net present value under
        these assumptions.
      </p>
      <p role="status" aria-live="polite" className="ct-visually-hidden">
        {statusSentence}
      </p>

      <p className="ct-offer-note">
        The larger opening payment in Offer A comes with a public capital cost
        and lower recurring value. Both offers still need comparison with
        current use and other realistic options.
      </p>

      <table className="ct-visually-hidden">
        <caption>{`Offer comparison over ${yearLabel(result.years)}`}</caption>
        <thead>
          <tr>
            <th scope="col">Offer</th>
            <th scope="col">Net present value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Offer A</th>
            <td>{formatMillions(result.offerA)}</td>
          </tr>
          <tr>
            <th scope="row">Offer B</th>
            <td>{formatMillions(result.offerB)}</td>
          </tr>
          <tr>
            <th scope="row">Difference</th>
            <td>{formatMillions(result.difference)}</td>
          </tr>
        </tbody>
      </table>

      <p className="ct-offer-warning">
        A larger financial benefit does not resolve unacceptable impacts or
        missing legal authority.
      </p>

      <details className="ct-disclosure">
        <summary className="ct-disclosure-summary">
          <span>How these numbers work</span>
          <ChevronDown size={20} aria-hidden="true" />
        </summary>
        <div className="ct-disclosure-body">
          <div className="ct-table-scroll">
            <table className="ct-data-table">
              <caption>
                Fictional example · Millions of constant dollars
              </caption>
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col" className="ct-num">
                    Offer A
                  </th>
                  <th scope="col" className="ct-num">
                    Offer B
                  </th>
                </tr>
              </thead>
              <tbody>
                {INPUT_ROWS.map(([item, offerA, offerB]) => (
                  <tr key={item}>
                    <th scope="row">{item}</th>
                    <td className="ct-num">{offerA}</td>
                    <td className="ct-num">{offerB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            This example describes a fictional 100 MW project for one local
            government. It assumes end-of-year payments, a 4% real discount
            rate, constant dollars, no terminal value, the same project impacts
            under each offer, and authority to receive the stated payments. The
            original guide compares 20 operating years; this explorer also shows
            shorter horizons using the same simplified inputs.
          </p>
          <p>
            Net present value translates future net payments into today's value
            using a stated discount rate.
          </p>
          <p>
            Real assessment values, exemptions, construction dates, and project
            phases change. Replace simplified inputs with a reviewed local model
            before evaluating an actual offer.
          </p>
        </div>
      </details>
    </div>
  );
}
