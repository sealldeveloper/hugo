---
title: "Forbidden Paths"
description: "Can you get the flag? We know that the website files live in /usr/share/nginx/html/ and the flag is at /flag.txt but the website is filtering absolute file paths. Can you get past the filter to read the flag?"
date: 2025-09-02
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
---

Starting the challenge, we are given a simple blue web-server with some files and an input box:

{{< image src="/images/picoctf/forbiddenpaths/main.png" alt="main page" width="50%" >}}

Putting `divine-comedy.txt` in the input field, we can read a file!

Let's look at the web requests to try and read `/flag.txt`:
```http
POST /read.php HTTP/1.1
Host: saturn.picoctf.net:63231
Content-Type: application/x-www-form-urlencoded
Content-Length: 23
<cut for brevity>

filename=divine-comedy.txt&read=
```

So, can we change this path to a path traversal? Let's try `/flag.txt` directly.

We get an error `Not Authorized` (as expected by the description, which specifies that we cannot use absolute paths as they are filtered), what about a path traversal attack? Like `../../../../../../../flag.txt`?

Success!

Flag: `picoCTF{7h3_p47h_70_5ucc355_6db46514}`