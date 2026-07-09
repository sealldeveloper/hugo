---
title: "Deleted"
description: "We found this file and was told that it contains a flag within it. Can you find the flag?"
date: 2024-04-08
ctf: "TamuCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "/images/24-tamuctf/icon.png"
---

The file we are given is a `.e01` which I loaded with Autopsy.

Once I loaded the file, I checked the 'deleted files' section.

{{< image src="/images/24-tamuctf/autopsy.png" alt="autopsy.png" >}}

Inside the file `zzooo.png` was the flag.

{{< image src="/images/24-tamuctf/deleted.png" alt="deleted.png" >}}

Flag: `gigem{f0und_d3l3t3d_f1l3}`

**Special Thanks to warlocksmurf, was stuck on a Mac and couldn't grab Autopsy screenshots :<**