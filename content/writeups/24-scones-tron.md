---
title: "tron"
description: ""
date: 2024-06-26
ctf: "SCONES 2024"
category: "hardware"
author: "sealldev"
section: "CTFs"
image: "/images/24-scones/icon.png"
---

This challenge took me some hints, but we got their in the end.

When powering the badge with a USB-C it would flash a code.

{{< image src="/images/24-scones/badge.gif" alt="badge code" >}}

If we take a look at one frame, this is how its parsed.

{{< image src="/images/24-scones/badgeframe.png" alt="badge frame" >}}

The bottom right LED is a power LED, so its always parsed as a `0`, the other 7 LEDs change to create ASCII characters in binary. If we read this one it is read as a `01010011` which is an `S`. There is an annotated version below to show reading order (blue arrows) the value of each LED (pink) and the power LED (green).

{{< image src="/images/24-scones/badgeframeannotated.png" alt="badge frame annotated" >}}

I didn't end up writing down the flag, but the challenge was just transcribing all them and decoding from binary.