---
title: "Chunked Integrity"
description: "This is one of my favorite images! Unfortunately something has gone wrong and I cant see the whole thing, can you help fix it?" 
date: 2025-04-29
ctf: "DawgCTF 2025"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "/images/25-dawgctf/icon.png"
---

We are given a `funnyCat.png` that has content missing from the bottom, appearing to have been 'cropped' or corrupted.

{{< image src="/images/25-dawgctf/chunkedintegrity/funnycat.png" alt="funnycat.png" >}}

We can use a `checkpng` utility to check if there are any issues with the image:
```
$ pngcheck ./funnyCat.png
./funnyCat.png  illegal (unless recently approved) unknown, public chunk EDAT
```

Generally the data blocks are `IDAT` not `EDAT`, so let's fix that in a hex editor.

{{< image src="/images/25-dawgctf/chunkedintegrity/hexeditor.png" alt="hexeditor.png" >}}

Once modified we can reopen the file and get the flag:

{{< image src="/images/25-dawgctf/chunkedintegrity/flag.png" alt="flag.png" >}}

Flag: `DawgCTF{C0rrup7_Chunkz}`