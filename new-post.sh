#!/usr/bin/env bash
# Variables
TIME=$(date +'%Y-%m-%d')

# User input
echo "Title?"
read first

title=$(echo $first |tr -d '\')
filename=$(echo $title |tr '[:upper:]' '[:lower:]')
FILE="_posts/$TIME-$filename.md"

cat > "$FILE" <<EOF
---
layout: post
title: ${title}
---

EOF

exec vi "$FILE"
