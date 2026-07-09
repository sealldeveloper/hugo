document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initSplashTooltip();
  initSearch();
  initFlagBlocks();
  loadWakatime();
  initFalling();
  initFooterGrid();
  initFooterOverscroll();
  initMuseum();
  initArticleEnhancements();
  initCodeblockEnhancements();
});

function initMenu() {
  const open = document.getElementById("open-nav-button");
  const close = document.getElementById("close-nav-button");
  const modal = document.getElementById("menu-modal");
  if (!open || !close || !modal) return;

  open.addEventListener("click", () => {
    modal.hidden = false;
  });
  close.addEventListener("click", () => {
    modal.hidden = true;
  });
  modal.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      modal.hidden = true;
    });
  });
}

function initSplashTooltip() {
  const tip = document.getElementById("nav-tooltip");
  if (!tip) return;

  document.querySelectorAll(".splash-nav a").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      tip.textContent = link.title || link.innerText;
      tip.classList.add("visible");
    });
    link.addEventListener("mouseleave", () => tip.classList.remove("visible"));
  });
}

function initSearch() {
  const search = document.getElementById("search-input");
  const grid = document.getElementById("listing-grid");
  if (!search || !grid) return;

  const active = { section: "", category: "", ctf: "" };
  const cards = [...grid.querySelectorAll(".content-card")];
  const apply = () => {
    const q = search.value.trim().toLowerCase();
    cards.forEach((card) => {
      const okText = !q || card.dataset.search.includes(q);
      const okSection = !active.section || card.dataset.section === active.section;
      const okCategory = !active.category || card.dataset.category === active.category;
      const okCtf = !active.ctf || card.dataset.ctf === active.ctf;
      card.style.display = okText && okSection && okCategory && okCtf ? "" : "none";
    });
  };

  search.addEventListener("input", apply);
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.filterType || "section";
      document.querySelectorAll(`.filter-button[data-filter-type="${type}"]`).forEach((x) => x.classList.remove("active"));
      button.classList.add("active");
      active[type] = button.dataset.filter || "";
      button.closest("details")?.removeAttribute("open");
      apply();
    });
  });

  document.querySelectorAll(".filter-dropdown").forEach((dropdown) => {
    dropdown.addEventListener("toggle", () => {
      if (!dropdown.open) return;
      document.querySelectorAll(".filter-dropdown").forEach((other) => {
        if (other !== dropdown) other.removeAttribute("open");
      });
    });
  });
}

function initFlagBlocks() {
  document.querySelectorAll(".prose p").forEach((paragraph) => {
    const text = paragraph.textContent || "";
    const hasFlagMarker = /\bflag\s*:/i.test(text);
    const hasFlagToken = /\b(?:picoCTF|HTB|flag)\{[^}]+\}/i.test(text);
    if (!hasFlagMarker && !hasFlagToken) return;

    paragraph.classList.add("flag-paragraph");
    paragraph.querySelectorAll("code").forEach((code) => {
      code.classList.add("flag-code");
    });
  });
}

async function loadWakatime() {
  const el = document.getElementById("wakatime-languages");
  if (!el) return;

  try {
    const response = await fetch("https://wakatime.com/share/@sealldeveloper/d561db77-8f62-4438-b5c5-d23242e67840.json");
    const json = await response.json();
    el.innerHTML = json.data
      .slice(0, 7)
      .map((lang) => `<div class="language-row"><span class="language-dot" style="background:${lang.color}"></span><span>${lang.name}</span><strong>${parseInt(lang.decimal)} hrs</strong></div>`)
      .join("");
  } catch {
    el.innerHTML = `<div class="language-row muted">Failed to load stats</div>`;
  }
}

function initFalling() {
  const canvas = document.getElementById("falling-canvas");
  if (!canvas) return;

  const images = (canvas.dataset.images || "").split(",").filter(Boolean);
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  resize();
  addEventListener("resize", resize);

  const loaded = images.slice(0, 80).map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  });

  const items = Array.from({ length: Math.min(22, loaded.length) }, () => ({
    img: loaded[Math.floor(Math.random() * loaded.length)],
    x: Math.random() * width,
    y: Math.random() * height,
    size: 55 + Math.random() * 105,
    vy: 0.9 + Math.random() * 1.55,
    rotation: Math.random() * 6,
    vr: (Math.random() - 0.5) * 0.018,
    opacity: 0.45 + Math.random() * 0.35,
  }));

  const drawSeal = (item, alphaScale = 1, options = {}) => {
    ctx.save();
    ctx.globalAlpha = item.opacity * alphaScale;
    ctx.translate(item.x + (options.xOffset || 0), item.y + (options.yOffset || 0));
    ctx.rotate(item.rotation);
    const ratio = item.img.naturalWidth && item.img.naturalHeight
      ? item.img.naturalWidth / item.img.naturalHeight
      : 1;
    const scaledSize = item.size * (options.scale || 1);
    const drawWidth = ratio >= 1 ? scaledSize : scaledSize * ratio;
    const drawHeight = ratio >= 1 ? scaledSize / ratio : scaledSize;
    ctx.drawImage(item.img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  };

  let lastFrame = 0;
  const frame = (now = 0) => {
    const delta = lastFrame ? Math.min(2, (now - lastFrame) / (1000 / 60)) : 1;
    lastFrame = now;
    ctx.clearRect(0, 0, width, height);
    for (const item of items) {
      item.y += item.vy * delta;
      item.x += Math.sin(item.y / 70) * 0.22 * delta;
      item.rotation += item.vr * delta;
      if (item.y > height + 160) {
        item.y = -160;
        item.x = Math.random() * width;
        item.img = loaded[Math.floor(Math.random() * loaded.length)];
      }

      const sway = Math.sin(item.y / 70);
      [
        { yOffset: -item.size * 0.24, xOffset: -sway * 1.6, scale: 0.93, alpha: 0.13 },
        { yOffset: -item.size * 0.43, xOffset: -sway * 3.2, scale: 0.85, alpha: 0.065 },
        { yOffset: -item.size * 0.58, xOffset: -sway * 4.8, scale: 0.78, alpha: 0.03 },
      ].forEach((trail) => drawSeal(item, trail.alpha, trail));
      drawSeal(item);
    }
    requestAnimationFrame(frame);
  };

  if (items.length) frame();
}

function initFooterGrid() {
  const canvas = document.getElementById("footer-grid-canvas");
  if (!canvas) return;

  const images = (canvas.dataset.images || "").split(",").filter(Boolean);
  if (!images.length) return;

  const container = canvas.parentElement;
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  const loaded = images.map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  });
  let width = 0;
  let height = 0;
  let dpr = 1;
  let items = [];
  let lastFrame = 0;

  const makeItems = () => {
    const cellSize = window.innerWidth < 768 ? 60 : 80;
    const density = width < 480 ? 1.5 : width < 768 ? 2 : width < 1024 ? 3 : 5;
    const total = Math.max(8, Math.ceil(((width + height) / cellSize) * density));
    items = Array.from({ length: total }, (_, i) => {
      const progress = i / total;
      const diagonalSpread = Math.max(width, height) * 0.8;
      return {
        img: loaded[Math.floor(Math.random() * loaded.length)],
        x: -cellSize - Math.random() * cellSize + progress * diagonalSpread * 0.7,
        y: -cellSize - Math.random() * cellSize + progress * diagonalSpread,
        cellSize,
        opacity: 0.6 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        slideSpeed: 0.8 + Math.random() * 0.4,
      };
    });
  };

  const resize = () => {
    dpr = window.devicePixelRatio || 1;
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = Math.max(1, width * dpr);
    canvas.height = Math.max(1, height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeItems();
  };

  const drawImage = (item) => {
    const maxSize = item.cellSize * 0.8;
    const ratio = item.img.naturalWidth && item.img.naturalHeight
      ? item.img.naturalWidth / item.img.naturalHeight
      : 1;
    const drawWidth = ratio >= 1 ? maxSize : maxSize * ratio;
    const drawHeight = ratio >= 1 ? maxSize / ratio : maxSize;

    ctx.save();
    ctx.translate(item.x + item.cellSize / 2, item.y + item.cellSize / 2);
    ctx.rotate(item.rotation);
    ctx.globalAlpha = item.opacity;
    if (item.img.complete && item.img.naturalWidth) {
      ctx.drawImage(item.img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    }
    ctx.restore();
  };

  const frame = (now = 0) => {
    const delta = lastFrame ? Math.min(2, (now - lastFrame) / (1000 / 60)) : 1;
    lastFrame = now;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    for (const item of items) {
      item.x += item.slideSpeed * 0.7 * delta;
      item.y += item.slideSpeed * delta;
      item.rotation += item.rotationSpeed * delta;
      if (item.x > width + item.cellSize || item.y > height + item.cellSize) {
        item.x = -item.cellSize - Math.random() * item.cellSize;
        item.y = -item.cellSize - Math.random() * item.cellSize;
        item.img = loaded[Math.floor(Math.random() * loaded.length)];
      }
      if (
        item.x >= -item.cellSize * 2 &&
        item.y >= -item.cellSize * 2 &&
        item.x <= width + item.cellSize * 2 &&
        item.y <= height + item.cellSize * 2
      ) {
        drawImage(item);
      }
    }

    requestAnimationFrame(frame);
  };

  resize();
  addEventListener("resize", resize);
  requestAnimationFrame(frame);
}

function initFooterOverscroll() {
  const footer = document.querySelector(".site-footer");
  if (!footer) return;

  let timer;
  let touchStartY = 0;
  const activeClass = "footer-overscroll-active";
  const column = document.createElement("div");
  column.className = "footer-overscroll-column";
  column.setAttribute("aria-hidden", "true");

  const canvas = document.getElementById("footer-grid-canvas");
  const images = (canvas?.dataset.images || "").split(",").filter(Boolean).slice(0, 18);
  column.innerHTML = images.map((src) => `<img src="${src}" alt="">`).join("");
  document.body.appendChild(column);

  const isAtBottom = () =>
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

  const show = () => {
    document.documentElement.classList.add(activeClass);
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      document.documentElement.classList.remove(activeClass);
    }, 500);
  };

  window.addEventListener("wheel", (event) => {
    if (event.deltaY > 0 && isAtBottom()) show();
  }, { passive: true });

  window.addEventListener("touchstart", (event) => {
    touchStartY = event.touches[0]?.clientY ?? 0;
  }, { passive: true });

  window.addEventListener("touchmove", (event) => {
    const touchY = event.touches[0]?.clientY ?? touchStartY;
    if (touchY < touchStartY && isAtBottom()) show();
  }, { passive: true });
}

function initArticleEnhancements() {
  initArticleCallouts();
  initArticleToc();
  initImageZoom();
}

function initCodeblockEnhancements() {
  const replaceLineParts = (row, parts, options = {}) => {
    const lineClass = options.lineClass || "http-line";
    const rawClass = options.rawClass || "http-raw";
    const spaceClass = options.spaceClass || "http-space";
    const fragment = document.createDocumentFragment();
    parts.forEach((part) => {
      if (typeof part === "string") {
        const span = document.createElement("span");
        span.className = /\S/.test(part) ? rawClass : spaceClass;
        span.textContent = part;
        fragment.appendChild(span);
        return;
      }

      const span = document.createElement("span");
      span.className = part.className;
      span.textContent = part.text;
      fragment.appendChild(span);
    });

    row.classList.add(lineClass);
    row.textContent = "";
    row.appendChild(fragment);
  };

  const encodedValueParts = (value) => {
    if (!value) return [];
    return [{ className: "http-body-value", text: value }];
  };

  const formBodyParts = (line) => {
    const parts = [];
    let cursor = 0;
    while (cursor < line.length) {
      if (line[cursor] === "&") {
        parts.push({ className: "http-body-separator", text: "&" });
        cursor += 1;
        continue;
      }

      const amp = line.indexOf("&", cursor);
      const end = amp === -1 ? line.length : amp;
      const eq = line.indexOf("=", cursor);
      if (eq !== -1 && eq < end) {
        parts.push({ className: "http-body-key", text: line.slice(cursor, eq) });
        parts.push({ className: "http-body-equals", text: "=" });
        parts.push(...encodedValueParts(line.slice(eq + 1, end)));
      } else {
        parts.push(...encodedValueParts(line.slice(cursor, end)));
      }
      cursor = end;
    }
    return parts;
  };

  const jsonBodyParts = (line) => {
    const parts = [];
    const tokenPattern = /"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b|[{}\[\]:,]|\s+|./g;
    for (const match of line.matchAll(tokenPattern)) {
      const token = match[0];
      const rest = line.slice((match.index || 0) + token.length);
      if (/^\s+$/.test(token)) {
        parts.push(token);
        continue;
      }
      if (/^"(?:\\.|[^"\\])*"$/.test(token) && rest.trimStart().startsWith(":")) {
        parts.push({ className: "http-json-key", text: token });
      } else if (/^"(?:\\.|[^"\\])*"$/.test(token)) {
        parts.push({ className: "http-json-string", text: token });
      } else if (/^-?\d/.test(token)) {
        parts.push({ className: "http-json-number", text: token });
      } else if (/^(true|false|null)$/.test(token)) {
        parts.push({ className: "http-json-literal", text: token });
      } else if (/^[{}\[\]:,]$/.test(token)) {
        parts.push({ className: "http-json-punctuation", text: token });
      } else {
        parts.push({ className: "http-raw", text: token });
      }
    }
    return parts;
  };

  const formatJsonBodyRows = (rows) => {
    if (!rows.length) return;

    const raw = rows.map((item) => item.line).join("\n").trim();
    if (!raw) return;

    let formatted;
    try {
      formatted = JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      rows.forEach(({ row, line, newline }) => replaceLineParts(row, jsonBodyParts(line).concat(newline || "")));
      return;
    }

    const parent = rows[0].row.parentNode;
    const anchor = rows[rows.length - 1].row.nextSibling;
    const lines = formatted.split("\n");
    rows.slice(1).forEach(({ row }) => row.remove());
    lines.forEach((line, index) => {
      const row = index === 0 ? rows[0].row : document.createElement("span");
      if (index > 0) {
        parent.insertBefore(row, anchor);
      }
      replaceLineParts(row, jsonBodyParts(line).concat(index < lines.length - 1 ? "\n" : ""));
    });
  };

  const enhanceHttpCodeblocks = () => {
    document.querySelectorAll(".codeblock code.language-http").forEach((code) => {
      const block = code.closest(".codeblock");
      const jsonFormatDisabled = /^(false|0|no|off)$/i.test(block?.dataset.jsonFormat || "");
      block?.classList.add("codeblock-http");
      let inBody = false;
      let isFormBody = false;
      let isJsonBody = false;
      const jsonRows = [];
      [...code.children].forEach((row) => {
        if (!(row instanceof HTMLElement) || row.tagName !== "SPAN") return;

        const text = row.textContent || "";
        const newline = text.match(/(\r?\n)$/)?.[1] || "";
        const line = newline ? text.slice(0, -newline.length) : text;
        const withNewline = (parts) => newline ? parts.concat(newline) : parts;
        if (!line.trim()) {
          inBody = true;
          return;
        }

        if (inBody && isFormBody) {
          replaceLineParts(row, withNewline(formBodyParts(line)));
          return;
        }

        if (inBody && isJsonBody) {
          if (jsonFormatDisabled) {
            replaceLineParts(row, withNewline(jsonBodyParts(line)));
          } else {
            jsonRows.push({ row, line, newline });
          }
          return;
        }

        const request = line.match(/^([A-Z]+)(\s+)(\S+)(\s+)(HTTP\/[\d.]+)$/);
        if (request) {
          replaceLineParts(row, withNewline([
            { className: "http-method", text: request[1] },
            request[2],
            { className: "http-target", text: request[3] },
            request[4],
            { className: "http-version", text: request[5] },
          ]));
          return;
        }

        const response = line.match(/^(HTTP\/[\d.]+)(\s+)(\d{3})(\s+.*)?$/);
        if (response) {
          replaceLineParts(row, withNewline([
            { className: "http-version", text: response[1] },
            response[2],
            { className: "http-status", text: response[3] },
            { className: "http-status-message", text: response[4] || "" },
          ]));
          return;
        }

        const header = line.match(/^([A-Za-z][A-Za-z0-9-]*)(:\s*)(.*)$/);
        if (header) {
          if (header[1].toLowerCase() === "content-type" && /application\/x-www-form-urlencoded/i.test(header[3])) {
            isFormBody = true;
          }
          if (header[1].toLowerCase() === "content-type" && /application\/json/i.test(header[3])) {
            isJsonBody = true;
          }
          replaceLineParts(row, withNewline([
            { className: "http-header-name", text: header[1] },
            { className: "http-header-colon", text: header[2] },
            { className: "http-header-value", text: header[3] },
          ]));
        }
      });
      formatJsonBodyRows(jsonRows);
    });
  };

  const splitConfComment = (line) => {
    let quote = "";
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === "\\" && quote) {
        index += 1;
        continue;
      }
      if ((char === "\"" || char === "'") && (!quote || quote === char)) {
        quote = quote ? "" : char;
        continue;
      }
      if (char === "#" && !quote) {
        return [line.slice(0, index), line.slice(index)];
      }
    }
    return [line, ""];
  };

  const confValueParts = (value) => {
    const parts = [];
    value.split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?(?:[A-Za-z]+)?\b|\b(?:true|false|on|off|yes|no)\b)/gi).forEach((segment) => {
      if (!segment) return;
      if (/^["']/.test(segment)) {
        parts.push({ className: "conf-string", text: segment });
      } else if (/^\d/.test(segment)) {
        parts.push({ className: "conf-number", text: segment });
      } else if (/^(true|false|on|off|yes|no)$/i.test(segment)) {
        parts.push({ className: "conf-literal", text: segment });
      } else {
        parts.push({ className: "conf-value", text: segment });
      }
    });
    return parts;
  };

  const enhanceConfCodeblocks = () => {
    document.querySelectorAll(".codeblock code.language-conf, .codeblock code.language-config, .codeblock code.language-properties").forEach((code) => {
      code.closest(".codeblock")?.classList.add("codeblock-conf");
      if (!code.querySelector(":scope > span")) {
        const source = code.textContent || "";
        const pieces = source.split(/(\r?\n)/);
        code.textContent = "";
        for (let index = 0; index < pieces.length; index += 2) {
          const line = pieces[index] || "";
          const newline = pieces[index + 1] || "";
          if (!line && !newline && index >= pieces.length - 1) continue;
          const row = document.createElement("span");
          row.textContent = line + newline;
          code.appendChild(row);
        }
      }

      [...code.children].forEach((row) => {
        if (!(row instanceof HTMLElement) || row.tagName !== "SPAN") return;

        const text = row.textContent || "";
        const newline = text.match(/(\r?\n)$/)?.[1] || "";
        const line = newline ? text.slice(0, -newline.length) : text;
        const [body, comment] = splitConfComment(line);
        const assignment = body.match(/^(\s*)([A-Za-z_][\w.-]*)(\s*=\s*)(.*?)(\s*)$/);
        const parts = [];

        if (assignment) {
          parts.push(assignment[1]);
          parts.push({ className: "conf-key", text: assignment[2] });
          parts.push({ className: "conf-equals", text: assignment[3] });
          parts.push(...confValueParts(assignment[4]));
          parts.push(assignment[5]);
        } else {
          parts.push({ className: "conf-value", text: body });
        }

        if (comment) parts.push({ className: "conf-comment", text: comment });
        if (newline) parts.push(newline);
        replaceLineParts(row, parts, {
          lineClass: "conf-line",
          rawClass: "conf-raw",
          spaceClass: "conf-space",
        });
      });
    });
  };

  const parseLineSpec = (spec) => {
    const lines = new Set();
    String(spec || "")
      .match(/\d+\s*(?:-\s*\d+)?/g)
      ?.forEach((part) => {
        const [rawStart, rawEnd] = part.split("-");
        const start = Number.parseInt(rawStart, 10);
        const end = Number.parseInt(rawEnd || rawStart, 10);
        if (!Number.isFinite(start) || !Number.isFinite(end)) return;
        const min = Math.min(start, end);
        const max = Math.max(start, end);
        for (let line = min; line <= max; line += 1) lines.add(line);
      });
    return lines;
  };

  enhanceHttpCodeblocks();
  enhanceConfCodeblocks();

  document.querySelectorAll(".codeblock[data-eye-lines]").forEach((block) => {
    const eyeLines = parseLineSpec(block.dataset.eyeLines);
    if (!eyeLines.size) return;

    const rows = [...block.querySelectorAll(".highlight code > span")];
    rows.forEach((row, index) => {
      const lineNumber = index + 1;
      if (!eyeLines.has(lineNumber) || row.querySelector(".code-eye")) return;

      row.classList.add("code-line-eye");
      const marker = document.createElement("span");
      marker.className = "code-eye";
      marker.setAttribute("aria-hidden", "true");
      marker.textContent = "👀";
      row.insertBefore(marker, row.firstChild);
    });
  });
}

function initArticleCallouts() {
  const content = document.getElementById("article-content");
  if (!content) return;

  content.querySelectorAll("blockquote").forEach((quote) => {
    quote.classList.add("article-blockquote");

    const text = (quote.textContent || "").trim();
    const match = text.match(/^(important\s+note|post-ctf\s+note|note|warning|tip|info|caution)\s*:/i);
    if (!match) return;

    quote.classList.add("article-callout", `article-callout-${match[1].toLowerCase().replace(/\s+/g, "-")}`);

    const firstParagraph = quote.querySelector("p");
    if (!firstParagraph || firstParagraph.querySelector(".callout-label")) return;

    const walker = document.createTreeWalker(firstParagraph, NodeFilter.SHOW_TEXT);
    const firstText = walker.nextNode();
    if (!firstText) return;

    const labelMatch = firstText.nodeValue.match(/^(\s*)(important\s+note|post-ctf\s+note|note|warning|tip|info|caution)(\s*:)/i);
    if (!labelMatch) return;

    const label = document.createElement("strong");
    label.className = "callout-label";
    label.textContent = `${labelMatch[2]}:`;
    firstText.nodeValue = firstText.nodeValue.slice(labelMatch[0].length);
    firstParagraph.insertBefore(label, firstText);
    if (labelMatch[1]) firstParagraph.insertBefore(document.createTextNode(labelMatch[1]), label);
  });
}

function initArticleToc() {
  const content = document.getElementById("article-content");
  const tocList = document.getElementById("toc-list");
  const tocNav = document.getElementById("table-of-contents");
  if (!content || !tocList || !tocNav) return;

  const headings = [...content.querySelectorAll("h1, h2, h3, h4, h5, h6")];
  if (!headings.length) {
    tocNav.hidden = true;
    return;
  }

  const slugCounts = new Map();
  const headingInfo = headings.map((heading, index) => {
    const text = heading.textContent.trim();
    const baseSlug = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") || `heading-${index}`;
    const count = slugCounts.get(baseSlug) || 0;
    slugCounts.set(baseSlug, count + 1);
    const id = heading.id || (count ? `${baseSlug}-${count}` : baseSlug);
    heading.id = id;
    heading.style.scrollMarginTop = "6rem";
    return {
      element: heading,
      id,
      text,
      level: Number(heading.tagName.slice(1)),
      index,
    };
  });

  const minLevel = Math.min(...headingInfo.map((heading) => heading.level));
  let currentActiveId = null;

  const build = (activeId = null) => {
    tocList.innerHTML = "";
    const activeHeading = activeId
      ? headingInfo.find((heading) => heading.id === activeId)
      : null;
    const ancestorIndices = [];

    if (activeHeading) {
      let currentLevel = activeHeading.level;
      for (let i = activeHeading.index - 1; i >= 0; i -= 1) {
        if (headingInfo[i].level < currentLevel) {
          ancestorIndices.unshift(i);
          currentLevel = headingInfo[i].level;
        }
      }
    }

    headingInfo.forEach((heading, structIndex) => {
      let shouldShow = heading.level === minLevel;
      if (!shouldShow && activeHeading) {
        if (ancestorIndices.includes(structIndex) || heading.id === activeId) {
          shouldShow = true;
        } else {
          const parents = ancestorIndices.concat([activeHeading.index]);
          shouldShow = parents.some((parentIndex) => {
            const parent = headingInfo[parentIndex];
            return (
              parent.level === heading.level - 1 &&
              structIndex > parentIndex &&
              !headingInfo
                .slice(parentIndex + 1, structIndex)
                .some((candidate) => candidate.level <= parent.level)
            );
          });
        }
      }

      if (!shouldShow) return;

      const item = document.createElement("li");
      item.style.marginLeft = `${Math.max(0, heading.level - minLevel) * 0.75}rem`;
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.text;
      link.dataset.tocLink = heading.id;
      link.className = heading.id === activeId ? "active" : "";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        heading.element.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${heading.id}`);
      });
      item.appendChild(link);
      tocList.appendChild(item);
    });
  };

  const position = () => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const footerTop = footer.getBoundingClientRect().top;
    if (footerTop < window.innerHeight) {
      tocNav.style.maxHeight = `${Math.max(300, footerTop - 100)}px`;
    } else {
      tocNav.style.maxHeight = "60vh";
    }
  };

  build();
  position();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.id === currentActiveId) return;
      currentActiveId = entry.target.id;
      build(currentActiveId);
    });
  }, {
    rootMargin: "-100px 0px -50% 0px",
    threshold: 0,
  });

  headingInfo.forEach((heading) => observer.observe(heading.element));
  window.addEventListener("scroll", position, { passive: true });
  window.addEventListener("resize", position);
}

function initImageZoom() {
  const content = document.getElementById("article-content");
  const modal = document.getElementById("image-zoom-modal");
  const image = document.getElementById("zoomed-image");
  const close = document.getElementById("close-zoom-modal");
  if (!content || !modal || !image || !close) return;

  let isZoomed = false;
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let initialX = 0;
  let initialY = 0;

  const updateTransform = () => {
    image.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
  };

  const reset = () => {
    isZoomed = false;
    scale = 1;
    translateX = 0;
    translateY = 0;
    image.style.cursor = "zoom-in";
    updateTransform();
  };

  const open = (src, alt) => {
    image.src = src;
    image.alt = alt || "";
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    reset();
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    image.removeAttribute("src");
    image.alt = "";
    reset();
  };

  content.querySelectorAll("img").forEach((img) => {
    img.classList.add("article-zoomable-image");
    img.addEventListener("click", (event) => {
      event.preventDefault();
      open(img.currentSrc || img.src, img.alt);
    });
  });

  image.addEventListener("click", (event) => {
    if (isPanning) return;
    const rect = image.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    if (!isZoomed) {
      scale = 2;
      translateX = (rect.width / 2 - clickX) * scale;
      translateY = (rect.height / 2 - clickY) * scale;
      isZoomed = true;
      image.style.cursor = "zoom-out";
    } else {
      reset();
    }
    updateTransform();
  });

  image.addEventListener("mousedown", (event) => {
    if (!isZoomed || event.button !== 0) return;
    isPanning = true;
    startX = event.clientX;
    startY = event.clientY;
    initialX = translateX;
    initialY = translateY;
    image.style.cursor = "grabbing";
    event.preventDefault();
  });

  document.addEventListener("mousemove", (event) => {
    if (!isPanning) return;
    translateX = initialX + event.clientX - startX;
    translateY = initialY + event.clientY - startY;
    updateTransform();
  });

  document.addEventListener("mouseup", () => {
    if (!isPanning) return;
    isPanning = false;
    image.style.cursor = isZoomed ? "zoom-out" : "zoom-in";
  });

  close.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.classList.contains("image-zoom-stage")) {
      closeModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

function initMuseum() {
  const grid = document.getElementById("seal-carousel");
  if (!grid) return;

  let seals = [];
  try {
    seals = JSON.parse(grid.dataset.seals || "[]");
  } catch {
    return;
  }
  if (!seals.length) return;

  let index = 0;
  let timer = null;
  let fadeTimer = null;
  let resumeTimer = null;
  const slotCount = window.matchMedia("(max-width: 640px)").matches ? 1 : 3;

  const visibleSeals = () => {
    const output = [];
    for (let offset = 0; offset < slotCount; offset += 1) {
      output.push(seals[(index + offset) % seals.length]);
    }
    return output;
  };

  const render = () => {
    grid.innerHTML = visibleSeals()
      .map(
        (seal) => `<article class="seal-plinth"><div class="seal-stack"><div class="seal-img-container" style="transform: translateY(${typeof seal.sealMarginTop === "number" ? seal.sealMarginTop : 0}px);"><img class="seal-img" src="${seal.image}" alt="${seal.name}"></div><div class="plinth-img-container"><img class="plinth-img" src="/assets/plinth.png" alt=""></div></div><div class="plinth-engraving"><strong>${String(seal.name).toUpperCase()}</strong><span>by ${seal.author}</span>${seal.flavourtext ? `<em>"${seal.flavourtext}"</em>` : ""}</div></article>`,
      )
      .join("");
  };

  const step = (amount, animate = true) => {
    index = (index + amount + seals.length) % seals.length;
    window.clearTimeout(fadeTimer);
    if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      grid.classList.remove("is-fading");
      render();
      return;
    }
    grid.classList.add("is-fading");
    fadeTimer = window.setTimeout(() => {
      render();
      requestAnimationFrame(() => grid.classList.remove("is-fading"));
    }, 180);
  };

  const start = () => {
    if (timer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = window.setInterval(() => step(slotCount), 3000);
  };

  const stop = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  };

  const pauseForManualInput = () => {
    stop();
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(start, 3000);
  };

  document.getElementById("seal-carousel-next")?.addEventListener("click", () => {
    step(slotCount);
    pauseForManualInput();
  });
  document.getElementById("seal-carousel-prev")?.addEventListener("click", () => {
    step(-slotCount);
    pauseForManualInput();
  });
  grid.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    step(event.key === "ArrowRight" ? slotCount : -slotCount);
    pauseForManualInput();
  });
  grid.addEventListener("mouseenter", stop);
  grid.addEventListener("mouseleave", start);
  start();
}
