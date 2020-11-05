#!/usr/bin/env bash

set -e

echo "Starting server..."
echo "    visit http://127.0.0.1:8080/"
./node_modules/.bin/http-server ./www -c-1 -s
