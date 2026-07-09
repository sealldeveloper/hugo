---
title: "dont-use-client-side"
description: "Can you break into this super secure portal? https://jupiter.challenges.picoctf.org/problem/17682/ or http://jupiter.challenges.picoctf.org:17682"
date: 2025-08-26
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
# image: "/images/picoctf/websockfish/icon.png"
---

I start the webserver and I am prompted with a login screen.

{{< image src="/images/picoctf/dontuseclientside/main.png" alt="login page" >}}

No logins work, I decide to check the page source as it mentions client side.

There is some JavaScript:
```js
function verify() {
checkpass = document.getElementById("pass").value;
split = 4;
if (checkpass.substring(0, split) == 'pico') {
    if (checkpass.substring(split*6, split*7) == '706c') {
    if (checkpass.substring(split, split*2) == 'CTF{') {
        if (checkpass.substring(split*4, split*5) == 'ts_p') {
        if (checkpass.substring(split*3, split*4) == 'lien') {
        if (checkpass.substring(split*5, split*6) == 'lz_b') {
            if (checkpass.substring(split*2, split*3) == 'no_c') {
            if (checkpass.substring(split*7, split*8) == '5}') {
                alert("Password Verified")
                }
            }
            }
    
        }
        }
    }
    }
}
else {
    alert("Incorrect password");
}

}
```

It looks like a flag we need to restructure:
It definetly starts with `picoCTF{`, we can restructure based on the substring.
```
pico
CTF{
no_c
lien
ts_p
lz_b
706c
5}
```

Flag: `picoCTF{no_clients_plz_b706c5}`