#!/bin/sh
set -eu

htpasswd -bc /etc/nginx/.htpasswd "$APP_USERNAME" "$APP_PASSWORD" >/dev/null
exec nginx -g 'daemon off;'