/* ==========================================================================
   dashboard.js — JS vanilla (không cần jQuery) cho bố cục dashboard
   - Toggle sidebar: ≥992px thu gọn (small-left-menu), <992px mở drawer
   - Submenu accordion (.has-sub)
   - Tooltip nhãn khi hover lúc thu gọn
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
      [leftMenu, logo, pageCont, headerLeft].forEach(function (el) {
        if (el) el.classList.toggle("small-left-menu");
      });
    }
  }
  if (toggleBtn) toggleBtn.addEventListener("click", toggleSidebar);
  if (overlay) overlay.addEventListener("click", function () {
    leftMenu.classList.remove("open");
    overlay.classList.remove("open");
  });

  /* ---- Submenu accordion --------------------------------------------- */
  var subLinks = document.querySelectorAll("#left-menu li.has-sub > a");
  subLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var li = link.parentElement;
      var sub = li.querySelector("ul");
      var willOpen = !sub.classList.contains("open");

      // Đóng các submenu khác
      leftMenu.querySelectorAll("li.has-sub").forEach(function (other) {
        if (other !== li) {
          other.classList.remove("rotate");
          var s = other.querySelector("ul");
          if (s) { s.classList.remove("open"); s.style.height = "0px"; }
        }
      });

      if (willOpen) {
        sub.classList.add("open");
        li.classList.add("rotate");
        sub.style.height = sub.scrollHeight + "px";
      } else {
        sub.classList.remove("open");
        li.classList.remove("rotate");
        sub.style.height = "0px";
      }
    });
  });

  /* ---- Tooltip nhãn khi thu gọn (desktop) ---------------------------- */
  if (showLabel && leftMenu) {
    leftMenu.querySelectorAll("> ul > li > a").forEach(function (a) {
      a.addEventListener("mouseenter", function () {
        if (!leftMenu.classList.contains("small-left-menu") || isMobile()) return;
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

  /* ---- Tự điều chỉnh khi resize -------------------------------------- */
  function onResize() {
    if (!leftMenu) return;
    if (isMobile()) {
      leftMenu.classList.remove("small-left-menu");
      if (logo) logo.classList.remove("small-left-menu");
      if (pageCont) pageCont.classList.remove("small-left-menu");
      if (headerLeft) headerLeft.classList.remove("small-left-menu");
    } else {
      leftMenu.classList.remove("open");
      if (overlay) overlay.classList.remove("open");
    }
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
