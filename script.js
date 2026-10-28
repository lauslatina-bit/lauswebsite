/* ==========================================================================
   LAUS LATINA — BASE SCRIPT
   ==========================================================================
   Small, dependency-free interactions:
   1. Mobile nav toggle
   2. Scroll-reveal for elements marked .reveal
   3. Sticky header shadow on scroll
   4. Join form — front-end only demo (swap the TODO with your real
      newsletter/API call once one exists)
   5. Footer year
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- FORMSUBMIT — popup answers by email ----------
     Each popup submission is emailed to JOIN_EMAIL through FormSubmit
     (formsubmit.co, free, no account). The very first submission makes
     FormSubmit send an activation email to that inbox — click
     "Activate Form" once and every later submission arrives as a normal
     email. Only works when the site is served from a real web address
     (not when opening index.html directly from the computer). */
  var JOIN_EMAIL = "lauslatina@gmail.com";
  var JOIN_ENDPOINT = "https://formsubmit.co/ajax/" + JOIN_EMAIL;

  /* ---------- 1. Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close the mobile menu whenever a nav link is used
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menú");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- 2. Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el, i) {
      // slight stagger for elements that share a section
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      observer.observe(el);
    });
  } else {
    // No IntersectionObserver support (or no reveal targets) — just show everything
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 3. Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var setHeaderState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  /* ---------- 3b/3c. Orbit scroll sequence ----------
     "Bienvenidos al Archivo" is visible first (right on load) and fades
     out as the home page starts scrolling; "Laus Latina" (the wordmark)
     fades in right after, taking its place, while the orbit itself turns
     into a frosted-glass blur (tiles still visible moving behind it, full
     color — no grayscale). Keep scrolling past that and the wordmark
     fades back out as the intro card slides up to replace it. ---------- */
  var orbitWelcome = document.getElementById("orbitWelcome");
  var orbitWordmark = document.getElementById("orbitWordmark");
  var orbitStageForBlur = document.getElementById("orbitStage");
  var orbitIntro = document.getElementById("orbitIntro");
  if (orbitWelcome && orbitWordmark && orbitStageForBlur) {
    var WELCOME_FADE_DISTANCE = 380; // px scrolled before "Bienvenidos al Archivo" is gone
    var WORDMARK_START = 300; // px scrolled before "Laus Latina" starts fading in
    var WORDMARK_END = 680; // px scrolled when fully revealed
    // A second phase, right after: keep scrolling past the wordmark reveal and
    // the intro copy slides up from below (background stays frozen/blurred).
    var INTRO_START = 760;
    var INTRO_END = 1180;
    var setOrbitSequence = function () {
      var y = window.scrollY || window.pageYOffset || 0;
      var welcomeT = Math.max(0, Math.min(1, 1 - y / WELCOME_FADE_DISTANCE));
      var wordmarkT = Math.max(0, Math.min(1, (y - WORDMARK_START) / (WORDMARK_END - WORDMARK_START)));
      var introT = 0;
      if (orbitIntro) {
        introT = Math.max(0, Math.min(1, (y - INTRO_START) / (INTRO_END - INTRO_START)));
        orbitIntro.style.opacity = String(introT);
        orbitIntro.style.transform = "translate(-50%, " + (60 * (1 - introT)) + "px)";
      }
      orbitWelcome.style.opacity = String(welcomeT);
      // "Laus Latina" fades in through the wordmark phase, then fades back
      // out as the intro image slides up and takes its place.
      orbitWordmark.style.opacity = String(wordmarkT * (1 - introT));
      // Blurred while "Bienvenidos al Archivo" is showing, then clears as
      // you scroll so "Laus Latina" and the tiles come through sharp.
      orbitStageForBlur.style.filter = "blur(" + (welcomeT * 16) + "px)";
    };
    setOrbitSequence();
    window.addEventListener("scroll", setOrbitSequence, { passive: true });
  }

  /* ---------- 3d. Orbit welcome — "ARCHIVO" typography cycle ----------
     The word "ARCHIVO" loops through three typefaces (serif italic, thin
     sans, bold sans) while "BIENVENIDOS AL" stays fixed. The three images
     share one identical crop frame, so cross-fading them in place never
     shifts the layout. ---------- */
  var orbitWelcomeArchivoImgs = document.querySelectorAll(".orbit-welcome-archivo-img");
  if (orbitWelcomeArchivoImgs.length > 1) {
    var archivoTypeIdx = 0;
    setInterval(function () {
      orbitWelcomeArchivoImgs[archivoTypeIdx].classList.remove("is-active");
      archivoTypeIdx = (archivoTypeIdx + 1) % orbitWelcomeArchivoImgs.length;
      orbitWelcomeArchivoImgs[archivoTypeIdx].classList.add("is-active");
    }, 1000);
  }

  /* ---------- 4. Join modal — popup signup form ----------
     Opened from the "Únete" button in the header. Collects name, email,
     city, and content preferences through a hamburger-style dropdown
     (click to expand/collapse) listing La Trastienda, VitrinaAbierta and
     Archivo. Front-end only demo — swap the TODO with a real request
     once there's a newsletter/API endpoint. ---------- */
  var joinModal = document.getElementById("joinModal");
  var joinModalTriggers = document.querySelectorAll('[data-open-modal="joinModal"]');

  if (joinModal) {
    var joinModalClose = document.getElementById("joinModalClose");
    var lastFocusedEl = null;

    var openJoinModal = function () {
      lastFocusedEl = document.activeElement;
      joinModal.classList.add("is-open");
      joinModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (joinModalClose) joinModalClose.focus();
    };

    var closeJoinModal = function () {
      joinModal.classList.remove("is-open");
      joinModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
    };

    // Open the questionnaire right away on the home page — once per
    // browser session, so it doesn't reappear every time someone comes
    // back to the home page from Manifiesto / Nosotros.
    // On the Nosotros page (body data-join-popup="always") it opens every
    // time the page loads.
    var JOIN_SEEN_KEY = "lausJoinPopupSeen";
    var joinAlways = document.body.getAttribute("data-join-popup") === "always";
    var joinAlreadySeen = false;
    try { joinAlreadySeen = sessionStorage.getItem(JOIN_SEEN_KEY) === "1"; } catch (err) {}
    var isHomePage = !document.body.classList.contains("subpage");
    if (joinAlways || (isHomePage && !joinAlreadySeen)) {
      window.scrollTo(0, 0);
      setTimeout(openJoinModal, 400);
      try { sessionStorage.setItem(JOIN_SEEN_KEY, "1"); } catch (err) {}
    }

    // Already on Nosotros? Clicking "Nosotros" again just reopens the popup.
    if (joinAlways) {
      document.querySelectorAll('a[href="nosotros.html"]').forEach(function (link) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          window.scrollTo(0, 0);
          openJoinModal();
        });
      });
    }

    joinModalTriggers.forEach(function (btn) {
      btn.addEventListener("click", openJoinModal);
    });
    if (joinModalClose) joinModalClose.addEventListener("click", closeJoinModal);
    joinModal.addEventListener("click", function (e) {
      if (e.target === joinModal) closeJoinModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && joinModal.classList.contains("is-open")) closeJoinModal();
    });

    // "Preferencias de contenido" — hamburger-style dropdown
    var prefToggle = document.getElementById("prefToggle");
    var prefMenu = document.getElementById("prefMenu");
    var prefToggleLabel = document.getElementById("prefToggleLabel");
    var prefCheckboxes = prefMenu ? prefMenu.querySelectorAll('input[name="preferencias"]') : [];

    var updatePrefLabel = function () {
      if (!prefToggleLabel) return;
      var checked = Array.prototype.filter.call(prefCheckboxes, function (cb) { return cb.checked; });
      if (!checked.length) {
        prefToggleLabel.textContent = "Selecciona tus intereses";
      } else {
        prefToggleLabel.textContent = checked.map(function (cb) { return cb.value; }).join(", ");
      }
    };

    if (prefToggle && prefMenu) {
      prefToggle.addEventListener("click", function () {
        var isOpen = prefToggle.getAttribute("aria-expanded") === "true";
        prefToggle.setAttribute("aria-expanded", String(!isOpen));
        prefMenu.classList.toggle("is-open", !isOpen);
      });
      prefCheckboxes.forEach(function (cb) {
        cb.addEventListener("change", updatePrefLabel);
      });
    }

    var joinForm = document.getElementById("joinForm");
    var joinNote = document.getElementById("joinNote");

    if (joinForm && joinNote) {
      // ENVIAR stays gray until every required box is filled (name, a valid
      // email, city and the data-consent checkbox), then turns navy.
      var joinSubmitBtn = joinForm.querySelector(".modal-submit");
      var updateSubmitState = function () {
        if (!joinSubmitBtn) return;
        var n = joinForm.querySelector("#joinName");
        var em = joinForm.querySelector("#joinEmail");
        var c = joinForm.querySelector("#joinCity");
        var ok = joinForm.querySelector("#joinConsent");
        var ready = !!(n && n.value.trim()) &&
          !!(em && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) &&
          !!(c && c.value.trim()) &&
          (!ok || ok.checked);
        joinSubmitBtn.classList.toggle("is-ready", ready);
      };
      joinForm.addEventListener("input", updateSubmitState);
      joinForm.addEventListener("change", updateSubmitState);
      joinForm.addEventListener("reset", function () { setTimeout(updateSubmitState, 0); });
      updateSubmitState();

      joinForm.addEventListener("submit", function (e) {
        e.preventDefault();

        var nameInput = joinForm.querySelector("#joinName");
        var emailInput = joinForm.querySelector("#joinEmail");
        var cityInput = joinForm.querySelector("#joinCity");
        var name = nameInput.value.trim();
        var email = emailInput.value.trim();
        var city = cityInput.value.trim();
        var isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!name) {
          joinNote.textContent = "Ingresa tu nombre completo.";
          joinNote.classList.add("is-error");
          nameInput.focus();
          return;
        }
        if (!isEmailValid) {
          joinNote.textContent = "Ingresa un correo válido para continuar.";
          joinNote.classList.add("is-error");
          emailInput.focus();
          return;
        }
        if (!city) {
          joinNote.textContent = "Cuéntanos en qué ciudad estás.";
          joinNote.classList.add("is-error");
          cityInput.focus();
          return;
        }

        var consentInput = joinForm.querySelector("#joinConsent");
        if (consentInput && !consentInput.checked) {
          joinNote.textContent = "Necesitamos tu autorización para el tratamiento de datos.";
          joinNote.classList.add("is-error");
          consentInput.focus();
          return;
        }

        joinNote.classList.remove("is-error");

        var prefsInput = joinForm.querySelector("#joinPrefs");
        var preferencias = prefsInput ? prefsInput.value.trim() : "";
        var submitBtn = joinForm.querySelector(".modal-submit");

        var onSuccess = function () {
          joinNote.classList.remove("is-error");
          joinNote.textContent = "¡Gracias, " + name.split(" ")[0] + "! Te escribiremos pronto a " + email + ".";
          joinForm.reset();
          if (submitBtn) submitBtn.disabled = false;
          setTimeout(closeJoinModal, 1800);
        };

        if (submitBtn) submitBtn.disabled = true;
        joinNote.classList.remove("is-error");
        joinNote.textContent = "Enviando…";

        var onError = function () {
          if (submitBtn) submitBtn.disabled = false;
          joinNote.textContent = "No pudimos enviar tus datos. Inténtalo de nuevo en un momento.";
          joinNote.classList.add("is-error");
        };

        fetch(JOIN_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            "Nombre": name,
            "Correo": email,
            "Ciudad": city,
            "Preferencias de contenido": preferencias || "—",
            "Autorización de datos": "Sí, aceptó la Política de Privacidad",
            "_subject": "Nuevo registro en el Archivo — " + name,
            "_replyto": email,
            "_template": "table",
            "_captcha": "false"
          })
        })
          .then(function (res) { return res.json().catch(function () { return {}; }); })
          .then(function (data) {
            if (data && String(data.success) === "false" && !/activ/i.test(data.message || "")) { onError(); return; }
            onSuccess();
          })
          .catch(onError);
      });
    }
  }

  /* ---------- 5. Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- 5b. Archivo article — placeholder title from ?item= ---------- */
  var archivoTitleEl = document.getElementById("archivoTitle");
  if (archivoTitleEl) {
    var archivoParams = new URLSearchParams(window.location.search);
    var archivoN = parseInt(archivoParams.get("item"), 10);
    if (!archivoN || archivoN < 1) { archivoN = 1; }
    archivoTitleEl.textContent = "ARCHIVO " + archivoN;
    var archivoKickerEl = document.getElementById("archivoKicker");
    if (archivoKickerEl) { archivoKickerEl.textContent = archivoN < 10 ? "0" + archivoN : String(archivoN); }
    document.title = "Archivo " + archivoN + " — Laus Latina";
  }

  /* ---------- 6. Orbit showcase — animated tiles below the hero ----------
     Thirteen photo tiles (two loops on the same sphere) travel a shared 3D
     path, leaning away from the cursor as it passes near them, with proper
     depth ordering (z-index) and perspective scaling as they rotate
     toward/away from the camera. Each tile is a real link to its Archivo
     article page — clicking one zooms it to the center of the stage,
     enlarges it, fades it out, then navigates (a real page load, not a
     popup/modal). */
  var orbitStage = document.getElementById("orbitStage");

  if (orbitStage) {
    var ORBIT_IMAGES = [
      "assets/concepto-orbit-01.jpg",
      "assets/concepto-orbit-02.jpg",
      "assets/concepto-orbit-03.jpg",
      "assets/concepto-orbit-04.jpg",
      "assets/concepto-orbit-05.jpg",
      "assets/concepto-orbit-06.jpg",
      "assets/concepto-orbit-07.jpg",
      "assets/concepto-orbit-08.jpg"
    ];

    // Second loop — a new set of tiles on the same sphere, each one starting at
    // the inverse position (opposite side + mirrored latitude) of the first loop.
    var ORBIT_IMAGES_2 = [
      "assets/concepto-orbit-09.jpg",
      "assets/concepto-orbit-10.jpg",
      "assets/concepto-orbit-11.jpg",
      "assets/concepto-orbit-12.jpg",
      "assets/concepto-orbit-13.jpg"
    ];

    var ORBIT_COUNT = ORBIT_IMAGES.length;
    var ORBIT_COUNT_2 = ORBIT_IMAGES_2.length;
    var ORBIT_MAX_INCL = (80 * Math.PI) / 180; // how steep a tile's own orbit can get (near-polar at the extreme)

    // Fixed values — no on-page controls, the orbit always runs with these.
    var ORBIT_SPEED = 0.0009; // 0.3x of the previous pace
    var ORBIT_TILT_DEG = 35; // sphere tilt: 0 = edge-on, 90 = top-down
    var ORBIT_STEER_RADIUS = 120;
    var ORBIT_STEER_STRENGTH = 54;
    var ORBIT_TILE_SIZE = 150; // overall tile scale; width/height below keep a 5:3 horizontal ratio
    var ORBIT_TILE_W = ORBIT_TILE_SIZE * 1.0;
    var ORBIT_TILE_H = ORBIT_TILE_SIZE * 0.6;
    var ORBIT_RADIUS_FRAC = 0.47; // sphere radius as a fraction of the stage's smaller dimension
    var ORBIT_TILT_RAD = (ORBIT_TILT_DEG * Math.PI) / 180;

    var orbitNavigating = false;
    var orbitReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Builds one orbit tile with the exact same look/behavior (hover pause,
    // zoom-and-navigate click) regardless of which loop it belongs to.
    // `node`/`incl` set this tile's own orbital plane (heading + tilt vs. the
    // equator), like a satellite's orbital elements, so as it goes around it
    // sweeps from one latitude extreme to the other instead of sliding along
    // one fixed line of latitude — the group ends up covering far more of
    // the sphere's surface, and no two tiles trace the same path.
    function makeOrbitTile(src, itemNumber, node, incl) {
      // View-only: tiles are plain images, not links — clicking or hovering
      // them does nothing (pointer-events: none in styles.css).
      var tile = document.createElement("div");
      tile.className = "orbit-tile";
      tile.setAttribute("aria-hidden", "true");
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      tile.appendChild(img);
      tile.style.transform = "translate(-9999px, -9999px)";
      orbitStage.appendChild(tile);

      var tileData = {
        el: tile,
        angle: Math.random() * Math.PI * 2, // random starting phase so orbits don't stay bunched together
        incl: incl, // this tile's orbital tilt vs. the equator
        node: node, // this tile's own heading around the sphere
        speedMul: 0.75 + Math.random() * 0.5, // each orbit also runs at its own pace
        offsetX: 0,
        offsetY: 0,
        opening: false,
        hovered: false
      };

      return tileData;
    }

    var orbitTilesLoop1 = ORBIT_IMAGES.map(function (src, i) {
      var inclFrac = ORBIT_COUNT > 1 ? (i / (ORBIT_COUNT - 1)) * 2 - 1 : 0;
      return makeOrbitTile(src, i + 1, (Math.PI * 2 / ORBIT_COUNT) * i, inclFrac * ORBIT_MAX_INCL);
    });

    // Loop 2: same sphere, every tile's orbital plane starts at the inverse
    // heading (node + PI) and mirrored tilt of loop 1, and keeps numbering on.
    var orbitTilesLoop2 = ORBIT_IMAGES_2.map(function (src, i) {
      var inclFrac2 = ORBIT_COUNT_2 > 1 ? (i / (ORBIT_COUNT_2 - 1)) * 2 - 1 : 0;
      return makeOrbitTile(
        src,
        ORBIT_COUNT + i + 1,
        (Math.PI * 2 / ORBIT_COUNT_2) * i + Math.PI,
        -(inclFrac2 * ORBIT_MAX_INCL)
      );
    });

    var orbitTiles = orbitTilesLoop1.concat(orbitTilesLoop2);

    var orbitPointer = { x: -9999, y: -9999 };
    orbitStage.addEventListener("pointermove", function (e) {
      var rect = orbitStage.getBoundingClientRect();
      orbitPointer.x = e.clientX - rect.left;
      orbitPointer.y = e.clientY - rect.top;
    });
    orbitStage.addEventListener("pointerleave", function () {
      orbitPointer.x = -9999;
      orbitPointer.y = -9999;
    });

    var orbitFrame = function () {
      var w = orbitStage.clientWidth;
      var h = orbitStage.clientHeight;

      if (w && h) {
        var cx = w / 2;
        var cy = h / 2;
        var minDim = Math.min(w, h);
        var sphereR = ORBIT_RADIUS_FRAC * minDim;
        var camDist = sphereR * 3.2;
        var tileW = ORBIT_TILE_W;
        var tileH = ORBIT_TILE_H;

        orbitTiles.forEach(function (t) {
          if (t.hovered) { return; } // pause the tile's orbit entirely while the pointer is over it, so it can't drift away mid-click

          t.angle += ORBIT_SPEED * t.speedMul;

          // point moving around this tile's own orbital circle (still in the equatorial plane)
          var x0 = sphereR * Math.cos(t.angle);
          var z0 = sphereR * Math.sin(t.angle);

          // tilt that circle by the tile's own inclination — this is what makes it
          // sweep through many latitudes over one lap instead of sliding along one
          var y1 = -z0 * Math.sin(t.incl);
          var z1 = z0 * Math.cos(t.incl);
          var x1 = x0;

          // rotate the tilted plane around the vertical axis to its own heading,
          // so different tiles' orbits don't all cross the same two points
          var x3 = x1 * Math.cos(t.node) + z1 * Math.sin(t.node);
          var z3 = -x1 * Math.sin(t.node) + z1 * Math.cos(t.node);
          var y3 = y1;

          var y3t = y3 * Math.cos(ORBIT_TILT_RAD) - z3 * Math.sin(ORBIT_TILT_RAD);
          var z3t = y3 * Math.sin(ORBIT_TILT_RAD) + z3 * Math.cos(ORBIT_TILT_RAD);

          var persp = camDist / (camDist - z3t);

          t.depth = z3t;
          t.screenX = cx + x3 * persp;
          t.screenY = cy + y3t * persp;
          t.scale = persp;
        });

        var order = orbitTiles.map(function (_, i) { return i; });
        order.sort(function (a, b) { return orbitTiles[a].depth - orbitTiles[b].depth; });

        order.forEach(function (idx) {
          var t = orbitTiles[idx];
          if (t.opening) { return; } // mid-click zoom animation is driving this tile's styles now

          var bx = t.screenX;
          var by = t.screenY;

          var targetX = 0, targetY = 0;
          if (t.hovered) {
            // The pointer is actually over this tile right now — hold still so a
            // real click has a stable target instead of the tile fleeing from under it.
            targetX = t.offsetX;
            targetY = t.offsetY;
          } else {
            // Measure "lean away" from the tile's current on-screen position (not its
            // bare orbit position), so the push is self-limiting and settles near the
            // pointer instead of jumping to a fixed offset the moment the pointer arrives.
            var curX = bx + t.offsetX;
            var curY = by + t.offsetY;
            var mdx = curX - orbitPointer.x;
            var mdy = curY - orbitPointer.y;
            var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < ORBIT_STEER_RADIUS && mdist > 0.001) {
              var push = (1 - mdist / ORBIT_STEER_RADIUS) * ORBIT_STEER_STRENGTH;
              targetX = (mdx / mdist) * push;
              targetY = (mdy / mdist) * push;
            }
          }
          t.offsetX += (targetX - t.offsetX) * 0.12;
          t.offsetY += (targetY - t.offsetY) * 0.12;

          var scaledW = tileW * t.scale;
          var scaledH = tileH * t.scale;
          var x = bx + t.offsetX - scaledW / 2;
          var y = by + t.offsetY - scaledH / 2;
          var tilt = Math.max(-14, Math.min(14, t.offsetX * 0.35));

          t.el.style.width = scaledW + "px";
          t.el.style.height = scaledH + "px";
          t.el.style.zIndex = String(1000 + Math.round(t.depth));
          t.el.style.transform = "translate(" + x + "px," + y + "px) rotate(" + tilt + "deg)";
        });
      }

      requestAnimationFrame(orbitFrame);
    };

    requestAnimationFrame(orbitFrame);
  }
})();
