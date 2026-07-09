---
title: "Power Cookie"
description: "Can you get the flag? Go to this website and see what you can discover."
date: 2025-08-26
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
# image: "/images/picoctf/websockfish/icon.png"
---

I started the webserver, and I am presented with a button and some boring page content.

{{< image src="/images/picoctf/powercookie/mainpage.png" alt="webpage page" >}}

I press the 'continue as guest' button, and I get an error:

{{< image src="/images/picoctf/powercookie/error.png" alt="error" >}}

Considering the challenge has 'Cookie' in the name, I decide to check the cookies and find this (using EditThisCookie2):

{{< image src="/images/picoctf/powercookie/fixcookie.png" alt="cookie" >}}

In the screenshot above I changed the value to '1' instead of '0' to hopefully make it true, I then reload the page and get the flag!

Flag: `picoCTF{gr4d3_A_c00k13_65fd1e1a}`