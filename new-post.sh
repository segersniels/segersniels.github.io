#!/usr/bin/env bash
# Variables
TIME=$(date +'%Y-%m-%d')

# User input
echo "Title?"
read -e title

filename=$(echo $title |tr '[:upper:]' '[:lower:]' |tr '\ ' '-')
FILE="_posts/$TIME-$filename.md"

cat > "$FILE" <<EOF
---
layout: post
title: ${title}
---

EOF

echo "New post created at '$FILE'"

exec vi "$FILE"
