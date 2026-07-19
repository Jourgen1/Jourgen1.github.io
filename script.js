(() => {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const revealItems = document.querySelectorAll("[data-reveal]");
  const copyButton = document.querySelector("[data-copy-email]");
  const copyStatus = document.querySelector("[data-copy-status]");
  const year = document.querySelector("[data-year]");
  const briefDialog = document.querySelector("[data-brief-dialog]");
  const openBriefButtons = document.querySelectorAll("[data-open-brief]");
  const closeBriefButton = document.querySelector("[data-close-brief]");
  const briefType = document.querySelector("[data-brief-type]");
  const briefPaces = document.querySelectorAll("[data-brief-pace]");
  const briefGoal = document.querySelector("[data-brief-goal]");
  const briefPrice = document.querySelector("[data-brief-price]");
  const briefTime = document.querySelector("[data-brief-time]");
  const briefStatus = document.querySelector("[data-brief-status]");
  const copyBriefButton = document.querySelector("[data-copy-brief]");
  const emailBriefButton = document.querySelector("[data-email-brief]");
  const caseToggleButtons = document.querySelectorAll("[data-case-toggle]");
  const mobileMenuQuery = window.matchMedia("(max-width: 700px)");
  let briefTrigger = null;

  const briefRates = {
    site: {
      label: "лендинг или небольшой сайт",
      price: "25–60 тыс. ₽",
      time: "3–7 дней",
    },
    integration: {
      label: "виджет, API или Telegram-интеграция",
      price: "30–70 тыс. ₽",
      time: "3–5 дней",
    },
    automation: {
      label: "Python-скрипт или автоматизация",
      price: "10–40 тыс. ₽",
      time: "1–3 дня",
    },
    revision: {
      label: "небольшая доработка",
      price: "5–15 тыс. ₽",
      time: "1–2 дня",
    },
  };

  const copyText = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Use the legacy fallback below when Clipboard API is unavailable.
    }

    const activeElement = document.activeElement;
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);

    try {
      field.focus({ preventScroll: true });
      field.select();
      return document.execCommand("copy");
    } finally {
      field.remove();
      if (activeElement instanceof HTMLElement && activeElement.isConnected) {
        activeElement.focus({ preventScroll: true });
      }
    }
  };

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const isMobileMenu = () => mobileMenuQuery.matches;

  const setMenuState = (open) => {
    if (!menuToggle || !menu) return;

    const isOpen = isMobileMenu() && open;
    const label = menuToggle.querySelector(".sr-only");

    menu.classList.toggle("is-open", isOpen);
    menu.toggleAttribute("inert", isMobileMenu() && !isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));

    if (isMobileMenu()) {
      menu.setAttribute("aria-hidden", String(!isOpen));
    } else {
      menu.removeAttribute("aria-hidden");
    }

    if (label) {
      label.textContent = isOpen ? "Закрыть навигацию" : "Открыть навигацию";
    }
  };

  const closeMenu = () => {
    setMenuState(false);
  };

  menuToggle?.addEventListener("click", () => {
    if (!isMobileMenu()) return;

    const shouldOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    setMenuState(shouldOpen);

    if (shouldOpen) {
      window.requestAnimationFrame(() => {
        menu?.querySelector("a, button:not([disabled])")?.focus();
      });
    }
  });

  menu?.querySelectorAll("a, button[data-open-brief]").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (briefDialog?.open) {
        event.preventDefault();
        closeBrief();
        return;
      }

      if (menu?.classList.contains("is-open")) {
        closeMenu();
        menuToggle?.focus();
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !menu?.classList.contains("is-open") ||
      menu.contains(event.target) ||
      menuToggle?.contains(event.target)
    ) {
      return;
    }

    closeMenu();
  });

  const syncMenu = () => setMenuState(false);
  syncMenu();
  document.documentElement.classList.add("menu-ready");
  window.addEventListener("resize", syncMenu);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    document.documentElement.classList.add("reveal-ready");
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const setCopyStatus = (message) => {
    if (!copyStatus) return;
    copyStatus.textContent = message;
    window.setTimeout(() => {
      if (copyStatus.textContent === message) {
        copyStatus.textContent = "";
      }
    }, 3000);
  };

  copyButton?.addEventListener("click", async () => {
    const email = copyButton.dataset.email;
    if (!email) return;

    if (await copyText(email)) {
      setCopyStatus("Email скопирован в буфер обмена.");
    } else {
      window.location.href = `mailto:${email}`;
      setCopyStatus("Открываю почтовое приложение.");
    }
  });

  const setBriefStatus = (message) => {
    if (!briefStatus) return;

    briefStatus.textContent = message;
    window.setTimeout(() => {
      if (briefStatus.textContent === message) {
        briefStatus.textContent = "";
      }
    }, 3500);
  };

  const getSelectedPace = () =>
    Array.from(briefPaces).find((pace) => pace.checked)?.value ?? "normal";

  const getBriefRate = () => briefRates[briefType?.value] ?? briefRates.site;

  const updateBriefEstimate = () => {
    const rate = getBriefRate();
    if (briefPrice) briefPrice.textContent = rate.price;
    if (briefTime) {
      briefTime.textContent =
        getSelectedPace() === "urgent"
          ? `${rate.time} · срочный темп обсуждается отдельно`
          : rate.time;
    }
  };

  const getBriefText = () => {
    const rate = getBriefRate();
    const goal = briefGoal?.value.trim();
    const pace = getSelectedPace() === "urgent" ? "срочный" : "обычный";

    return [
      "Здравствуйте, Юрий!",
      "",
      `Хочу обсудить: ${rate.label}.`,
      `Темп: ${pace}.`,
      `Ориентир, который показал сайт: ${rate.price}, ${rate.time}.`,
      goal ? `Цель: ${goal}.` : "Цель: расскажу в сообщении.",
      "",
      "Подскажите, какие детали нужны для точной оценки?",
    ].join("\n");
  };

  const openBrief = (event) => {
    if (!briefDialog) return;

    event.preventDefault();
    briefTrigger = event.currentTarget;
    updateBriefEstimate();
    if (briefDialog.open) return;

    if (typeof briefDialog.showModal === "function") {
      briefDialog.showModal();
    } else {
      briefDialog.setAttribute("open", "");
    }

    window.setTimeout(() => briefType?.focus(), 0);
  };

  const closeBrief = () => {
    if (!briefDialog) return;

    if (briefDialog.open && typeof briefDialog.close === "function") {
      briefDialog.close();
    } else {
      briefDialog.removeAttribute("open");
    }
  };

  openBriefButtons.forEach((button) => {
    button.addEventListener("click", openBrief);
  });

  closeBriefButton?.addEventListener("click", closeBrief);

  briefDialog?.addEventListener("click", (event) => {
    if (event.target === briefDialog) closeBrief();
  });

  briefDialog?.addEventListener("close", () => {
    const returnTarget =
      briefTrigger && menu?.contains(briefTrigger) && isMobileMenu()
        ? menuToggle
        : briefTrigger;

    returnTarget?.focus();
    briefTrigger = null;
  });

  briefType?.addEventListener("change", updateBriefEstimate);
  briefPaces.forEach((pace) => pace.addEventListener("change", updateBriefEstimate));

  copyBriefButton?.addEventListener("click", async () => {
    const text = getBriefText();

    if (await copyText(text)) {
      setBriefStatus("Запрос скопирован. Вставьте его в Telegram или письмо.");
    } else {
      setBriefStatus("Не удалось скопировать автоматически — отправьте запрос на email.");
    }
  });

  emailBriefButton?.addEventListener("click", () => {
    const subject = "Запрос с портфолио";
    window.location.href = `mailto:ivanovivanovore@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(getBriefText())}`;
  });

  caseToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const detailsId = button.getAttribute("aria-controls");
      const details = detailsId ? document.getElementById(detailsId) : null;
      if (!details) return;

      const isOpen = button.getAttribute("aria-expanded") === "true";
      const label = button.querySelector("span:first-child");
      const symbol = button.querySelector("span:last-child");

      button.setAttribute("aria-expanded", String(!isOpen));
      details.hidden = isOpen;
      if (label) label.textContent = isOpen ? "Что внутри" : "Скрыть детали";
      if (symbol) symbol.textContent = isOpen ? "+" : "−";
    });
  });
})();
