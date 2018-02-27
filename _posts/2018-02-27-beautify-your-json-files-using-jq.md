---
layout: post
title: Beautify your JSON files using JQ
---

When working together with people on a project you are doomed to have some sort of JSON formatting issues at some point. As some people use 2 spaces at tab indentation and others use 4 space tabs things (yes I'm one of those people that uses 2 space tabs).

Quick easy alias to beautify your JSON files, making use of JQ, to fix indentation issues.

{% highlight bash %}
alias jsonb=beautify_json_file

function beautify_json_file () {
  cat $1 |jq '.' > .TEMP
  if [ -s ".TEMP" ]; then
    mv .TEMP $1
  else
    echo "ERR: File $1 contains invalid JSON"
    rm .TEMP
  fi
}
{% endhighlight %}
