const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll(".sidebar-nav a")];
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const topNav = document.querySelector(".top-nav");

const scrollToSection = (target) => {
  const navHeight = topNav ? topNav.getBoundingClientRect().height : 0;
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 28;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduceMotionQuery.matches ? "auto" : "smooth",
  });
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href").slice(1);
    const target = document.getElementById(id);

    if (!target) return;
    event.preventDefault();
    scrollToSection(target);
    window.history.pushState(null, "", `#${id}`);
  });
});

const initAmbientParticles = () => {
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
  window.addEventListener("click", (event) => burst(event.clientX, event.clientY));
  window.addEventListener("scroll", () => {
    scrollImpulse = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
  }, { passive: true });

  reduceMotionQuery.addEventListener("change", () => {
    window.cancelAnimationFrame(animationFrame);
    canvas.remove();
  }, { once: true });

  resize();
  draw();
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const activeObserver = new IntersectionObserver(
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

sections.forEach((section) => activeObserver.observe(section));


document.querySelectorAll(".fold-side a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

initAmbientParticles();
