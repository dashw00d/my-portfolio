import LegalPageLayout from "@/components/LegalPageLayout";

export default function RefundCancellationPolicy() {
  return (
    <LegalPageLayout
      title="Refund & Cancellation Policy"
      description="Dashwood's refund and cancellation terms for software-development, systems-engineering, automation, and consulting services."
      path="/refund-cancellation-policy"
    >
      <p className="lead">
        This policy applies to project, consulting, systems-engineering,
        automation, and software-development services provided by Dashwood. A
        signed proposal, statement of work, or other written agreement may contain
        project-specific terms. If those terms conflict with this policy, the
        project-specific written agreement controls.
      </p>

      <div>
        <h2>Deposits and retainers</h2>
        <p>
          Deposits reserve project capacity and are applied toward the fees for the
          agreed work. Unless a written agreement says otherwise:
        </p>
        <ul>
          <li>
            A deposit may be refunded if you cancel before work begins and more
            than five business days before the scheduled start date, less any
            non-recoverable payment-processing fees and approved expenses already
            incurred for the project.
          </li>
          <li>
            A deposit is non-refundable once work begins or when cancellation
            occurs within five business days of the scheduled start date, because
            time has been reserved and other work may have been declined.
          </li>
          <li>
            If Dashwood cancels before work begins and cannot offer an acceptable
            new start date, the deposit will be refunded in full.
          </li>
        </ul>
      </div>

      <div>
        <h2>Work performed and completed work</h2>
        <p>
          Fees for time already worked, milestones already delivered, and
          completed or accepted work are non-refundable. If you prepaid for work
          that has not been performed, any eligible refund will be calculated
          after deducting:
        </p>
        <ul>
          <li>fees for work performed through the cancellation date;</li>
          <li>completed milestones and deliverables;</li>
          <li>approved third-party costs or other non-recoverable expenses; and</li>
          <li>any amount made non-refundable by the written project agreement.</li>
        </ul>
      </div>

      <div>
        <h2>Service concerns</h2>
        <p>
          If delivered work materially fails to match the agreed scope, notify me
          in writing within 10 business days after delivery and describe the issue
          in reasonable detail. Dashwood will first have a reasonable opportunity
          to correct the work. If the issue cannot be corrected, Dashwood may issue
          an appropriate partial or full refund for the affected deliverable. A
          change in preference, business conditions, or project direction does not
          make completed work refundable.
        </p>
      </div>

      <div>
        <h2>How to cancel</h2>
        <p>
          Send a cancellation request to{" "}
          <a href="mailto:ryan@dashwood.net">ryan@dashwood.net</a>. The request
          should include your name, company, project or invoice reference, and
          requested cancellation date. Cancellation is effective when Dashwood
          confirms receipt in writing. Unless otherwise agreed, work stops at a
          reasonable transition point, and you remain responsible for work
          performed and costs incurred through that point.
        </p>
      </div>

      <div>
        <h2>How to request a refund</h2>
        <p>
          Email <a href="mailto:ryan@dashwood.net">ryan@dashwood.net</a> within 10
          business days of the cancellation or disputed delivery. Include the
          invoice or payment reference, the amount requested, and the reason for
          the request. I will review the request against this policy and the
          applicable written agreement and respond as promptly as reasonably
          possible.
        </p>
      </div>

      <div>
        <h2>Approved refunds</h2>
        <p>
          Approved refunds are sent to the original payment method whenever
          possible. Dashwood generally submits an approved refund within five to 10
          business days. Your bank or payment provider may require additional time
          to post the credit.
        </p>
      </div>

      <div>
        <h2>Contact</h2>
        <p>
          Questions about a cancellation or refund can be sent to{" "}
          <a href="mailto:ryan@dashwood.net">ryan@dashwood.net</a> or discussed by
          phone at <a href="tel:+17372059226">(737) 205-9226</a>.
        </p>
      </div>
    </LegalPageLayout>
  );
}
