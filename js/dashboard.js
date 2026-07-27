/* ==========================================================================
   dashboard.js — vanilla JS (no jQuery) for the dashboard layout
   - Toggle sidebar: >=992px collapse (small-left-menu), <992px slide drawer
   - Submenu accordion (.has-sub)
   - Tooltip label on hover while collapsed
   - Dropdown, tabs, modal, navbar toggler, dismiss alert
   ========================================================================== */
(function () {
  "use strict";

  var MOBILE_BP = 992;
  var isMobile = function () { return window.innerWidth < MOBILE_BP; };

  var leftMenu   = document.getElementById("left-menu");
  var logo       = document.getElementById("logo");
  var pageCont   = document.getElementById("page-container");
  var headerLeft = document.querySelector("#header .header-left");
  var toggleBtn  = document.getElementById("toggle-left-menu");
  var overlay    = document.getElementById("sidebar-overlay");
  var showLabel  = document.getElementById("show-lable");

  /* ---- Toggle sidebar ------------------------------------------------ */
  function toggleSidebar() {
    if (isMobile()) {
      leftMenu.classList.toggle("open");
      if (overlay) overlay.classList.toggle("open");
    } else {
      switchSidebar(function () {
        [leftMenu, logo, pageCont, headerLeft].forEach(function (el) {
          if (el) el.classList.toggle("small-left-menu");
        });
      });
    }
  }
  if (toggleBtn) toggleBtn.addEventListener("click", toggleSidebar);
  if (overlay) overlay.addEventListener("click", function () {
    leftMenu.classList.remove("open");
    overlay.classList.remove("open");
  });

  /* ---- Submenu: accordion (expanded) / hover flyout (collapsed) ------ */
  // Are we in the collapsed sidebar state on desktop?
  function isCollapsed() {
    return leftMenu && leftMenu.classList.contains("small-left-menu") && !isMobile();
  }

  // Close one submenu — flyout (collapsed) fades via CSS, accordion animates height
  function closeSub(li) {
    var sub = li.querySelector("ul");
    li.classList.remove("rotate");
    if (!sub) return;
    sub.classList.remove("open");
    if (isCollapsed()) {
      sub.style.height = "";   // flyout: let CSS handle opacity/transform
    } else {
      sub.style.height = "0px";
      sub.style.top = "";
    }
  }

  function closeAllSubs() {
    if (!leftMenu) return;
    leftMenu.querySelectorAll("li.has-sub").forEach(closeSub);
  }

  // Change sidebar state without running submenu transitions (avoids a leftover
  // ghost image when collapsing/expanding while a submenu is open). Disable
  // anim -> apply class changes -> close submenus -> force reflow -> re-enable
  // anim on the next frame.
  function switchSidebar(applyClassChanges) {
    leftMenu.classList.add("no-anim");
    applyClassChanges();
    closeAllSubs();
    if (showLabel) { showLabel.style.opacity = "0"; showLabel.style.visibility = "hidden"; }
    void leftMenu.offsetHeight;
    requestAnimationFrame(function () { leftMenu.classList.remove("no-anim"); });
  }

  function openSub(li) {
    var sub = li.querySelector("ul");
    if (!sub) return;
    li.classList.add("rotate");
    if (isCollapsed()) {
      // Flyout: position instantly (no transition), reveal via fade + slide
      sub.style.height = "";
      var rect = li.getBoundingClientRect();
      var top = Math.min(rect.top, window.innerHeight - sub.scrollHeight - 8);
      sub.style.top = Math.max(top, 8) + "px";
      sub.classList.add("open");
    } else {
      // Accordion: animate height
      sub.style.top = "";
      sub.classList.add("open");
      sub.style.height = sub.scrollHeight + "px";
    }
  }

  // Click = accordion (only when expanded; collapsed uses hover)
  if (leftMenu) leftMenu.querySelectorAll("li.has-sub > a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (isCollapsed()) return;
      var li = link.parentElement;
      var willOpen = !li.querySelector("ul").classList.contains("open");
      closeAllSubs();
      if (willOpen) openSub(li);
    });
  });

  // Hover flyout while collapsed
  if (leftMenu) leftMenu.querySelectorAll("li.has-sub").forEach(function (li) {
    li.addEventListener("mouseenter", function () {
      if (!isCollapsed()) return;
      if (showLabel) { showLabel.style.opacity = "0"; showLabel.style.visibility = "hidden"; }
      closeAllSubs();
      openSub(li);
    });
    li.addEventListener("mouseleave", function () {
      if (isCollapsed()) closeSub(li);
    });
  });

  /* ---- Tooltip label while collapsed (items WITHOUT a submenu) ------- */
  if (showLabel && leftMenu) {
    leftMenu.querySelectorAll(":scope > ul > li > a").forEach(function (a) {
      a.addEventListener("mouseenter", function () {
        if (!isCollapsed()) return;
        var li = a.parentElement;
        if (li.classList.contains("has-sub")) return;
        var span = a.querySelector("span");
        if (!span) return;
        var rect = a.getBoundingClientRect();
        showLabel.textContent = span.textContent;
        showLabel.style.top = rect.top + "px";
        showLabel.style.left = rect.right + 10 + "px";
        showLabel.style.opacity = "1";
        showLabel.style.visibility = "visible";
      });
      a.addEventListener("mouseleave", function () {
        showLabel.style.opacity = "0";
        showLabel.style.visibility = "hidden";
      });
    });
  }

  /* ---- Adjust automatically on resize -------------------------------- */
  function onResize() {
    if (!leftMenu) return;
    switchSidebar(function () {
      if (isMobile()) {
        [leftMenu, logo, pageCont, headerLeft].forEach(function (el) {
          if (el) el.classList.remove("small-left-menu");
        });
      } else {
        leftMenu.classList.remove("open");
        if (overlay) overlay.classList.remove("open");
      }
    });
  }
  window.addEventListener("resize", onResize);
  onResize();

  /* ---- Dropdown ------------------------------------------------------ */
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-toggle='dropdown']");
    document.querySelectorAll(".dropdown.open").forEach(function (d) {
      if (!trigger || d !== trigger.closest(".dropdown")) d.classList.remove("open");
    });
    if (trigger) {
      e.preventDefault();
      trigger.closest(".dropdown").classList.toggle("open");
    }
  });

  /* ---- Tabs ---------------------------------------------------------- */
  document.querySelectorAll(".tabs a").forEach(function (tab) {
    tab.addEventListener("click", function (e) {
      var target = tab.getAttribute("href");
      if (!target || target.charAt(0) !== "#") return;
      e.preventDefault();
      var wrap = tab.closest(".tabs");
      wrap.querySelectorAll("a").forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      var content = wrap.nextElementSibling;
      if (content && content.classList.contains("tab-content")) {
        content.querySelectorAll(".tab-pane").forEach(function (p) { p.classList.remove("active"); });
        var pane = content.querySelector(target);
        if (pane) pane.classList.add("active");
      }
    });
  });

  /* ---- Navbar toggler ------------------------------------------------ */
  document.querySelectorAll(".navbar-toggler").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var nav = btn.closest(".navbar").querySelector(".navbar-nav");
      if (nav) nav.classList.toggle("open");
    });
  });

  /* ---- Modal --------------------------------------------------------- */
  document.querySelectorAll("[data-modal-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var m = document.querySelector(btn.getAttribute("data-modal-target"));
      if (m) { m.classList.add("open"); document.body.classList.add("modal-open"); }
    });
  });
  document.querySelectorAll(".modal-backdrop").forEach(function (bd) {
    bd.addEventListener("click", function (e) {
      if (e.target === bd || e.target.closest("[data-modal-close]")) {
        bd.classList.remove("open");
        document.body.classList.remove("modal-open");
      }
    });
  });

  /* ---- Dismiss alert ------------------------------------------------- */
  document.querySelectorAll(".alert .close").forEach(function (x) {
    x.addEventListener("click", function () {
      var a = x.closest(".alert");
      if (a) a.remove();
    });
  });
})();
