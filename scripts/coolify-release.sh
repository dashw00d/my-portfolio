#!/bin/sh
# Pull-and-restart on Coolify. Never force-rebuild; this host is not CI.
set -eu

: "${COOLIFY_TOKEN:?}"
: "${COOLIFY_UUID:?}"
: "${IMAGE_TAG:?}"

base="${COOLIFY_URL:-https://coolify.homeforged.com}/api/v1"
auth="Authorization: Bearer ${COOLIFY_TOKEN}"

image="$IMAGE_TAG"
if ! printf '%s' "$image" | grep -q ':'; then
  image="${image}:sha-$(printf '%s' "${GITHUB_SHA}" | cut -c1-7)"
fi

echo "Setting DASHWOOD_IMAGE=${image}"

existing=$(curl -fsS -H "$auth" "${base}/applications/${COOLIFY_UUID}/envs")
env_uuid=$(printf '%s' "$existing" | python3 -c '
import json,sys
rows=json.load(sys.stdin)
items=rows if isinstance(rows,list) else rows.get("data",[])
for row in items:
    if row.get("key")=="DASHWOOD_IMAGE" and not row.get("is_preview"):
        print(row.get("uuid",""))
        break
')

if [ -n "$env_uuid" ]; then
  curl -fsS -X PATCH -H "$auth" -H "Content-Type: application/json" \
    "${base}/applications/${COOLIFY_UUID}/envs" \
    -d "{\"uuid\":\"${env_uuid}\",\"key\":\"DASHWOOD_IMAGE\",\"value\":\"${image}\"}" >/dev/null
else
  curl -fsS -X POST -H "$auth" -H "Content-Type: application/json" \
    "${base}/applications/${COOLIFY_UUID}/envs" \
    -d "{\"key\":\"DASHWOOD_IMAGE\",\"value\":\"${image}\"}" >/dev/null
fi

curl -fsS -X PATCH -H "$auth" -H "Content-Type: application/json" \
  "${base}/applications/${COOLIFY_UUID}" \
  -d '{"build_pack":"dockercompose","is_auto_deploy_enabled":false}' >/dev/null

echo "Restarting Coolify resource (no force rebuild)"
curl -fsS -X POST -H "$auth" \
  "${base}/deploy?uuid=${COOLIFY_UUID}&force=false" 
echo
