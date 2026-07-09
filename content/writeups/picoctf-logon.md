---
title: "logon"
description: "The factory is hiding things from all of its users. Can you login as Joe and find what they've been looking at? https://jupiter.challenges.picoctf.org/problem/15796/ or http://jupiter.challenges.picoctf.org:15796"
date: 2025-09-09
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
---

Starting the challenge, we are given a login page:

{{< image src="/images/picoctf/logon/main.png" alt="main page" >}}

I try the default username/password combo of admin:admin.

It put me to this logged in page, taunting me:

{{< image src="/images/picoctf/logon/admin.png" alt="admin page" >}}

So, I check the cookies thinking its probably some flag.

{{< image src="/images/picoctf/logon/cookies.png" alt="cookies" >}}

I see the `admin=False` cookie, so let's change that to `True`!

This gets us the flag.

Flag: `picoCTF{th3_c0nsp1r4cy_l1v3s_6edb3f5f}`
