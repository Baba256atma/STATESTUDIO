#!/bin/bash

echo "🧠 Running Nexora Psych Smoke Test..."

cd "$(dirname "$0")/frontend" || {
  echo "❌ Failed to enter frontend directory"
  exit 1
}

npm run psych:smoke

if [ $? -eq 0 ]; then
  echo "✅ Psych Smoke Test Passed"
else
  echo "❌ Psych Smoke Test Failed"
  exit 1
fi
