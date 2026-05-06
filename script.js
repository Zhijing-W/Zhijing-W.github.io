const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll(".sidebar-nav a")];

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

const botLab = document.querySelector("[data-bot-lab]");

if (botLab) {
  const stage = botLab.querySelector("[data-bot-stage]");
  const dirtLayer = botLab.querySelector("[data-dirt-layer]");
  const bot = botLab.querySelector(".cleanup-bot");
  const status = botLab.querySelector("[data-bot-status]");
  const snippets = ["while True: pass", "except: pass", "eval(input())", "if x = None:", "np.nan == np.nan", "global state += 1", "malloc(sizeof(ptr))", "strcpy(buf, s)", "free(p); free(p);", "char *p = NULL", "// TODO: race", "SELECT * FROM users"];
  const idleStates = ["scan", "look", "nod", "antenna"];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dirtItems = [];
  let cleaning = false;
  let idleIndex = 0;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const random = (min, max) => min + Math.random() * (max - min);

  const setStatus = (label) => {
    if (status) status.textContent = label;
  };

  const setMood = (mood) => {
    stage.dataset.mood = mood;
  };

  const setBotX = (x) => {
    const maxX = Math.max(8, stage.clientWidth - bot.offsetWidth - 8);
    stage.style.setProperty("--bot-x", `${clamp(x, 8, maxX)}px`);
  };

  const spark = (x, y, amount = 5) => {
    if (reducedMotion) return;
    for (let index = 0; index < amount; index += 1) {
      const dot = document.createElement("span");
      dot.className = "bot-spark";
      dot.style.left = `${x + random(-8, 8)}px`;
      dot.style.top = `${y + random(-8, 8)}px`;
      dot.style.setProperty("--spark-x", `${random(-28, 28)}px`);
      dot.style.setProperty("--spark-y", `${random(-34, -12)}px`);
      stage.append(dot);
      window.setTimeout(() => dot.remove(), 740);
    }
  };

  const cleanNext = () => {
    if (cleaning) return;

    const target = dirtItems.shift();
    if (!target) {
      setMood("idle");
      setStatus("All clean");
      return;
    }

    if (!target.isConnected) {
      cleanNext();
      return;
    }

    cleaning = true;
    setMood("angry");
    setStatus("Detected");
    setBotX(target.offsetLeft - bot.offsetWidth * 0.35);

    window.setTimeout(() => {
      if (!target.isConnected) {
        cleaning = false;
        cleanNext();
        return;
      }

      setMood("cleaning");
      setStatus("Cleaning");
      spark(target.offsetLeft + target.offsetWidth * 0.5, target.offsetTop + target.offsetHeight * 0.5, 4);
      target.classList.add("is-cleaning");

      window.setTimeout(() => {
        target.remove();
        cleaning = false;
        if (dirtItems.length > 0) {
          window.setTimeout(cleanNext, 120);
        } else {
          setMood("idle");
          setStatus("All clean");
        }
      }, 430);
    }, reducedMotion ? 80 : 620);
  };

  const scheduleClean = () => {
    if (cleaning) return;
    window.setTimeout(cleanNext, reducedMotion ? 20 : 180);
  };

  const spawnDirt = (clientX, clientY, burst = false) => {
    const rect = stage.getBoundingClientRect();
    const count = burst ? 2 : 1;

    for (let index = 0; index < count; index += 1) {
      const dirt = document.createElement("span");
      const maxX = Math.max(42, rect.width - 132);
      const x = clamp(clientX - rect.left + random(-22, 22), 42, maxX);
      const y = clamp(rect.height * 0.5 + random(-3, 3), 5, Math.max(5, rect.height - 18));
      dirt.className = "code-dirt";
      dirt.textContent = snippets[Math.floor(Math.random() * snippets.length)];
      dirt.style.left = `${x}px`;
      dirt.style.top = `${y}px`;
      dirt.style.setProperty("--rot", `${random(-8, 8)}deg`);
      dirtLayer.append(dirt);
      dirtItems.push(dirt);
    }

    while (dirtItems.length > 9) {
      const stale = dirtItems.shift();
      if (stale && stale.isConnected) stale.remove();
    }

    setMood("angry");
    setStatus("Dirty code");
    scheduleClean();
  };

  const cheerBot = () => {
    if (cleaning || dirtItems.length > 0) {
      setMood("angry");
      scheduleClean();
      return;
    }

    setMood("happy");
    setStatus("Happy");
    const x = parseFloat(getComputedStyle(stage).getPropertyValue("--bot-x")) || 42;
    spark(x + bot.offsetWidth * 0.52, stage.clientHeight * 0.5, 5);

    window.setTimeout(() => {
      if (!cleaning && dirtItems.length === 0) {
        setMood("idle");
        setStatus("All clean");
      }
    }, reducedMotion ? 180 : 950);
  };

  stage.addEventListener("click", (event) => {
    if (event.target.closest(".cleanup-bot")) return;
    spawnDirt(event.clientX, event.clientY, true);
  });

  bot.addEventListener("click", (event) => {
    event.stopPropagation();
    cheerBot();
  });

  setBotX(42);
  window.addEventListener("resize", () => setBotX(parseFloat(getComputedStyle(stage).getPropertyValue("--bot-x")) || 42));

  if (!reducedMotion) {
    window.setInterval(() => {
      if (stage.dataset.mood !== "idle") return;
      idleIndex = (idleIndex + 1) % idleStates.length;
      stage.dataset.idle = idleStates[idleIndex];
    }, 3200);
  }
}

