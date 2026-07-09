---
title: "Sample Chall"
description: "WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!WOW its a sample!"
date: 2025-02-27
ctf: "CTF XYZ"
category: "category"
author: "CyberTeam Member"
# image: "./sample/"
hidden: true
section: "CTFs"
---

## FORMATTING RULES IMPORTANT TO READ PLEASE!

### Frontmatter

The frontmatter is the content above this wrapped in `---`'s, please make sure that the following apply:
- The `author` you use is consistent across all your current and future writeups
- The `ctf` is in the format `<CTF NAME> <YEAR>`, for e.g. `PicoCTF 2025`.
- The `category` should be all lowercase and check the existing categories before making a new one, if a new one is made there may be disputes over its validity or how required it is.
- The `description` should contain the challenge description for the CTF, if it is lost and can't be found utilise a brief synopsis of the challenge instead
- The `section` should be `CTFs` and perhaps `PicoCTF` or `HackTheBox` for machine/challenge writeups.
- The `image` for the CTF should be in the `images` folder for the CTF content and should be the icon for the CTF. For non-CTF challenges (like one-off PicoCTF challenges) should strive to use an image to make it recognisable.

### Writing Style
You can write pretty much however you want, but we have a few main (loose) rules:
- **Accuracy**: Information you portray, and the solution and explanation for your solutions should be accurate information (atleast at the time of writing). You are demonstrating your understanding to the reader and it should be expressed clearly and well. Don't make things up you don't know, check.
- **Quality**: Make it good lol, very simple, if the writeup clearly has no effort or work put into it we won't care. Make it good!
- **Unique**: 

hello there this is my aweosme writeup
```
code block
```

`code`

**bold** (ooh)

*italic* (aah)

__underline__ (waow)

Flag: `FLAG{this_has_nice_formatting!}`

### Media

Use Hugo media shortcodes instead of Markdown media embeds. Preserve existing alt text if it exists; do not invent new alt text or captions during conversions.

```md
{{</* image src="/images/example.png" alt="existing alt text" */>}}
{{</* image src="/images/example.png" alt="existing alt text" width="70%" */>}}
{{</* image src="/images/example.png" alt="existing alt text" caption="existing caption text" */>}}

{{</* audio src="/audio/example.wav" type="audio/wav" */>}}
{{</* video src="/video/example.mp4" type="video/mp4" width="80%" */>}}
```

Images open in a zoom overlay when clicked. `width`, `height`, `maxWidth`, and `maxHeight` can be used to constrain rendered media size.

### Callouts

Use blockquotes for highlighted notes.

```md
> Note: important context goes here.
> Warning: dangerous detail goes here.
> Tip: useful detail goes here.
```

### Code Blocks

Use a language on every code fence so syntax highlighting can work.

````md
```http {wrap=true}
POST /api/example HTTP/1.1
Content-Type: application/json

{"hello":"world"}
```
````

HTTP blocks detect JSON request bodies and format them like JSON code blocks by default. Disable that with `json_format=false`.

````md
```http {json_format=false}
POST /api/example HTTP/1.1
Content-Type: application/json

{"hello":"world"}
```
````

Use `wrap=true` for line wrapping and `eyes` to draw attention to lines.

````md
```bash {wrap=true eyes="2,4-5"}
echo one
echo two
echo three
echo four
echo five
```
````

Use `conf` for configuration snippets.

````md
```conf
listen_addresses = '*'
shared_buffers = 128MB
```
````



