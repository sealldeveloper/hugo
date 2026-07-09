---
title: "Roboto Sans"
description: "The flag is somewhere on this web application not necessarily on the website. Find it."
date: 2025-09-09
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
---

Starting the challenge, we are given a simple web page for a Yoga site:

{{< image src="/images/picoctf/robotosans/main.png" alt="main page" >}}

Considering the challenge name has 'robot' in it, let's check out the `robots.txt` file. This file is used to store information for what User-Agent (generally to specify scrapers and AI) pages they shouldn't / can't scrape.

It contains this:
```
User-agent *
Disallow: /cgi-bin/
Think you have seen your flag or want to keep looking.

ZmxhZzEudHh0;anMvbXlmaW
anMvbXlmaWxlLnR4dA==
svssshjweuiwl;oiho.bsvdaslejg
Disallow: /wp-admin/
```

There are Base64 encoded strings! 
```
ZmxhZzEudHh0 -> flag1.txt
anMvbXlmaW -> js/myf
anMvbXlmaWxlLnR4dA== -> js/myfile.txt
```

`flag1.txt` is a 404, the last one seems like the right track!


Flag: `picoCTF{Who_D03sN7_L1k5_90B0T5_22ce1f22}`
