---
title: "Inspect HTML"
description: "Can you get the flag? Go to this website and see what you can discover."
date: 2025-08-26
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
# image: "/images/picoctf/websockfish/icon.png"
---

I started the webserver, and I am presented with a simple webpage.

{{< image src="/images/picoctf/inspecthtml/page.png" alt="webpage page" >}}

Inside the page contents, HTML can have hidden comments and content that isn't displayed.

You can view this by right-clicking then selecting 'Inspect', inside a HTML code comment is the flag!

You can also do this on Firefox with CTRL+U for 'View Page Source'

Flag: `picoCTF{1n5p3t0r_0f_h7ml_1fd8425b}`