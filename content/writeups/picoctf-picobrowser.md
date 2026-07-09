---
title: "picobrowser"
description: "This website can be rendered only by picobrowser, go and catch the flag! https://jupiter.challenges.picoctf.org/problem/26704/ or http://jupiter.challenges.picoctf.org:26704"
date: 2025-08-26
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
# image: "/images/picoctf/websockfish/icon.png"
---

I started the webserver, and I am presented with a button and some boring page content.

{{< image src="/images/picoctf/picobrowser/main.png" alt="webpage page" >}}

I press 'Flag' and get an error:

{{< image src="/images/picoctf/picobrowser/error.png" alt="error" >}}

I decide to open the request in Burp Suite and find a Header has a similar contents to what is printed, 'User-Agent'. I modify it to 'picobrowser' and the flag is returned!

{{< image src="/images/picoctf/picobrowser/solve.png" alt="cookie" >}}

Flag: `picoCTF{p1c0_s3cr3t_ag3nt_e9b160d0}`