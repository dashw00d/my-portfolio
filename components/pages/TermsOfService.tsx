import Link from "@/components/Link";

export default function TermsOfService() {
  return (
    <>
      <p className="lead">
        These Terms of Service ("Terms") govern your use of dashwood.net and
        services provided by Dashwood, operated by Ryan Stefan. By hiring Dashwood
        or using this website, you agree to these Terms. Project-specific terms in
        a signed proposal, statement of work, or other written agreement control if
        they conflict with these Terms.
      </p>

      <div>
        <h2>Services and scope</h2>
        <p>
          Dashwood provides project, consulting, systems-engineering, automation,
          and software-development services. The scope, deliverables, schedule,
          assumptions, fees, and acceptance criteria for an engagement are agreed
          separately in writing. Website descriptions are general information and
          are not a promise that a particular service, result, or timeline applies
          to your project.
        </p>
        <p>
          Requests outside the agreed scope may require a written change order,
          revised estimate, additional fees, or a revised delivery schedule.
        </p>
      </div>

      <div>
        <h2>Proposals and estimates</h2>
        <p>
          A proposal or estimate is valid for the period stated in it. Estimates
          are based on the information available when prepared. New requirements,
          incomplete information, third-party limitations, or requested changes
          may affect cost and timing. No engagement begins until both parties agree
          to the applicable scope and payment arrangements.
        </p>
      </div>

      <div>
        <h2>Payment terms</h2>
        <p>
          Fees, deposits, milestones, and invoice due dates are stated in the
          applicable written agreement or invoice. All amounts are in USD unless
          explicitly stated otherwise. You are responsible for applicable taxes,
          excluding taxes on Dashwood&apos;s income. Dashwood may pause work or
          withhold delivery when an undisputed payment is overdue.
        </p>
        <p>
          Payment and refund eligibility are also subject to the{" "}
          <Link href="/refund-cancellation-policy">
            Refund &amp; Cancellation Policy
          </Link>
          .
        </p>
      </div>

      <div>
        <h2>Client responsibilities</h2>
        <p>You agree to:</p>
        <ul>
          <li>provide timely, accurate information, decisions, and feedback;</li>
          <li>
            provide lawful access to the systems, accounts, content, and personnel
            reasonably needed for the work;
          </li>
          <li>
            confirm that you have the right to provide all materials and data you
            supply;
          </li>
          <li>
            maintain appropriate backups and review deliverables before production
            use; and
          </li>
          <li>
            use deliverables and services lawfully and in accordance with relevant
            third-party terms.
          </li>
        </ul>
        <p>
          Delays in access, content, approvals, or feedback may extend the schedule
          and may require rescheduling reserved work.
        </p>
      </div>

      <div>
        <h2>Ownership and intellectual property</h2>
        <p>
          Unless the written project agreement says otherwise, and after all
          amounts due for the engagement are paid, you own the final custom
          deliverables specifically created for you. Drafts, rejected concepts,
          and unpaid deliverables do not transfer.
        </p>
        <p>
          Dashwood retains ownership of pre-existing materials, reusable tools,
          templates, libraries, methods, generalized know-how, and improvements
          that are not uniquely created for you. To the extent those materials are
          embedded in a paid deliverable, Dashwood grants you a perpetual,
          non-exclusive license to use them as part of that deliverable. Open-source
          software and other third-party materials remain subject to their own
          licenses and terms.
        </p>
      </div>

      <div>
        <h2>Confidentiality</h2>
        <p>
          Each party will use reasonable care to protect non-public information
          identified as confidential or that should reasonably be understood to be
          confidential. This obligation does not apply to information that is
          public through no breach, already lawfully known, independently
          developed, or lawfully received from another source. Disclosure may be
          made when required by law.
        </p>
      </div>

      <div>
        <h2>Third-party services</h2>
        <p>
          Deliverables may interact with hosting platforms, APIs, payment
          processors, open-source packages, or other third-party products. Those
          services are controlled by their providers and may change, become
          unavailable, or impose separate fees and terms. Dashwood is not
          responsible for third-party services outside its reasonable control.
        </p>
      </div>

      <div>
        <h2>Termination</h2>
        <p>
          Either party may terminate an engagement as permitted by the applicable
          written agreement. If no termination terms are stated there, either party
          may terminate by written notice. Dashwood may suspend or terminate work
          immediately for nonpayment, unlawful use, security risk, or a material
          breach that is not promptly corrected.
        </p>
        <p>
          On termination, you must pay for work performed and approved costs
          incurred through the effective termination date. Dashwood will provide
          paid-for work in its then-current state. Terms concerning payment,
          ownership, confidentiality, disclaimers, and liability survive
          termination.
        </p>
      </div>

      <div>
        <h2>Warranties and disclaimers</h2>
        <p>
          Dashwood will perform services in a professional and workmanlike manner.
          Except for that commitment and any express warranty in a written project
          agreement, the website, services, and deliverables are provided "as is"
          to the fullest extent permitted by law. Dashwood does not guarantee
          uninterrupted operation, compatibility with every system, or any
          particular business, revenue, search, or performance result.
        </p>
      </div>

      <div>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, neither party will be liable for
          indirect, incidental, special, exemplary, or consequential damages, or
          for lost profits, revenue, data, or business opportunities, arising from
          an engagement. Dashwood&apos;s total liability arising from a project will
          not exceed the fees you paid to Dashwood for the specific services giving
          rise to the claim during the six months before the event giving rise to
          liability. These limits do not apply where applicable law does not permit
          them.
        </p>
      </div>

      <div>
        <h2>Governing law</h2>
        <p>
          These Terms are governed by the laws of the State of Texas, without
          regard to conflict-of-law rules. Any dispute not resolved informally will
          be brought in a court with jurisdiction in Harris County, Texas, unless
          applicable law requires otherwise.
        </p>
      </div>

      <div>
        <h2>Changes and severability</h2>
        <p>
          Dashwood may update these Terms for future website use or engagements by
          posting a revised version with a new effective date. Changes do not alter
          an existing signed agreement unless both parties agree. If any provision
          is unenforceable, the remaining provisions remain in effect.
        </p>
      </div>

      <div>
        <h2>Contact</h2>
        <p>
          Questions about these Terms may be sent to{" "}
          <a href="mailto:ryan@dashwood.net">ryan@dashwood.net</a> or discussed by
          phone at <a href="tel:+17372059226">(737) 205-9226</a>. Dashwood is based
          in Houston, Texas.
        </p>
      </div>
    </>
  );
}
