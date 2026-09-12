import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { PROPOSAL_CONFIG } from "../lib/proposal/config.ts";

// Isolated storage and a stub mail transport: never touches real proposals or sends email.
const directory = mkdtempSync(path.join(tmpdir(), "proposal-check-"));
const env = {
  ...process.env,
  PROPOSAL_DATA_DIR: directory,
  PROPOSAL_CLIENT_TOKEN: "test-client",
  PROPOSAL_ADMIN_TOKEN: "test-admin",
};
const api = path.resolve("public/proposal/api.php");
function request(method: string, uri: string, body?: unknown, admin = "") {
  const result = spawnSync("php", ["-d", "sendmail_path=/bin/true", api], {
    env: {
      ...env,
      REQUEST_METHOD: method,
      REQUEST_URI: uri,
      HTTP_X_PROPOSAL_ADMIN: admin,
    },
    input: body ? JSON.stringify(body) : "",
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  const match = result.stdout.match(/^HTTP (\d+)\n([\s\S]*)$/);
  assert.ok(match, result.stdout);
  return { status: Number(match[1]), data: JSON.parse(match[2]) };
}
const config = {
  title: "A new website",
  clientName: "Test client",
  clientNames: ["Alex"],
  senderName: "Ryan Stefan",
  senderEmail: "ryan@example.test",
  introduction: "A proposal to explore together.",
  closingNote: "Let me know your thoughts.",
  baseOption: {
    id: "base",
    label: "Website",
    price: 120,
    summary: "A new site",
    includes: ["Design", "Build"],
    selectedByDefault: false,
  },
  sections: [
    {
      id: "scope",
      title: "Design",
      summary: "The direction",
      bullets: ["Mobile layouts"],
    },
  ],
  oneTimeOptions: [
    {
      id: "extra",
      label: "Gallery",
      price: 60,
      summary: "Photos",
      includes: [],
      selectedByDefault: true,
    },
  ],
  recurringOptions: [
    {
      id: "support",
      label: "Updates",
      price: 25,
      period: "event",
      summary: "Per event",
      selectedByDefault: true,
    },
  ],
  thirdPartyCosts: [],
  previewImage: null,
  previewCaption: "",
};
try {
  // Seed the previous schema and real feedback to exercise migration of an existing installation.
  const seed = spawnSync(
    "php",
    [
      "-r",
      `
    $db = new PDO('sqlite:' . getenv('PROPOSAL_DATA_DIR') . '/proposals.sqlite');
    $db->exec('CREATE TABLE proposals (id TEXT PRIMARY KEY, client_token_hash TEXT NOT NULL UNIQUE, admin_token_hash TEXT NOT NULL UNIQUE, config_version INTEGER NOT NULL, status TEXT NOT NULL, expires_at INTEGER NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)');
    $insert = $db->prepare('INSERT INTO proposals VALUES (?, ?, ?, 1, "active", NULL, 1, 1)');
    $insert->execute(['southern-star-website-rebuild', hash('sha256', 'test-client'), hash('sha256', 'test-admin')]);
  `,
    ],
    { env, encoding: "utf8" },
  );
  assert.equal(seed.status, 0, seed.stderr);
  const original = request("GET", "/proposal/api.php?token=test-client");
  assert.equal(original.status, 200);
  assert.equal(original.data.clientPath, "/p/southern-star/");
  const listUri = "/proposal/api.php/admin?action=list";
  assert.equal(request("GET", listUri).status, 403);
  assert.equal(request("GET", `${listUri}&token=test-client`).status, 403);
  const initialList = request("GET", listUri, undefined, "test-admin");
  assert.equal(initialList.status, 200);
  assert.equal(initialList.data.proposals.length, 1);
  assert.equal(initialList.data.proposals[0].clientUrl, "/p/southern-star/?token=test-client");
  const originalState = original.data.state;
  originalState.selections.displayName = "Original client";
  assert.equal(
    request("PUT", "/proposal/api.php?token=test-client", {
      revision: 1,
      state: originalState,
    }).status,
    200,
  );
  assert.equal(
    request("POST", "/proposal/api.php/admin?action=create", { config }).status,
    404,
  );
  assert.equal(
    request("POST", "/proposal/api.php/admin?action=create&token=test-client", {
      config,
    }).status,
    404,
  );
  assert.equal(
    request(
      "POST",
      "/proposal/api.php/admin?action=create",
      {
        config: { ...config, baseOption: { ...config.baseOption, price: -1 } },
      },
      "test-admin",
    ).status,
    422,
  );
  assert.equal(
    request(
      "POST",
      "/proposal/api.php/admin?action=create",
      {
        config: {
          ...config,
          sections: [{ ...config.sections[0], id: "base" }],
        },
      },
      "test-admin",
    ).status,
    422,
  );
  assert.equal(
    request(
      "POST",
      "/proposal/api.php/admin?action=create",
      { config: { ...config, previewImage: "//example.test/image.jpg" } },
      "test-admin",
    ).status,
    422,
  );
  const created = request(
    "POST",
    "/proposal/api.php/admin?action=create",
    { config },
    "test-admin",
  );
  assert.equal(created.status, 201);
  const client = new URL(
    created.data.clientUrl,
    "https://example.test",
  ).searchParams.get("token")!;
  const admin = new URL(
    created.data.reviewUrl,
    "https://example.test",
  ).searchParams.get("admin")!;
  assert.equal(client.length, 64);
  assert.notEqual(client, admin);
  const uri = `/proposal/api.php?token=${client}`;
  const loaded = request("GET", uri);
  assert.equal(loaded.status, 200);
  assert.equal(loaded.data.clientPath, "/p/proposal/");
  assert.equal(loaded.data.config.title, config.title);
  const proposalId = loaded.data.config.id;
  assert.equal(request("GET", listUri, undefined, admin).status, 403);
  const ownerReviewUri = `/proposal/api.php/review?proposal=${proposalId}`;
  assert.equal(request("GET", ownerReviewUri, undefined, admin).status, 403);
  assert.equal(request("GET", ownerReviewUri, undefined, client).status, 403);
  assert.equal(request("GET", ownerReviewUri, undefined, "test-admin").data.config.id, proposalId);
  assert.equal(request("GET", "/proposal/api.php/review?proposal=missing", undefined, "test-admin").status, 404);
  assert.equal(loaded.data.state.selections.baseSelected, false);
  assert.deepEqual(loaded.data.state.selections.oneTimeOptionIds, ["extra"]);
  assert.deepEqual(loaded.data.state.selections.recurringOptionIds, [
    "support",
  ]);
  assert.equal(loaded.data.state.selections.displayName, "");
  const state = loaded.data.state;
  state.selections.baseSelected = true;
  state.selections.sectionFeedback = {
    scope: { comment: "Love this direction", status: "interested" },
  };
  state.doodles = [
    {
      id: "mark-1",
      targetId: "scope",
      surfaceWidth: 320,
      points: [
        { x: 0.1, y: 0.2 },
        { x: 0.5, y: 0.6 },
      ],
    },
  ];
  const saved = request("PUT", uri, {
    revision: 1,
    state,
    config: { ...config, baseOption: { ...config.baseOption, price: 0 } },
  });
  assert.equal(saved.status, 200);
  assert.equal(saved.data.revision, 2);
  assert.equal(request("PUT", uri, { revision: 1, state }).status, 409);
  const reopened = request("GET", uri).data;
  assert.equal(reopened.config.baseOption.price, 120);
  assert.equal(reopened.state.doodles[0].surfaceWidth, 320);
  assert.equal(
    reopened.state.selections.sectionFeedback.scope.comment,
    "Love this direction",
  );
  assert.equal(
    request("GET", `/proposal/api.php/review?token=${client}`).status,
    404,
  );
  assert.equal(request("POST", uri, { displayName: "Alex" }).status, 428);
  assert.equal(request("POST", uri, { displayName: "Alex", revision: 1 }).status, 409);
  const submitted = request("POST", uri, { displayName: "Alex", revision: reopened.revision });
  assert.equal(submitted.status, 200);
  assert.equal(submitted.data.snapshot.config.baseOption.price, 120);
  const review = request("GET", "/proposal/api.php/review", undefined, admin);
  assert.equal(review.status, 200);
  assert.equal(review.data.clientToken, client);
  assert.equal(review.data.clientPath, "/p/proposal/");
  assert.equal(review.data.submissions.length, 1);
  assert.equal(review.data.submissions[0].state.doodles.length, 1);
  const listing = request("GET", listUri, undefined, "test-admin");
  assert.equal(listing.status, 200);
  assert.equal(listing.data.proposals.length, 2);
  const listed = listing.data.proposals.find((item: { id: string }) => item.id === proposalId);
  assert.equal(listed.title, config.title);
  assert.equal(listed.clientName, config.clientName);
  assert.equal(listed.responseCount, 1);
  assert.equal(listed.clientUrl, created.data.clientUrl);
  assert.equal(listed.reviewUrl, `/proposal/review/?proposal=${proposalId}`);
  assert.ok(Date.parse(listed.lastActivityAt) >= Date.parse(listed.createdAt));
  assert.equal(listed.lastSubmittedAt, review.data.submissions[0].submittedAt);
  for (const key of ["state", "config", "admin_token_hash", "client_token_hash", "adminToken"]) {
    assert.equal(key in listed, false);
  }
  const ownerStatusUri = `/proposal/api.php/admin?action=set_status&proposal=${proposalId}`;
  const copyUri = `/proposal/api.php/admin?action=update_copy&proposal=${proposalId}`;
  const copy = { ...reopened.config, title: "The revised proposal", introduction: "Hello Alex. Here is the plan." };
  assert.equal(request("POST", copyUri, { config: copy, configVersion: 1 }, client).status, 403);
  assert.equal(request("POST", copyUri, { config: copy, configVersion: 1 }, admin).status, 403);
  assert.equal(request("POST", copyUri, { config: copy }, "test-admin").status, 428);
  assert.equal(request("POST", copyUri, { config: { ...copy, title: "" }, configVersion: 1 }, "test-admin").status, 422);
  assert.equal(request("POST", copyUri, { config: { ...copy, sections: [] }, configVersion: 1 }, "test-admin").status, 422);
  const edited = request("POST", copyUri, { config: { ...copy, baseOption: { ...copy.baseOption, price: 0 } }, configVersion: 1 }, "test-admin");
  assert.equal(edited.status, 200);
  assert.equal(edited.data.configVersion, 2);
  assert.equal(edited.data.config.baseOption.price, config.baseOption.price);
  const afterCopy = request("GET", uri).data;
  assert.equal(afterCopy.config.title, copy.title);
  assert.equal(afterCopy.config.introduction, copy.introduction);
  assert.equal(request("GET", "/proposal/api.php/review", undefined, admin).data.submissions.length, 1);
  assert.deepEqual(afterCopy.state, reopened.state);
  assert.equal(afterCopy.revision, reopened.revision);
  assert.equal(request("GET", "/proposal/api.php/review", undefined, admin).data.submissions[0].config.title, config.title);
  assert.equal(request("GET", listUri, undefined, "test-admin").data.proposals.find((item: { id: string }) => item.id === proposalId).clientUrl, created.data.clientUrl);
  assert.equal(request("POST", copyUri, { config: { ...copy, title: "Stale overwrite" }, configVersion: 1 }, "test-admin").status, 409);
  assert.equal(request("GET", uri).data.config.title, copy.title);
  assert.equal(request("POST", "/proposal/api.php/admin?action=update_copy", { config: copy, configVersion: 2 }, admin).status, 200);
  // Copy changes do not add an extra review or confirmation step for clients.
  const afterEditSubmission = request("POST", uri, { displayName: "Alex", revision: afterCopy.revision, configVersion: 1 });
  assert.equal(afterEditSubmission.status, 200);
  assert.equal(afterEditSubmission.data.snapshot.config.title, copy.title);
  assert.equal(request("POST", ownerStatusUri, { status: "read_only" }, admin).status, 403);
  assert.equal(request("POST", ownerStatusUri, { status: "read_only" }, "test-admin").status, 200);
  assert.equal(request("GET", ownerReviewUri, undefined, "test-admin").data.status, "read_only");
  assert.equal(
    request("GET", "/proposal/api.php?token=test-client").data.state.selections
      .displayName,
    "Original client",
  );
  assert.equal(
    request("GET", "/proposal/api.php/review", undefined, "test-admin").data
      .submissions.length,
    0,
  );
  assert.equal(
    request(
      "POST",
      "/proposal/api.php/admin?action=set_status",
      { status: "read_only" },
      admin,
    ).status,
    200,
  );
  assert.equal(request("PUT", uri, { revision: 2, state }).status, 423);
  assert.equal(request("GET", uri).status, 200);
  assert.equal(
    request(
      "POST",
      "/proposal/api.php/admin?action=set_status",
      { status: "revoked" },
      admin,
    ).status,
    200,
  );
  assert.equal(request("GET", uri).status, 410);
  assert.equal(
    request("GET", "/proposal/api.php?token=test-client").status,
    200,
  );
  assert.equal(
    request(
      "POST",
      "/proposal/api.php/admin?action=set_status",
      { status: "active" },
      admin,
    ).status,
    200,
  );
  assert.equal(
    request(
      "POST",
      "/proposal/api.php/admin?action=set_expiry",
      { expiresAt: "2000-01-01T00:00:00Z" },
      admin,
    ).status,
    200,
  );
  assert.equal(request("GET", uri).status, 410);
  assert.equal(request("POST", uri, { displayName: "Alex" }).status, 410);
  assert.equal(
    request("GET", "/proposal/api.php/review", undefined, admin).status,
    200,
  );
  const legacyBefore = request("GET", "/proposal/api.php?token=test-client").data;
  const legacyEdit = request("POST", "/proposal/api.php/admin?action=update_copy&proposal=southern-star-website-rebuild", {
    configVersion: 1,
    config: { ...PROPOSAL_CONFIG, introduction: "Hi Erica and Taylor. Here is the plan." },
  }, "test-admin");
  assert.equal(legacyEdit.status, 200);
  const legacyAfter = request("GET", "/proposal/api.php?token=test-client").data;
  assert.equal(legacyAfter.config.introduction, "Hi Erica and Taylor. Here is the plan.");
  assert.equal(legacyAfter.clientPath, "/p/southern-star/");
  assert.deepEqual(legacyAfter.state, legacyBefore.state);
  assert.equal(request("GET", listUri, undefined, "test-admin").data.proposals.find((item: { id: string }) => item.id === PROPOSAL_CONFIG.id).clientUrl, "/p/southern-star/?token=test-client");
  console.log(
    "Proposal checks passed: legacy migration, creation, validation, workspace listing and owner access, copy editing and version conflicts, stable links and feedback, per-proposal isolation, defaults, save/reopen, drawings, snapshots, read-only, revocation, and expiry. No email sent.",
  );
} finally {
  rmSync(directory, { recursive: true, force: true });
}
