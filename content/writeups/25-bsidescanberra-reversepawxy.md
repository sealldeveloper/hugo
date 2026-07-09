---
title: "Reverse Pawxy"
description: "It sure is nice to be able to check the health of my API without exposing any of my secrets!"
date: 2025-10-06
ctf: "B-Sides Canberra 2025: skateboarding dog CTF"
category: "web"
author: "sealldev"
section: "CTFs"
image: "/images/25-bsidescanberra/logo.webp"
---

This challenge was a parser differential between Nginx and ASP.NET. The challenge is downloadable from [here](https://github.com/skateboardingdog/bsides-cbr-2025-challenges/tree/main/web/reverse-pawxy).

> Disclosure: During the competition we used AI to solve this challenge, this writeup is more of a retrospective analysis.

## Application Structure

```bash
$ tree
.
├── api
│   ├── MyApi.csproj
│   └── Program.cs
├── Dockerfile
├── nginx
│   ├── default.conf
│   └── index.html
└── supervisord.conf

3 directories, 6 files
```

The Dockerfile is:
```dockerfile
# Stage 1: Build .NET 8 Web API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY api/*.csproj ./
RUN dotnet restore

COPY api/ ./
RUN dotnet publish -c Release -o /out

# Stage 2: Final container with nginx + dotnet + supervisord
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && \
    apt-get install -y nginx supervisor curl gnupg2 apt-transport-https && \
    rm -rf /var/lib/apt/lists/*

# Install .NET 8 ASP.NET Runtime
RUN curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg && \
    mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg && \
    sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/ubuntu/22.04/prod jammy main" > /etc/apt/sources.list.d/microsoft-prod.list' && \
    apt-get update && \
    apt-get install -y aspnetcore-runtime-8.0 && \
    rm -rf /var/lib/apt/lists/*

# Copy NGINX stuffs
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/sites-enabled/default
COPY nginx/index.html /usr/share/nginx/html

# Copy API stuffs
COPY --from=build /out /app

# Copy supervisord config
COPY supervisord.conf /etc/supervisord.conf

# Ports
EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
```

The comments give you a general gist of the Docker container setup.

### Nginx

The Nginx config is pretty simple:
```conf
server {
    listen 80;

    location / {
        root /usr/share/nginx/html;
        index index.html;
    }

    # check the health of my api!
    location /healthcheck {
        proxy_pass         http://localhost:5000;
    }
}
```


The `proxy_pass` for `/healthcheck` is passed to the backend Kestrel ASP.NET web-server.

The key detail is that only if the endpoint is resolved as `/healthcheck` or any child paths beneath that, e.g. `/healthcheck/test` that it is forwarded to the backend server.

### The mysterious so-called 'backend': Kestrel ASP.NET web-server

I know it's Microsoft don't be scared. The application is simple I promise 🙂‍↕️.

The 'Program.cs' file contains the following:
```cs
var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

var app = builder.Build();

app.MapGet("/healthcheck", () => Results.Ok(new { status = "Healthy" }));

app.MapGet("/flag", (IConfiguration config) =>
{
    var secret = config["FLAG"];
    return Results.Ok(new { flag = secret ?? "not_set" });
});

app.Run();
```

This application has 2 routes: `/healthcheck` and `/flag`. The `/healthcheck` endpoint responds with a JSON object of `{"status":"Healthy"}`. The `/flag` endpoint responds with the flag within a JSON object.

## What's the problem?

The issue is we cannot access `/flag` for the backend directly, the request must be routed through Nginx. Therefore we need a URL parsing differential that does the following:
- Resolves to `/healthcheck/*` on Nginx
- Resolves to `/flag` on the Kestrel ASP.NET web-server

From here only once piece of information was found that was useful, the rest was just trial and error mostly...

## ASP.NET's weird clause with `HttpRequest.Path`

The [docs](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.http.httprequest.path) for the property specify this interesting clause:
> ... The path is fully decoded by the server except for '%2F', which would decode to '/' and change the meaning of the path segments. '%2F' can only be replaced after splitting the path into segments. 

The path on Nginx is going to automatically decode the '%2F' and traverses before checking the endpoint. On the other hand, ASP.NET will not decode '%2F' before doing traversal.

## The Intended Solve

There was a table I used during the competition that was great (but I now can't find...) but it was essentially a table of ways of traversing the path with `proxy_pass` like this.

Format: payload -> what Nginx processes it as -> what is sent to `proxy_pass`

`/test/../test/` -> `/test` -> `/test/../test/`

`/test%2f../test/` -> `/test` -> `/test%2f../test`

The final payload was: `/healthcheck%2fhi/../flag`

Which will be parsed like this:
`/healthcheck%2fhi/../flag` -> `/healthcheck/flag` -> `/flag`

Nginx will decode the path to `/healthcheck/hi/../flag` and traverse it to `/healthcheck/flag`, which is a subdirectory of `/healthcheck` and is passed to the backend. ASP.NET on the other hand will not decode the '%2F', therefore `/healthcheck%2fhi/` is parsed as 1 subdirectory within the path, traversing to `/flag`.

Flag: `skbdg{0h_n0_my_paw_s3cre7s!}`

## The Unintended Solve

This solve was very strange, I'll let you have a squizz then try I'll explain what I _think_ is happening.

```bash
$ curl --path-as-is --request-target '/healthcheck#/../flag' 'http://localhost:1330'
```

I didn't even know `--request-target` was an option tbh...

The reason I _think_ this works is that Nginx parses the '#' as a fragment identifier (like how a URL can specify a header to scroll to) and is parsed as `/healthcheck` with an identifier. While ASP.NET will parse this as a subdirectory, `/healthcheck#/../flag` being traversed to `/flag`.


## Conclusion

I hated this challenge when I started, but the afterwards part was actually very enjoyable. Thank you to the author, chsh.

I think if I do parser differential challenges in the future I'll think a bit more about the quirks of URLs.