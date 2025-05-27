#!/usr/bin/env bash
set -euo pipefail
DOMAIN="docs.hokus.ai"
SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/docs" && pwd)"
echo "${DOMAIN}" > "${SITE_DIR}/static/CNAME"
cd "${SITE_DIR}"
npm install
npm run deploy