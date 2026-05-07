const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const siteState = {
  content: window.SITE_CONTENT ? cloneData(window.SITE_CONTENT) : null,
  activeObserver: null,
  revealObserver: null,
  editor: null,
  dirty: false,
};

const iconSvg = {
  email:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Zm2.1-.35 5.52 4.2c.22.17.54.17.76 0l5.52-4.2a1.22 1.22 0 0 0-.65-.18H6.75c-.23 0-.45.06-.65.18Zm11.68 2.02-4.06 3.1a2.8 2.8 0 0 1-3.44 0l-4.06-3.1v8.83c0 .3.24.53.53.53h10.5c.3 0 .53-.24.53-.53V8.42Z" /></svg>',
  resume:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7.1L19 7.9V18a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Zm6.3 1.9V8.7H17L13.3 4.9ZM7 5.1c-.5 0-.9.4-.9.9v12c0 .5.4.9.9.9h9c.5 0 .9-.4.9-.9v-7.2h-4.4a1.3 1.3 0 0 1-1.3-1.3V5.1H7Zm4.5 6.05a2.05 2.05 0 1 1 0 4.1 2.05 2.05 0 0 1 0-4.1Zm0 1.45a.6.6 0 1 0 0 1.2.6.6 0 0 0 0-1.2ZM8.2 17.35c.47-1.17 1.66-1.85 3.3-1.85s2.83.68 3.3 1.85a.55.55 0 0 1-.52.75H8.72a.55.55 0 0 1-.52-.75Z" /></svg>',
  github:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.25c-5.45 0-9.87 4.42-9.87 9.87 0 4.36 2.83 8.06 6.76 9.36.5.09.68-.21.68-.48v-1.7c-2.75.6-3.33-1.17-3.33-1.17-.45-1.14-1.1-1.44-1.1-1.44-.9-.62.07-.6.07-.6 1 .07 1.52 1.03 1.52 1.03.88 1.5 2.31 1.07 2.88.82.09-.64.35-1.07.63-1.32-2.2-.25-4.5-1.1-4.5-4.89 0-1.08.39-1.96 1.02-2.65-.1-.25-.44-1.26.1-2.62 0 0 .83-.27 2.72 1.01A9.37 9.37 0 0 1 12 7.15c.84 0 1.68.11 2.47.33 1.88-1.28 2.71-1.01 2.71-1.01.54 1.36.2 2.37.1 2.62.64.69 1.02 1.57 1.02 2.65 0 3.8-2.31 4.64-4.51 4.89.36.31.68.92.68 1.86V21c0 .27.18.58.69.48a9.88 9.88 0 0 0 6.75-9.36c0-5.45-4.42-9.87-9.87-9.87Z" /></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.52 8.98H3.75V20h2.77V8.98ZM5.13 4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Zm6.13 4.98H8.6V20h2.66v-5.78c0-1.52.29-2.99 2.17-2.99 1.85 0 1.87 1.73 1.87 3.08V20h2.67v-6.41c0-3.15-.67-5.57-4.36-5.57-1.77 0-2.96.97-3.45 1.89h-.04V8.98Z" /></svg>',
};

function cloneData(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function attr(name, value) {
  if (value === undefined || value === null || value === "") return "";
  return ` ${name}="${escapeHTML(value)}"`;
}

function renderIcon(name) {
  return iconSvg[name] || "";
}

function setPageMeta(pageContent) {
  if (!pageContent) return;
  if (pageContent.title) document.title = pageContent.title;
  const description = document.querySelector('meta[name="description"]');
  if (description && pageContent.description) description.setAttribute("content", pageContent.description);
}

function renderTopNav(navItems, homeHref) {
  const topNav = document.querySelector(".top-nav");
  const profile = siteState.content?.profile;
  if (!topNav || !profile) return;

  topNav.innerHTML = `
    <a class="top-nav-name" href="${escapeHTML(homeHref)}">
      <span>${escapeHTML(profile.topName || profile.name)}</span>
    </a>
    <nav>
      ${(navItems || [])
        .map((item) => `<a href="${escapeHTML(item.href)}">${escapeHTML(item.label)}</a>`)
        .join("")}
    </nav>
  `;
}

function renderProfileSidebar() {
  const sidebar = document.querySelector(".profile-sidebar");
  const profile = siteState.content?.profile;
  if (!sidebar || !profile) return;

  const photo = profile.photo || {};
  sidebar.innerHTML = `
    <div class="profile-photo-frame">
      <img class="profile-photo"${attr("src", photo.src)}${attr("srcset", photo.srcset)}${attr("sizes", photo.sizes)}${attr("width", photo.width)}${attr("height", photo.height)} fetchpriority="high" decoding="async"${attr("alt", photo.alt)} />
    </div>
    <div class="sidebar-name-block">
      <p class="sidebar-kicker">${escapeHTML(profile.kicker)}</p>
      <h2>${escapeHTML(profile.name)} <span class="name-cn">${escapeHTML(profile.nameCn)}</span></h2>
      <p>${escapeHTML(profile.subtitle)}</p>
    </div>
    <nav class="sidebar-nav" aria-label="Section navigation">
      ${(profile.nav || [])
        .map((item) => `<a href="${escapeHTML(item.href)}">${escapeHTML(item.label)}</a>`)
        .join("")}
    </nav>
    <div class="sidebar-links" aria-label="Contact links">
      ${(profile.links || [])
        .map(
          (link) => `
            <a class="icon-link" href="${escapeHTML(link.href)}" aria-label="${escapeHTML(link.label)}">
              ${renderIcon(link.icon)}
            </a>
          `
        )
        .join("")}
    </div>
  `;
}

function renderSectionHeading(section) {
  return `
    <div class="section-heading">
      <h2>${escapeHTML(section.title)}</h2>
    </div>
  `;
}

function renderAboutSection(section) {
  const paragraphs = (section.paragraphs || [])
    .map((paragraph, index) => {
      const className = index === 0 ? "hero-subtitle" : "hero-subtitle hero-subtitle-secondary";
      return `<p class="${className}">${paragraph}</p>`;
    })
    .join("");
  const news = section.news?.length
    ? `
      <div class="news-block" aria-label="Recent news">
        <h2>${escapeHTML(section.newsTitle || "News")}</h2>
        <ol>
          ${section.news
            .map(
              (item) => `
                <li>
                  <time datetime="${escapeHTML(item.datetime)}">${escapeHTML(item.date)}</time>
                  <span>${escapeHTML(item.text)}</span>
                </li>
              `
            )
            .join("")}
        </ol>
      </div>
    `
    : "";

  return `
    <section class="hero-section reveal" id="${escapeHTML(section.id)}">
      <div class="hero-main">
        <h1>${escapeHTML(section.title)}</h1>
        ${paragraphs}
        ${news}
      </div>
    </section>
  `;
}

function renderTimelineSection(section) {
  return `
    <section class="page-section reveal" id="${escapeHTML(section.id)}">
      ${renderSectionHeading(section)}
      <div class="timeline-list">
        ${(section.items || [])
          .map(
            (item) => `
              <article class="timeline-item${item.featured ? " featured-item" : ""}">
                <div class="timeline-date">${escapeHTML(item.date)}</div>
                <div>
                  <h3>${escapeHTML(item.title)}</h3>
                  <p>${escapeHTML(item.text)}</p>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderCardsSection(section) {
  return `
    <section class="page-section reveal" id="${escapeHTML(section.id)}">
      ${renderSectionHeading(section)}
      ${(section.items || [])
        .map(
          (item) => `
            <article class="content-card">
              <div class="card-meta">${escapeHTML(item.meta)}</div>
              <h3>${escapeHTML(item.title)}</h3>
              ${renderBullets(item.bullets)}
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

function renderFoldsSection(section) {
  return `
    <section class="page-section reveal" id="${escapeHTML(section.id)}">
      ${renderSectionHeading(section)}
      <div class="fold-list">
        ${(section.items || [])
          .map((item) => renderFoldCard(item, section.cardClass))
          .join("")}
      </div>
    </section>
  `;
}

function renderFoldCard(item, cardClass = "") {
  const codeButton = item.codeUrl
    ? `
      <a class="resource-button" href="${escapeHTML(item.codeUrl)}" aria-label="${escapeHTML(item.codeLabel || `Open ${item.title} code`)}">
        ${renderIcon("github")}
        <span>Code</span>
      </a>
    `
    : '<span class="resource-button-placeholder" aria-hidden="true"></span>';
  const tags = item.tags?.length
    ? `
      <div class="tag-row">
        ${item.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}
      </div>
    `
    : "";

  return `
    <details class="fold-card ${escapeHTML(cardClass)}">
      <summary>
        <span class="fold-copy">
          <span class="card-meta">${escapeHTML(item.meta)}</span>
          <span class="fold-title">${escapeHTML(item.title)}</span>
          <span class="fold-brief">${escapeHTML(item.brief)}</span>
        </span>
        <span class="fold-side">
          ${codeButton}
          <span class="details-label">Details</span>
        </span>
      </summary>
      <div class="fold-body">
        ${renderBullets(item.bullets)}
        ${tags}
      </div>
    </details>
  `;
}

function renderSkillsSection(section) {
  return `
    <section class="page-section reveal" id="${escapeHTML(section.id)}">
      ${renderSectionHeading(section)}
      <div class="skill-grid">
        ${(section.items || [])
          .map(
            (item) => `
              <article class="skill-card">
                <h3>${escapeHTML(item.title)}</h3>
                <p>${escapeHTML(item.text)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderCertificatesSection(section) {
  return `
    <section class="page-section reveal" id="${escapeHTML(section.id)}">
      ${renderSectionHeading(section)}
      <div class="certificate-list">
        ${(section.groups || [])
          .map(
            (group) => `
              <article class="certificate-group">
                <div class="card-meta">${escapeHTML(group.issuer)}</div>
                <div class="certificate-stack">
                  ${(group.items || [])
                    .map(
                      (item) => `
                        <a class="certificate-name" href="${escapeHTML(item.href)}">
                          <span>${escapeHTML(item.title)}</span>
                          <time datetime="${escapeHTML(item.datetime)}">${escapeHTML(item.date)}</time>
                        </a>
                      `
                    )
                    .join("")}
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderBullets(bullets = []) {
  if (!bullets.length) return "";
  return `
    <ul>
      ${bullets.map((bullet) => `<li>${escapeHTML(bullet)}</li>`).join("")}
    </ul>
  `;
}

function renderHomePage() {
  const home = siteState.content?.home;
  if (!home) return;
  setPageMeta(home);
  renderTopNav(siteState.content.profile.nav, "#about");
  renderProfileSidebar();

  const main = document.querySelector("main.content");
  if (!main) return;

  main.innerHTML = (home.sections || [])
    .map((section) => {
      switch (section.type) {
        case "about":
          return renderAboutSection(section);
        case "timeline":
          return renderTimelineSection(section);
        case "cards":
          return renderCardsSection(section);
        case "folds":
          return renderFoldsSection(section);
        case "skills":
          return renderSkillsSection(section);
        case "certificates":
          return renderCertificatesSection(section);
        default:
          return "";
      }
    })
    .join("");
}

function renderLifePage() {
  const life = siteState.content?.life;
  if (!life) return;
  setPageMeta(life);
  renderTopNav(life.nav, "index.html#about");

  const main = document.querySelector(".life-shell");
  if (!main) return;

  main.innerHTML = `
    <section class="life-hero reveal" id="${escapeHTML(life.hero?.id || "life-top")}">
      <p class="life-kicker">${escapeHTML(life.hero?.kicker)}</p>
      <h1>${escapeHTML(life.hero?.title)}</h1>
    </section>
    ${(life.sections || []).map(renderLifeSection).join("")}
  `;
}

function renderLifeSection(section) {
  if (section.type === "lifeGrid") {
    return `
      <section class="life-section reveal" id="${escapeHTML(section.id)}">
        ${renderSectionHeading(section)}
        <div class="life-log-grid">
          ${(section.items || [])
            .map(
              (item) => `
                <article>
                  <span class="card-meta">${escapeHTML(item.meta)}</span>
                  <h3>${escapeHTML(item.title)}</h3>
                  <p>${escapeHTML(item.text)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  if (section.type === "lifeEntry") {
    const entry = section.entry || {};
    return `
      <section class="life-section reveal" id="${escapeHTML(section.id)}">
        ${renderSectionHeading(section)}
        <article class="life-entry">
          <div class="card-meta">${escapeHTML(entry.meta)}</div>
          <h3>${escapeHTML(entry.title)}</h3>
          ${renderBullets(entry.bullets)}
        </article>
      </section>
    `;
  }

  if (section.type === "honors") {
    return `
      <section class="life-section reveal" id="${escapeHTML(section.id)}">
        ${renderSectionHeading(section)}
        <div class="honor-list life-honors">
          ${(section.items || []).map((item) => `<p>${escapeHTML(item)}</p>`).join("")}
        </div>
      </section>
    `;
  }

  return "";
}

function renderCurrentPage() {
  if (!siteState.content) return;
  if (document.body.classList.contains("life-page")) {
    renderLifePage();
  } else {
    renderHomePage();
  }
  refreshDynamicBehavior();
}

function scrollToSection(target) {
  const topNav = document.querySelector(".top-nav");
  const navHeight = topNav ? topNav.getBoundingClientRect().height : 0;
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 28;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduceMotionQuery.matches ? "auto" : "smooth",
  });
}

document.addEventListener("click", (event) => {
  const foldLink = event.target.closest(".fold-side a");
  if (foldLink) event.stopPropagation();

  const link = event.target.closest('a[href^="#"]');
  if (!link || link.closest(".editor-panel")) return;

  const id = link.getAttribute("href").slice(1);
  const target = document.getElementById(id);
  if (!target) return;

  event.preventDefault();
  scrollToSection(target);
  window.history.pushState(null, "", `#${id}`);
});

function refreshDynamicBehavior() {
  siteState.revealObserver?.disconnect();
  siteState.activeObserver?.disconnect();

  document.querySelectorAll(".fold-side a").forEach((link) => {
    link.addEventListener("click", (event) => event.stopPropagation());
  });

  const reveals = [...document.querySelectorAll(".reveal")];
  siteState.revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          siteState.revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  reveals.forEach((element) => siteState.revealObserver.observe(element));

  const navLinks = [...document.querySelectorAll('.sidebar-nav a[href^="#"], .top-nav nav a[href^="#"]')];
  const sections = [...document.querySelectorAll("section[id]")];
  siteState.activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-25% 0px -55% 0px", threshold: 0.01 }
  );
  sections.forEach((section) => siteState.activeObserver.observe(section));
}

function initAmbientParticles() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: true });

  if (!context || reduceMotionQuery.matches) return;

  canvas.className = "ambient-particles";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const particles = [];
  const sparks = [];
  const ripples = [];
  const colors = [
    { fill: "rgba(215, 255, 69,", glow: "rgb(215, 255, 69)" },
    { fill: "rgba(185, 255, 63,", glow: "rgb(185, 255, 63)" },
    { fill: "rgba(255, 245, 120,", glow: "rgb(255, 245, 120)" },
  ];
  let width = 0;
  let height = 0;
  let density = 0;
  let lastScrollY = window.scrollY;
  let scrollImpulse = 0;
  let animationFrame = 0;

  const random = (min, max) => min + Math.random() * (max - min);

  const makeParticle = () => ({
    x: random(0, width),
    y: random(0, height),
    vx: random(-0.08, 0.08),
    vy: random(-0.1, 0.1),
    size: random(0.35, 0.95),
    pulse: random(0, Math.PI * 2),
    color: colors[Math.floor(random(0, colors.length))],
    link: random(42, 78),
  });

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    density = width < 760 ? 34 : Math.min(86, Math.floor(width / 18));
    while (particles.length < density) particles.push(makeParticle());
    particles.length = density;
  };

  const burst = (x, y, amount = 28) => {
    ripples.push({ x, y, age: 0, life: 42 });

    for (let index = 0; index < amount; index += 1) {
      const angle = random(0, Math.PI * 2);
      const speed = random(0.9, 3.2);
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: random(24, 40),
        age: 0,
        size: random(0.7, 1.8),
        color: colors[Math.floor(random(0, colors.length))],
      });
    }
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    context.lineCap = "round";
    scrollImpulse *= 0.92;

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy + Math.sin(particle.pulse) * 0.035 + scrollImpulse * 0.018;
      particle.vx += Math.cos(particle.pulse * 0.72) * 0.0025;
      particle.vx *= 0.988;
      particle.vy *= 0.988;
      particle.pulse += 0.032;

      if (particle.x < -20 || particle.x > width + 20 || particle.y < -20 || particle.y > height + 20) {
        particles[index] = makeParticle();
        particles[index].y = particle.y < 0 ? height + 12 : -12;
      }

      const glow = particle.size + Math.sin(particle.pulse) * 0.65;
      context.beginPath();
      context.fillStyle = `${particle.color.fill}0.42)`;
      context.shadowColor = particle.color.glow;
      context.shadowBlur = 4;
      context.arc(particle.x, particle.y, Math.max(0.35, glow), 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;

      for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
        const other = particles[nextIndex];
        const gap = Math.hypot(particle.x - other.x, particle.y - other.y);
        const maxLink = Math.min(particle.link, other.link);
        if (gap > maxLink) continue;

        context.beginPath();
        context.strokeStyle = `rgba(185, 255, 63, ${0.055 * (1 - gap / maxLink)})`;
        context.lineWidth = 0.55;
        context.moveTo(particle.x, particle.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    });

    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      const ripple = ripples[index];
      ripple.age += 1;

      const progress = ripple.age / ripple.life;
      const alpha = Math.max(0, 1 - progress);
      const radius = 18 + progress * 112;

      context.save();
      context.setLineDash([2, 8]);
      context.lineDashOffset = -ripple.age * 1.4;
      context.strokeStyle = `rgba(215, 255, 69, ${0.48 * alpha})`;
      context.lineWidth = 1.2;
      context.beginPath();
      context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
      context.stroke();
      context.setLineDash([]);
      context.strokeStyle = `rgba(185, 255, 63, ${0.2 * alpha})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(ripple.x, ripple.y, radius * 0.56, 0, Math.PI * 2);
      context.stroke();
      context.restore();

      if (ripple.age >= ripple.life) ripples.splice(index, 1);
    }

    for (let index = sparks.length - 1; index >= 0; index -= 1) {
      const spark = sparks[index];
      spark.age += 1;
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vx *= 0.96;
      spark.vy *= 0.96;

      const alpha = Math.max(0, 1 - spark.age / spark.life);
      context.beginPath();
      context.fillStyle = `${spark.color.fill}${0.76 * alpha})`;
      context.shadowColor = spark.color.glow;
      context.shadowBlur = 16 * alpha;
      context.arc(spark.x, spark.y, spark.size * alpha, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;

      if (spark.age >= spark.life) sparks.splice(index, 1);
    }

    animationFrame = window.requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize);
  window.addEventListener("click", (event) => {
    if (!event.target.closest(".editor-panel")) burst(event.clientX, event.clientY);
  });
  window.addEventListener(
    "scroll",
    () => {
      scrollImpulse = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
    },
    { passive: true }
  );

  reduceMotionQuery.addEventListener(
    "change",
    () => {
      window.cancelAnimationFrame(animationFrame);
      canvas.remove();
    },
    { once: true }
  );

  resize();
  draw();
}

function initHiddenEditor() {
  if (!siteState.content) return;

  let clickCount = 0;
  let resetTimer = 0;

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".top-nav-name, .sidebar-name-block h2");
    if (!trigger || event.target.closest(".editor-panel")) return;

    clickCount += 1;
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      clickCount = 0;
    }, 2200);

    if (clickCount >= 5) {
      event.preventDefault();
      clickCount = 0;
      openEditor();
    }
  });
}

function openEditor() {
  if (!siteState.editor) siteState.editor = createEditor();
  document.body.classList.add("is-editing");
  siteState.editor.root.hidden = false;
  populateEditorBlocks();
  loadSelectedEditorBlock();
  setEditorStatus("编辑模式已开启。先应用到页面预览，确认后再保存到 GitHub。");
  siteState.editor.textarea.focus();
}

function createEditor() {
  const root = document.createElement("div");
  root.className = "editor-shell";
  root.hidden = true;
  root.innerHTML = `
    <div class="editor-scrim" data-editor-action="close" aria-hidden="true"></div>
    <aside class="editor-panel" role="dialog" aria-modal="true" aria-label="Hidden content editor">
      <header class="editor-head">
        <div>
          <p class="editor-kicker">Hidden Edit Mode</p>
          <h2>Content Studio</h2>
        </div>
        <button type="button" class="editor-icon-button" data-editor-action="close" aria-label="Close editor">×</button>
      </header>
      <div class="editor-toolbar">
        <label>
          <span>Block</span>
          <select data-editor-field="block"></select>
        </label>
        <button type="button" data-editor-action="format">Format</button>
        <button type="button" data-editor-action="apply">Apply Preview</button>
        <button type="button" data-editor-action="save">Save to GitHub</button>
      </div>
      <textarea data-editor-field="json" spellcheck="false" aria-label="Editable content JSON"></textarea>
      <details class="editor-github">
        <summary>GitHub save settings</summary>
        <div class="editor-github-grid">
          <label><span>Owner</span><input data-editor-field="owner" autocomplete="off" /></label>
          <label><span>Repo</span><input data-editor-field="repo" autocomplete="off" /></label>
          <label><span>Branch</span><input data-editor-field="branch" autocomplete="off" /></label>
          <label><span>Content file</span><input data-editor-field="path" autocomplete="off" /></label>
          <label class="editor-token"><span>GitHub token</span><input data-editor-field="token" type="password" autocomplete="off" placeholder="Fine-grained token, kept only in this tab" /></label>
        </div>
        <p>Token needs repository contents read/write permission. The token is never saved into the public site.</p>
      </details>
      <p class="editor-status" role="status" data-editor-field="status"></p>
    </aside>
  `;
  document.body.append(root);

  const editor = {
    root,
    select: root.querySelector('[data-editor-field="block"]'),
    textarea: root.querySelector('[data-editor-field="json"]'),
    status: root.querySelector('[data-editor-field="status"]'),
    owner: root.querySelector('[data-editor-field="owner"]'),
    repo: root.querySelector('[data-editor-field="repo"]'),
    branch: root.querySelector('[data-editor-field="branch"]'),
    path: root.querySelector('[data-editor-field="path"]'),
    token: root.querySelector('[data-editor-field="token"]'),
  };

  const github = siteState.content.github || {};
  editor.owner.value = github.owner || "";
  editor.repo.value = github.repo || "";
  editor.branch.value = github.branch || "main";
  editor.path.value = github.path || "data/site-content.js";
  editor.token.value = window.sessionStorage.getItem("zhijing-content-token") || "";

  root.addEventListener("click", handleEditorClick);
  editor.select.addEventListener("change", loadSelectedEditorBlock);
  editor.textarea.addEventListener("input", () => {
    siteState.dirty = true;
    setEditorStatus("有未应用的编辑。");
  });

  return editor;
}

function handleEditorClick(event) {
  const action = event.target.closest("[data-editor-action]")?.dataset.editorAction;
  if (!action) return;

  if (action === "close") {
    closeEditor();
  } else if (action === "format") {
    formatEditorJson();
  } else if (action === "apply") {
    applyEditorJson();
  } else if (action === "save") {
    saveContentToGitHub();
  }
}

function closeEditor() {
  siteState.editor.root.hidden = true;
  document.body.classList.remove("is-editing");
}

function getEditorBlocks() {
  const blocks = [
    { label: "Whole site data", path: [] },
    { label: "Profile / sidebar", path: ["profile"] },
    { label: "GitHub config", path: ["github"] },
    { label: "Home page", path: ["home"] },
  ];

  (siteState.content.home?.sections || []).forEach((section, index) => {
    blocks.push({ label: `Home / ${section.title || section.id}`, path: ["home", "sections", index] });
  });

  blocks.push({ label: "Life page", path: ["life"] });
  blocks.push({ label: "Life / hero", path: ["life", "hero"] });

  (siteState.content.life?.sections || []).forEach((section, index) => {
    blocks.push({ label: `Life / ${section.title || section.id}`, path: ["life", "sections", index] });
  });

  return blocks;
}

function populateEditorBlocks(selectedPath = siteState.editor?.select.value) {
  if (!siteState.editor) return;
  const blocks = getEditorBlocks();
  siteState.editor.select.innerHTML = blocks
    .map((block) => `<option value="${escapeHTML(JSON.stringify(block.path))}">${escapeHTML(block.label)}</option>`)
    .join("");

  if (selectedPath && [...siteState.editor.select.options].some((option) => option.value === selectedPath)) {
    siteState.editor.select.value = selectedPath;
  }
}

function loadSelectedEditorBlock() {
  const path = JSON.parse(siteState.editor.select.value || "[]");
  siteState.editor.textarea.value = JSON.stringify(getByPath(siteState.content, path), null, 2);
}

function formatEditorJson() {
  try {
    siteState.editor.textarea.value = JSON.stringify(JSON.parse(siteState.editor.textarea.value), null, 2);
    setEditorStatus("JSON 已格式化。");
  } catch (error) {
    setEditorStatus(`JSON 格式不对：${error.message}`, true);
  }
}

function applyEditorJson() {
  let nextValue;
  try {
    nextValue = JSON.parse(siteState.editor.textarea.value);
  } catch (error) {
    setEditorStatus(`JSON 格式不对：${error.message}`, true);
    return;
  }

  const selectedPath = siteState.editor.select.value;
  const path = JSON.parse(selectedPath || "[]");

  if (path.length === 0) {
    siteState.content = nextValue;
  } else {
    setByPath(siteState.content, path, nextValue);
  }

  window.SITE_CONTENT = siteState.content;
  renderCurrentPage();
  populateEditorBlocks(selectedPath);
  loadSelectedEditorBlock();
  siteState.dirty = false;
  setEditorStatus("已应用到页面预览。");
}

function getByPath(source, path) {
  return path.reduce((value, key) => value?.[key], source);
}

function setByPath(source, path, value) {
  const last = path[path.length - 1];
  const parent = path.slice(0, -1).reduce((current, key) => current[key], source);
  parent[last] = value;
}

function readGithubSettings() {
  const editor = siteState.editor;
  return {
    owner: editor.owner.value.trim(),
    repo: editor.repo.value.trim(),
    branch: editor.branch.value.trim() || "main",
    path: editor.path.value.trim() || "data/site-content.js",
    token: editor.token.value.trim(),
  };
}

function serializeContent(settings) {
  const content = cloneData(siteState.content);
  content.version = new Date().toISOString();
  content.github = {
    owner: settings.owner,
    repo: settings.repo,
    branch: settings.branch,
    path: settings.path,
  };
  return `window.SITE_CONTENT = ${JSON.stringify(content, null, 2)};\n`;
}

function base64EncodeUtf8(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

function githubContentUrl(settings) {
  const encodedPath = settings.path.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${encodeURIComponent(settings.owner)}/${encodeURIComponent(settings.repo)}/contents/${encodedPath}`;
}

async function saveContentToGitHub() {
  if (siteState.dirty) applyEditorJson();
  if (siteState.dirty) return;

  const settings = readGithubSettings();
  if (!settings.owner || !settings.repo || !settings.path || !settings.token) {
    setEditorStatus("请先填写 owner、repo、content file 和 GitHub token。", true);
    return;
  }

  siteState.content.github = {
    owner: settings.owner,
    repo: settings.repo,
    branch: settings.branch,
    path: settings.path,
  };
  window.sessionStorage.setItem("zhijing-content-token", settings.token);

  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${settings.token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const url = githubContentUrl(settings);
  setEditorStatus("正在读取 GitHub 上的内容文件...");

  try {
    const readResponse = await fetch(`${url}?ref=${encodeURIComponent(settings.branch)}`, { headers });
    let sha = null;
    if (readResponse.ok) {
      const currentFile = await readResponse.json();
      sha = currentFile.sha;
    } else if (readResponse.status !== 404) {
      throw new Error(`读取失败：${readResponse.status} ${await readResponse.text()}`);
    }

    setEditorStatus("正在保存到 GitHub...");
    const writeResponse = await fetch(url, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update website content from hidden editor",
        content: base64EncodeUtf8(serializeContent(settings)),
        branch: settings.branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!writeResponse.ok) {
      throw new Error(`保存失败：${writeResponse.status} ${await writeResponse.text()}`);
    }

    setEditorStatus("已保存到 GitHub。GitHub Pages 通常需要几十秒部署。");
  } catch (error) {
    setEditorStatus(error.message, true);
  }
}

function setEditorStatus(message, isError = false) {
  if (!siteState.editor) return;
  siteState.editor.status.textContent = message;
  siteState.editor.status.classList.toggle("is-error", isError);
}

renderCurrentPage();
refreshDynamicBehavior();
initHiddenEditor();
initAmbientParticles();

window.addEventListener("load", () => {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  if (target) window.setTimeout(() => scrollToSection(target), 0);
});
