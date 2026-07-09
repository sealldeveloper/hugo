---
title: "Source"
description: "ORG-C has given us access to one of their file servers -- conveniently served over HTTP without authentication. There is no requirement to brute-force infra here, please avoid doing so.\n\n`http://files.secedu.site/`"
date: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "/images/24-secedu/icon.png"
---



Looking at the root of the website we can see the following:

{{< image src="/images/24-secedu/sourceindex.png" alt="sourceindex.png" >}}

The instructions tell us to view a users files at `/<FIRST-NAME><LAST-NAME>.html`

Let's check out our good pal `Layton` from the past few weeks:

{{< image src="/images/24-secedu/sourcelayton.png" alt="sourcelayton.png" >}}

Inside his directory, we see a `Flag.txt`, `Lunch.txt` and `encryptedfiles.txt`.

Checking out flag we are given the solve:

{{< image src="/images/24-secedu/sourcesolve.png" alt="sourcesolve.png" >}}

Flag: `SECEDU{first_f14g_0n_th3_right_tr4ck}`