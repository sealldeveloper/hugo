---
title: "where are the robots"
description: "Can you find the robots? https://jupiter.challenges.picoctf.org/problem/56830/ or http://jupiter.challenges.picoctf.org:56830"
date: 2025-08-26
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
# image: "/images/picoctf/websockfish/icon.png"
---

I started the webserver, and I am presented with mostly-empty website asking 'Where are the robots?'

{{< image src="/images/picoctf/wherearetherobots/main.png" alt="webpage page" >}}

I am fairly certain this is referencing `robots.txt` which is used to store page information about how robots (designated by their User-Agent) can view pages.

The `robots.txt` contains this:
```
User-agent: *
Disallow: /1bb4c.html
```

Let's visit that page, and find the flag!

Flag: `picoCTF{ca1cu1at1ng_Mach1n3s_1bb4c}`