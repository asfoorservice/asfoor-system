#!/bin/sh
# Stamp a new version into index.html and version.json (run before every commit).
set -e
cd "$(dirname "$0")"
V=$(TZ=Africa/Cairo date +%Y.%m.%d-%H%M)
sed -i -E "s/const APP_VERSION = '[^']*';/const APP_VERSION = '$V';/" index.html
printf '{ "version": "%s" }\n' "$V" > version.json
echo "$V"
