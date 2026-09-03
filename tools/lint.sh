#!/bin/sh
# Syntax-check every game script. CI runs this before packaging a build.
set -e
cd "$(dirname "$0")/.."
for f in docs/js/*.js docs/service_worker.js; do
    node --check "$f"
done
echo "lint: ok"
