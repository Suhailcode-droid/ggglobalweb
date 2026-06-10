import { useState, useEffect, useRef } from "react";

// ── Fonts & Global Styles ────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Reset Vite / CRA default root constraints that cause side gaps ── */
    #root, #app, [data-reactroot] {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      text-align: left !important;
    }

    :root {
      --gold: #C9A84C;
      --gold-light: #E8C96A;
      --gold-pale: #F7EDD5;
      --ink: #0D0D0D;
      --ink-muted: #2E2E2E;   /* was #3A3A3A — richer contrast on cream */
      --ink-faint: #5C5C5C;   /* was #7A7A7A — lifts to AA on all bg colours */
      --cream: #FAF8F3;
      --cream-dark: #F0EBE0;
      --white: #FFFFFF;
      --nav-h: 72px;
    }

    html, body {
      width: 100%;
      max-width: 100%;
      min-height: 100vh;
      margin: 0 !important;
      padding: 0 !important;
      scroll-behavior: smooth;
    }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--cream);
      color: var(--ink);
      overflow-x: hidden;
    }

    /* Make sure every top-level wrapper is also full-width */
    nav, main, footer, section, .hero, .stats-bar, .jobs-bg,
    .services-bg, .testimonials-bg, .page-hero {
      width: 100%;
      max-width: 100%;
    }

    /* ── Typography colour guarantees — nothing can ever appear invisible ── */
    h1, h2, h3, h4, h5 {
      font-family: 'Playfair Display', serif;
      color: var(--ink); /* default for all headings on light bg */
    }
    /* Headings inside dark backgrounds get white automatically */
    .services-bg h2, .services-bg h3,
    .stats-bar h2, .stats-bar h3,
    .page-hero h1, .page-hero h2,
    footer h1, footer h2, footer h3,
    .hero h1 {
      color: #ffffff;
    }

    ::selection { background: var(--gold-pale); }

    .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }

    /* Scroll reveal — smoother easing curve */
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1); }
    .reveal.visible { opacity: 1; transform: none; }
    .reveal-left { opacity: 0; transform: translateX(-28px); transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1); }
    .reveal-left.visible { opacity: 1; transform: none; }
    .reveal-right { opacity: 0; transform: translateX(28px); transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1); }
    .reveal-right.visible { opacity: 1; transform: none; }

    /* Gold rule */
    .gold-rule { width: 56px; height: 2px; background: var(--gold); display: block; margin: 0 auto 1.5rem; }
    .gold-rule-left { margin: 0 0 1.5rem; }

    /* Pill badge */
    .pill {
      display: inline-block;
      padding: 5px 18px;
      border: 1px solid var(--gold);
      border-radius: 999px;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 1.25rem;
    }

    /* Buttons */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 36px;
      background: var(--gold);
      color: var(--ink);
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-decoration: none;
      border: none;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: background 0.25s, transform 0.18s, box-shadow 0.25s;
    }
    .btn-primary::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.28) 50%, transparent 60%);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }
    .btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,168,76,0.35); }
    .btn-primary:hover::after { transform: translateX(100%); }

    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 13px 35px;
      border: 1.5px solid var(--gold);
      color: var(--gold);
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-decoration: none;
      background: transparent;
      cursor: pointer;
      transition: background 0.25s, color 0.25s, transform 0.18s;
    }
    .btn-ghost:hover { background: var(--gold); color: var(--ink); transform: translateY(-2px); }

    /* Section */
    section { padding: 100px 0; }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 40px;
    }

    /* Nav */
    nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      width: 100%;
      z-index: 1000;
      height: var(--nav-h);
      display: flex;
      align-items: center;
      transition: background 0.35s, backdrop-filter 0.35s, box-shadow 0.35s;
    }
    /* Transparent nav sitting over a dark hero — make text readable */
    nav:not(.scrolled) .nav-logo { color: #fff; }
    nav:not(.scrolled) .nav-links a { color: rgba(255,255,255,0.82); }
    nav:not(.scrolled) .hamburger span { background: #fff; }
    nav.scrolled {
      background: rgba(250,248,243,0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 1px 0 rgba(0,0,0,0.08);
    }
    /* Once scrolled, restore ink colours */
    nav.scrolled .nav-logo { color: var(--ink); }
    nav.scrolled .nav-links a { color: var(--ink-muted); }

    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 40px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-logo {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--ink);
      text-decoration: none;
      letter-spacing: -0.01em;
    }
    .nav-logo span { color: var(--gold); }

    .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; }
    .nav-links a {
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--ink-muted);
      text-decoration: none;
      transition: color 0.2s;
    }
    .nav-links a:hover { color: var(--gold); }

    .nav-cta {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink) !important;
      background: var(--gold);
      padding: 9px 22px;
      text-decoration: none;
      transition: background 0.2s !important;
    }
    .nav-cta:hover { background: var(--gold-light) !important; color: var(--ink) !important; }

    /* Mobile menu */
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 4px;
    }
    .hamburger span {
      display: block;
      width: 24px;
      height: 1.5px;
      background: var(--ink);
      transition: transform 0.3s, opacity 0.3s;
    }
    .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

    .mobile-menu {
      position: fixed;
      inset: 0;
      top: var(--nav-h);
      background: var(--cream);
      z-index: 999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 40px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    .mobile-menu.open { opacity: 1; pointer-events: all; }
    .mobile-menu a {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 700;
      color: var(--ink);
      text-decoration: none;
      transition: color 0.2s;
    }
    .mobile-menu a:hover { color: var(--gold); }

    /* Hero */
    .hero {
      position: relative;
      height: 100vh;
      min-height: 700px;
      display: flex;
      align-items: center;
      overflow: hidden;
    }
    .hero-video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(105deg, rgba(13,13,13,0.72) 0%, rgba(13,13,13,0.38) 100%);
      z-index: 1;
    }
    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 40px;
      padding-top: var(--nav-h);
    }
    .hero-eyebrow {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 1.5rem;
    }
    .hero h1 {
      font-size: clamp(48px, 7vw, 88px);
      font-weight: 900;
      color: #fff;
      line-height: 1.02;
      letter-spacing: -0.02em;
      max-width: 750px;
      margin-bottom: 1.75rem;
    }
    .hero h1 em { font-style: normal; color: var(--gold); }
    .hero-sub {
      font-size: 18px;
      font-weight: 300;
      color: rgba(255,255,255,0.88); /* was 0.78 */
      max-width: 520px;
      line-height: 1.7;
      margin-bottom: 2.5rem;
    }
    .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }

    .hero-scroll {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: rgba(255,255,255,0.6); /* lifted from 0.5 for readability */
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      pointer-events: none; /* won't accidentally block clicks */
    }
    @media (max-height: 680px) { .hero-scroll { display: none; } }
    .scroll-line {
      width: 1px;
      height: 48px;
      background: rgba(255,255,255,0.25);
      position: relative;
      overflow: hidden;
    }
    .scroll-line::after {
      content: '';
      position: absolute;
      top: -100%;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--gold);
      animation: scrollDown 1.8s ease-in-out infinite;
    }
    @keyframes scrollDown {
      0%   { top: -100%; }
      100% { top: 100%; }
    }

    /* Stats bar */
    .stats-bar {
      background: var(--ink);
      padding: 0;
    }
    .stats-bar-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 40px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border-left: 1px solid rgba(255,255,255,0.08);
    }
    .stat-item {
      padding: 40px 40px;
      border-right: 1px solid rgba(255,255,255,0.08);
      text-align: center;
    }
    .stat-number {
      font-family: 'Playfair Display', serif;
      font-size: 44px;
      font-weight: 700;
      color: var(--gold);
      line-height: 1;
      display: block;
    }
    .stat-label {
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.7); /* was 0.5 */
      margin-top: 8px;
      display: block;
    }

    /* About section */
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }
    .about-img-wrap {
      position: relative;
      margin-bottom: 48px; /* prevents badge from overlapping content below */
    }
    .about-img-wrap img {
      width: 100%;
      height: 520px;
      object-fit: cover;
      display: block;
    }
    .about-img-badge {
      position: absolute;
      bottom: -24px;
      right: -24px;
      background: var(--gold);
      padding: 28px 32px;
      min-width: 180px;
      text-align: center;
    }
    .about-img-badge strong {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 700;
      color: var(--ink);
      display: block;
    }
    .about-img-badge span {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink-muted);
    }
    .about-text h2 {
      font-size: clamp(32px, 4vw, 48px);
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.02em;
      color: var(--ink);           /* explicit — never inherits a faint colour */
      margin-bottom: 1.25rem;
    }
    .about-text p {
      font-size: 16px;
      font-weight: 300;
      line-height: 1.8;
      color: var(--ink-muted);
      margin-bottom: 1.25rem;
    }
    .about-checks { list-style: none; margin: 1.5rem 0 2rem; }
    .about-checks li {
      font-size: 15px;
      font-weight: 400;
      color: var(--ink-muted);
      padding: 8px 0;
      padding-left: 28px;
      position: relative;
      border-bottom: 1px solid var(--cream-dark);
    }
    .about-checks li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 1px;
      background: var(--gold);
    }

    /* Services */
    .services-bg { background: var(--ink); }
    .services-header { text-align: center; margin-bottom: 64px; }
    .services-header h2 { color: #fff; font-size: clamp(32px, 4vw, 52px); font-weight: 700; }
    .services-header p { color: rgba(255,255,255,0.72); font-size: 16px; font-weight: 300; max-width: 540px; margin: 1rem auto 0; line-height: 1.7; }

    .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
    .service-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      padding: 48px 36px;
      transition: background 0.3s, border-color 0.3s;
      cursor: default;
      position: relative;
      overflow: hidden;
    }
    .service-card::before {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      width: 0; height: 2px;
      background: var(--gold);
      transition: width 0.4s ease;
    }
    .service-card:hover::before { width: 100%; }
    .service-card:hover { background: rgba(201,168,76,0.05); border-color: rgba(201,168,76,0.2); }
    .service-icon {
      width: 52px;
      height: 52px;
      border: 1px solid rgba(201,168,76,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 28px;
    }
    .service-icon svg { width: 24px; height: 24px; stroke: var(--gold); fill: none; stroke-width: 1.5; }
    .service-card h3 {
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 12px;
    }
    .service-card p {
      font-size: 14px;
      font-weight: 300;
      line-height: 1.8;
      color: rgba(255,255,255,0.72); /* was 0.5 — hard to read on dark bg */
      margin-bottom: 24px;
    }
    .service-tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .service-tag {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.06em;
      padding: 4px 12px;
      border: 1px solid rgba(201,168,76,0.25);
      color: rgba(201,168,76,0.8);
    }

    /* Process */
    .process-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
      border: 1px solid var(--cream-dark);
    }
    .process-step {
      padding: 48px 32px;
      border-right: 1px solid var(--cream-dark);
      position: relative;
    }
    .process-step:last-child { border-right: none; }
    .step-number {
      font-family: 'Playfair Display', serif;
      font-size: 64px;
      font-weight: 900;
      color: var(--cream-dark);
      line-height: 1;
      margin-bottom: 20px;
      display: block;
    }
    .process-step h3 { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
    .process-step p { font-size: 14px; line-height: 1.75; color: var(--ink-faint); font-weight: 300; }
    .process-header { text-align: center; margin-bottom: 64px; }
    .process-header h2 { font-size: clamp(32px, 4vw, 48px); font-weight: 700; }

    /* Testimonials */
    .testimonials-bg { background: var(--cream-dark); }
    .testimonials-header { text-align: center; margin-bottom: 56px; }
    .testimonials-header h2 { font-size: clamp(32px, 4vw, 48px); font-weight: 700; }
    .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .testimonial-card {
      background: var(--white);
      padding: 36px;
      border-top: 2px solid var(--gold);
    }
    .testimonial-stars { color: var(--gold); font-size: 18px; margin-bottom: 16px; }
    .testimonial-text {
      font-size: 15px;
      font-weight: 300;
      line-height: 1.8;
      color: var(--ink-muted);
      margin-bottom: 24px;
      font-style: italic;
    }
    .testimonial-author { display: flex; align-items: center; gap: 12px; }
    .testimonial-avatar {
      width: 44px; height: 44px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }
    .testimonial-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .testimonial-name { font-size: 14px; font-weight: 600; }
    .testimonial-role { font-size: 12px; color: var(--ink-faint); margin-top: 2px; }

    /* Gallery */
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-auto-rows: 220px;
      gap: 8px;
    }
    .gallery-cell { overflow: hidden; }
    .gallery-cell.tall { grid-row: span 2; }
    .gallery-cell img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
      display: block;
    }
    .gallery-cell:hover img { transform: scale(1.06); }

    /* Clients */
    .clients-header { text-align: center; margin-bottom: 48px; }
    .clients-header h2 { font-size: clamp(28px, 3vw, 40px); font-weight: 700; }
    .clients-marquee-wrap { overflow: hidden; position: relative; }
    .clients-marquee-wrap::before,
    .clients-marquee-wrap::after {
      content: '';
      position: absolute;
      top: 0; bottom: 0;
      width: 120px;
      z-index: 2;
      pointer-events: none;
    }
    .clients-marquee-wrap::before { left: 0; background: linear-gradient(to right, var(--cream), transparent); }
    .clients-marquee-wrap::after { right: 0; background: linear-gradient(to left, var(--cream), transparent); }
    .clients-marquee { display: flex; gap: 48px; animation: marquee 22s linear infinite; width: max-content; }
    @keyframes marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .client-logo {
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
      background: var(--white);
      border: 1px solid var(--cream-dark);
      flex-shrink: 0;
    }
    .client-logo img { height: 32px; object-fit: contain; opacity: 0.6; filter: grayscale(1); transition: opacity 0.2s, filter 0.2s; }
    .client-logo:hover img { opacity: 1; filter: none; }
    .client-logo-text {
      font-family: 'Playfair Display', serif;
      font-size: 14px;
      font-weight: 700;
      color: var(--ink-faint);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
      transition: color 0.2s;
    }
    .client-logo:hover .client-logo-text { color: var(--gold); }

    /* Jobs CTA */
    .jobs-bg { background: var(--gold); }
    .jobs-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 80px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 40px;
      flex-wrap: wrap;
    }
    .jobs-text h2 { font-size: clamp(28px, 3.5vw, 44px); font-weight: 700; color: var(--ink); }
    .jobs-text p { font-size: 16px; font-weight: 300; color: var(--ink-muted); margin-top: 8px; }
    .btn-dark {
      display: inline-block;
      padding: 14px 36px;
      background: var(--ink);
      color: var(--white);
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
      white-space: nowrap;
    }
    .btn-dark:hover { background: #222; transform: translateY(-1px); }

    /* Contact */
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
    .contact-info h2 { font-size: clamp(32px, 4vw, 48px); font-weight: 700; margin-bottom: 1.25rem; }
    .contact-info p { font-size: 16px; font-weight: 300; line-height: 1.8; color: var(--ink-muted); margin-bottom: 2rem; }
    .contact-details { list-style: none; }
    .contact-details li {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 0;
      border-bottom: 1px solid var(--cream-dark);
      font-size: 15px;
      color: var(--ink-muted);
    }
    .contact-details li:last-child { border-bottom: none; }
    .contact-details svg { width: 18px; height: 18px; stroke: var(--gold); flex-shrink: 0; stroke-width: 1.5; fill: none; }
    .contact-socials { display: flex; gap: 12px; margin-top: 28px; }
    .social-btn {
      width: 40px; height: 40px;
      border: 1px solid var(--cream-dark);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      text-decoration: none;
      background: none;
    }
    .social-btn svg { width: 16px; height: 16px; stroke: var(--ink-faint); fill: none; stroke-width: 1.5; }
    .social-btn:hover { border-color: var(--gold); background: var(--gold-pale); }
    .social-btn:hover svg { stroke: var(--gold); }

    /* Form */
    .contact-form { display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint); }
    .form-group input,
    .form-group textarea,
    .form-group select {
      background: var(--cream-dark);
      border: 1px solid transparent;
      padding: 12px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: var(--ink);
      outline: none;
      transition: border-color 0.2s;
      resize: none;
      width: 100%; /* prevents inputs from overflowing their column */
    }
    .form-group input::placeholder,
    .form-group textarea::placeholder { color: var(--ink-faint); opacity: 1; }
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      border-color: var(--gold);
    }
    .form-group textarea { min-height: 120px; }
    .form-field-error {
      display: block; /* ensures it sits below the input, never inline */
      font-size: 12px;
      color: #c0392b;
      margin-top: 2px;
    }
    .form-success {
      padding: 16px;
      background: #edfbf3;
      border-left: 3px solid #2ecc71;
      font-size: 14px;
      color: #1a7a3d;
    }
    .form-error {
      padding: 16px;
      background: #fdf0f0;
      border-left: 3px solid #e74c3c;
      font-size: 14px;
      color: #8b0000;
    }

    /* Footer */
    footer { background: var(--ink); padding: 64px 0 32px; }
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 40px;
    }
    .footer-top {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 48px;
      padding-bottom: 48px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .footer-brand p {
      font-size: 14px;
      font-weight: 300;
      line-height: 1.75;
      color: rgba(255,255,255,0.6); /* was 0.4 — too faint to read */
      max-width: 280px;
      margin-top: 16px;
    }
    .footer-logo {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      text-decoration: none;
    }
    .footer-logo span { color: var(--gold); }
    .footer-col h4 {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 16px;
    }
    .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
    .footer-col ul a {
      font-size: 14px;
      font-weight: 300;
      color: rgba(255,255,255,0.65); /* was 0.45 */
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-col ul a:hover { color: var(--gold); }
    .footer-bottom {
      padding-top: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .footer-bottom p {
      font-size: 12px;
      color: rgba(255,255,255,0.45); /* was 0.25 — nearly invisible */
    }

    /* Page Hero ─────────────────────────────────────────── */
    .page-hero {
      width: 100vw;
      padding-top: calc(var(--nav-h) + 100px);
      padding-bottom: 100px;
      background: var(--ink);
      text-align: center;
      position: relative;
      z-index: 0;
      overflow: hidden;
    }
    /* Subtle radial glow so the hero doesn't feel flat */
    .page-hero::before {
      content: '';
      position: absolute;
      top: 0; left: 50%; transform: translateX(-50%);
      width: 800px; height: 400px;
      background: radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .page-hero .container { position: relative; }

    /* Title: smaller base so a two-line heading never overflows */
    .page-hero h1 {
      font-size: clamp(32px, 4.5vw, 56px);
      font-weight: 900;
      color: #fff;
      line-height: 1.12;
      letter-spacing: -0.02em;
      max-width: 760px;
      margin: 0 auto;
      /* Staggered fade-up animation */
      animation: heroFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both;
    }
    /* Gold highlight word inside page-hero titles */
    .page-hero h1 em { font-style: normal; color: var(--gold); }
    .page-hero p {
      font-size: 17px;
      font-weight: 300;
      color: rgba(255,255,255,0.78);
      margin: 20px auto 0;
      max-width: 520px;
      line-height: 1.75;
      animation: heroFadeUp 0.8s 0.15s cubic-bezier(0.22,1,0.36,1) both;
    }
    .page-hero .pill {
      animation: heroFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    }
    @keyframes heroFadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Privacy */
    .privacy-content {
      max-width: 720px;
      margin: 0 auto;
    }
    .privacy-content h3 { font-size: 22px; font-weight: 700; margin: 2.5rem 0 0.75rem; }
    .privacy-content p { font-size: 15px; line-height: 1.8; color: var(--ink-muted); font-weight: 300; margin-bottom: 1rem; }

    /* Responsive */
    @media (max-width: 1024px) {
      .stats-bar-inner { grid-template-columns: repeat(2, 1fr); }
      .services-grid { grid-template-columns: 1fr 1fr; }
      .process-grid { grid-template-columns: 1fr 1fr; }
      .process-step:nth-child(2) { border-right: none; }
      .process-step:nth-child(1), .process-step:nth-child(2) { border-bottom: 1px solid var(--cream-dark); }
      .footer-top { grid-template-columns: 1fr 1fr; }
      .about-grid { grid-template-columns: 1fr; gap: 60px; }
      .about-img-wrap img { height: 380px; }
      .contact-grid { grid-template-columns: 1fr; }
      .gallery-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      section { padding: 72px 0; }
      .container { padding: 0 24px; }
      .nav-inner { padding: 0 24px; }
      .nav-links { display: none; }
      .hamburger { display: flex; }
      .hero-content { padding: 0 24px; padding-top: var(--nav-h); }
      .services-grid { grid-template-columns: 1fr; }
      .testimonials-grid { grid-template-columns: 1fr; }
      .process-grid { grid-template-columns: 1fr; }
      .process-step { border-right: none !important; border-bottom: 1px solid var(--cream-dark); }
      .process-step:last-child { border-bottom: none; }
      .footer-top { grid-template-columns: 1fr; gap: 32px; }
      .stats-bar-inner { grid-template-columns: repeat(2, 1fr); }
      .form-row { grid-template-columns: 1fr; }
      .jobs-inner { flex-direction: column; }
      .gallery-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 160px; }
      .footer-inner { padding: 0 24px; }
      .jobs-inner { padding: 60px 24px; }
      .about-img-badge { right: 0; bottom: -20px; }
    }
    @media (max-width: 480px) {
      .hero h1 { font-size: 40px; }
      .stat-number { font-size: 34px; }
      .gallery-grid { grid-template-columns: 1fr; }
    }
  `}</style>
);

// ── Scroll Reveal Hook ────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    // Mark anything already in view as visible immediately (fixes stuck-invisible on first load)
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add("visible");
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 0px 0px" }
    );
    els.forEach((el) => { if (!el.classList.contains("visible")) observer.observe(el); });
    return () => observer.disconnect();
  });
}

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const duration = 1600;
        const startTime = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(ease * target));
          if (progress < 1) requestAnimationFrame(tick);
          else setCount(target);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref} className="stat-number">{count}{suffix}</span>;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  accounting: () => (
    <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 8h10M7 12h6M7 16h4"/></svg>
  ),
  marketing: () => (
    <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  ),
  webdev: () => (
    <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  ),
  compliance: () => (
    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  operations: () => (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 1 21 12a10 10 0 0 1-1.93 7.07M4.93 4.93A10 10 0 0 0 3 12a10 10 0 0 0 1.93 7.07"/></svg>
  ),
  strategy: () => (
    <svg viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  ),
  email: () => (
    <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  ),
  phone: () => (
    <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.36a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  globe: () => (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ),
  facebook: () => (
    <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  ),
  instagram: () => (
    <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
  ),
  twitter: () => (
    <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
  ),
  tiktok: () => (
    <svg viewBox="0 0 24 24"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
  ),
  arrowRight: () => (
    <svg viewBox="0 0 24 24" style={{width:16,height:16,stroke:"currentColor",fill:"none",strokeWidth:"2",verticalAlign:"middle",marginLeft:6}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  ),
};

// ── Navigation ────────────────────────────────────────────────────────────────
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Home", "About", "Services", "Contact", "Privacy"];

  const go = (p) => {
    setPage(p.toLowerCase());
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-inner">
          <a className="nav-logo" href="#" onClick={(e) => { e.preventDefault(); go("home"); }}>
            GG<span>Global</span>
          </a>
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l}>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); go(l); }}
                  className={l.toLowerCase() === "contact" ? "nav-cta" : ""}
                  style={l.toLowerCase() === page ? { color: "var(--gold)" } : {}}
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
      </nav>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {links.map((l) => (
          <a key={l} href="#" onClick={(e) => { e.preventDefault(); go(l); }}>{l}</a>
        ))}
      </div>
    </>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  const go = (p) => { setPage(p); window.scrollTo(0, 0); };
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="footer-logo" href="#" onClick={(e) => { e.preventDefault(); go("home"); }}>
              GG<span>Global</span>
            </a>
            <p>A domestic/global business management firm connecting skilled talent with companies across the world.</p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); go("home"); }}>Home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); go("about"); }}>About</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); go("services"); }}>Services</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); go("services"); }}>Accounting</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); go("services"); }}>Marketing</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); go("services"); }}>Web Development</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); go("services"); }}>Compliance</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:business@ggglobal.com">business@ggglobal.com</a></li>
              <li><a href="tel:+919818315577">+91-9818315577</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); go("privacy"); }}>Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 GG Global. All rights reserved.</p>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>Connecting Talent Worldwide</p>
        </div>
      </div>
    </footer>
  );
}

// ── EmailJS Config ────────────────────────────────────────────────────────────
// All contact form submissions are delivered to: guru@ggglobal.in
//
// SETUP INSTRUCTIONS (one-time, ~5 min):
//  1. Create a free account at https://www.emailjs.com/
//  2. Add an Email Service (Gmail / Outlook / SMTP) → copy the Service ID
//  3. Create an Email Template and set:
//       • "To Email" field  →  guru@ggglobal.in
//       • Use these variables anywhere in Subject / Body:
//           {{from_name}}    – sender's full name
//           {{from_email}}   – sender's email
//           {{reply_to}}     – same as from_email (for quick reply)
//           {{phone}}        – sender's phone number
//           {{enquiry_type}} – Employer / Job Seeker / Partner
//           {{message}}      – the message body
//           {{to_email}}     – will always be "guru@ggglobal.in"
//       • Suggested Subject: New Enquiry from {{from_name}} ({{enquiry_type}})
//  4. Copy your Public Key from Account → API Keys
//  5. Replace the three placeholder values below:
const EMAILJS_SERVICE_ID  = "service_kh058yk";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_q5dupxd";  // e.g. "template_xyz789"
const EMAILJS_PUBLIC_KEY  = "qpLnf4og2ov-auDud";    // e.g. "user_ABCDEFGH"
const RECIPIENT_EMAIL     = "guru@ggglobal.in";  // ← destination, do not change


// Lazy-loads the EmailJS SDK from CDN (no npm install needed)
function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) { resolve(window.emailjs); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); resolve(window.emailjs); };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ── Contact Form (shared) ─────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm]     = useState({ name: "", email: "", phone: "", type: "", message: "" });
  const [status, setStatus] = useState(null); // null | "success" | "error" | "config_error"
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Full name is required.";
    if (!form.email.trim())   e.email   = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.message.trim()) e.message = "Please write a message.";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    // Guard: remind developer to configure EmailJS IDs
    if (
      EMAILJS_SERVICE_ID  === "YOUR_SERVICE_ID"  ||
      EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID" ||
      EMAILJS_PUBLIC_KEY  === "YOUR_PUBLIC_KEY"
    ) {
      setStatus("config_error");
      return;
    }

    setLoading(true);
    try {
      const ejs = await loadEmailJS();
      await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email:     RECIPIENT_EMAIL,           // → guru@ggglobal.in
        to_name:      "GG Global",
        from_name:    form.name,
        from_email:   form.email,
        reply_to:     form.email,
        phone:        form.phone || "Not provided",
        enquiry_type: form.type  || "Not specified",
        message:      form.message,
      });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", type: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => {
      setForm({ ...form, [key]: e.target.value });
      if (errors[key]) setErrors({ ...errors, [key]: undefined });
    },
  });

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label>Full Name *</label>
          <input type="text" placeholder="Your full name" {...field("name")} />
          {errors.name    && <span className="form-field-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input type="email" placeholder="your@email.com" {...field("email")} />
          {errors.email   && <span className="form-field-error">{errors.email}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Phone</label>
          <input type="tel" placeholder="+91 XXXXX XXXXX" {...field("phone")} />
        </div>
        <div className="form-group">
          <label>I am a</label>
          <select {...field("type")}>
            <option value="">Select…</option>
            <option value="Employer / Client">Employer / Client</option>
            <option value="Job Seeker / Candidate">Job Seeker / Candidate</option>
            <option value="Partner / Ally">Partner / Ally</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Message *</label>
        <textarea placeholder="Tell us how we can help…" {...field("message")} />
        {errors.message && <span className="form-field-error">{errors.message}</span>}
      </div>

      {status === "success" && (
        <div className="form-success">✓ Message sent! We'll be in touch within 24 hours.</div>
      )}
      {status === "error" && (
        <div className="form-error">Something went wrong. Please try again or email us directly at business@ggglobal.com.</div>
      )}
      {status === "config_error" && (
        <div className="form-error" style={{ borderColor: "#e67e22", background: "#fef9f0", color: "#7d4e0c" }}>
          ⚙ EmailJS is not yet configured. Open the source file and replace the three <code>YOUR_*</code> placeholders at the top of the file with your real EmailJS credentials.
        </div>
      )}

      <button
        type="submit"
        className="btn-primary"
        style={{ width: "100%", textAlign: "center", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
        disabled={loading}
      >
        {loading ? "Sending…" : <>Send Message <Icons.arrowRight /></>}
      </button>
    </form>
  );
}

// ══ PAGES ════════════════════════════════════════════════════════════════════

// ── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  useScrollReveal();
  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ padding: 0 }}>
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="https://videos.pexels.com/video-files/3191422/3191422-uhd_4096_2160_25fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Global Talent Solutions</p>
          <h1>Connecting<br /><em>Talent</em><br />Worldwide</h1>
          <p className="hero-sub">GG Global bridges skilled professionals with companies across accounting, marketing, and web development — from startups to established enterprises.</p>
          <div className="hero-btns">
            <a href="#" className="btn-primary" onClick={(e) => { e.preventDefault(); setPage("contact"); window.scrollTo(0,0); }}>
              Hire Talent <Icons.arrowRight />
            </a>
            <a href="#" className="btn-ghost" onClick={(e) => { e.preventDefault(); setPage("about"); window.scrollTo(0,0); }}>
              Learn More
            </a>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          <div className="stat-item"><AnimatedCounter target={150} suffix="+" /><span className="stat-label">Professionals Placed</span></div>
          <div className="stat-item"><AnimatedCounter target={50} suffix="+" /><span className="stat-label">Countries Reached</span></div>
          <div className="stat-item"><AnimatedCounter target={100} suffix="%" /><span className="stat-label">Client Satisfaction</span></div>
          <div className="stat-item"><AnimatedCounter target={3} suffix="" /><span className="stat-label">Core Disciplines</span></div>
        </div>
      </div>

      {/* About Intro */}
      <section style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap reveal-left">
              <img src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=800&q=80" alt="GG Global team" />
              <div className="about-img-badge">
                <strong>150+</strong>
                <span>Cadets Deployed</span>
              </div>
            </div>
            <div className="about-text reveal-right">
              <span className="pill">Who We Are</span>
              <span className="gold-rule gold-rule-left" />
              <h2>A Single, Reliable Partner for Global Growth</h2>
              <p>GG Global is a domestic and global business management firm providing end-to-end solutions for companies across the world. We partner with startups, SMEs, and established enterprises to manage their finance, accounting, legal, compliance, technology, and operational functions.</p>
              <p>With a client-centric approach and a strong global delivery model, we enable businesses to focus on strategic growth.</p>
              <ul className="about-checks">
                <li>Vetted and skilled professionals across disciplines</li>
                <li>Global reach with domestic expertise</li>
                <li>Fast placement — typically under 2 weeks</li>
                <li>Ongoing support and performance monitoring</li>
              </ul>
              <a href="#" className="btn-primary" onClick={(e) => { e.preventDefault(); setPage("about"); window.scrollTo(0,0); }}>
                Our Story <Icons.arrowRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-bg" style={{ padding: "100px 0" }}>
        <div className="container">
          <div className="services-header reveal">
            <span className="pill" style={{ borderColor: "rgba(201,168,76,0.4)", color: "var(--gold)" }}>What We Do</span>
            <h2>End-to-End Talent Solutions</h2>
            <p>From accounting cadets to marketing specialists and web developers — we have the talent your business needs.</p>
          </div>
          <div className="services-grid">
            {[
              {
                Icon: Icons.accounting,
                title: "Accounting & Finance",
                desc: "Skilled accounting cadets ready to support your financial team — from bookkeeping to full financial management.",
                tags: ["Bookkeeping", "Payroll", "Tax", "Audit Support"],
              },
              {
                Icon: Icons.marketing,
                title: "Marketing & Brand",
                desc: "Creative marketing professionals who energize your brand's outreach through digital, social, and content channels.",
                tags: ["Social Media", "Content", "SEO", "Campaigns"],
              },
              {
                Icon: Icons.webdev,
                title: "Web Development",
                desc: "Full-stack developers and web specialists trusted by global and domestic clients to build and maintain digital products.",
                tags: ["Frontend", "Backend", "CMS", "E-commerce"],
              },
              {
                Icon: Icons.compliance,
                title: "Legal & Compliance",
                desc: "Expert compliance professionals to ensure your operations meet regulatory requirements across jurisdictions.",
                tags: ["Regulatory", "Legal Support", "Compliance Audit"],
              },
              {
                Icon: Icons.operations,
                title: "Operations Management",
                desc: "Operational experts who streamline your day-to-day processes, improving efficiency and reducing overhead.",
                tags: ["Process Design", "HR Support", "Admin"],
              },
              {
                Icon: Icons.strategy,
                title: "Strategic Growth",
                desc: "Business management advisors who align your talent strategy with long-term growth objectives.",
                tags: ["Consulting", "Talent Planning", "Scaling"],
              },
            ].map(({ Icon, title, desc, tags }, i) => (
              <div className="service-card reveal" key={title} style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="service-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="service-tags">
                  {tags.map((t) => <span className="service-tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <a href="#" className="btn-ghost" style={{ color: "var(--gold)", borderColor: "var(--gold)" }} onClick={(e) => { e.preventDefault(); setPage("services"); window.scrollTo(0,0); }}>
              All Services <Icons.arrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* Process */}
      <section>
        <div className="container">
          <div className="process-header reveal">
            <span className="pill">How It Works</span>
            <span className="gold-rule" />
            <h2>From Brief to Placement in 4 Steps</h2>
          </div>
          <div className="process-grid reveal">
            {[
              { n: "01", title: "Share Your Brief", desc: "Tell us your hiring needs — role, skills, timeline, and budget. We'll prepare a tailored talent plan." },
              { n: "02", title: "We Source & Vet", desc: "Our team identifies and rigorously screens candidates from our global network." },
              { n: "03", title: "Meet Your Match", desc: "We present shortlisted profiles. Interview and evaluate with zero pressure." },
              { n: "04", title: "Seamless Onboarding", desc: "Once you've chosen, we handle the placement and ensure a smooth transition." },
            ].map(({ n, title, desc }) => (
              <div className="process-step" key={n}>
                <span className="step-number">{n}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-bg">
        <div className="container">
          <div className="testimonials-header reveal">
            <span className="pill">Client Stories</span>
            <span className="gold-rule" />
            <h2>Trusted by Teams Worldwide</h2>
          </div>
          <div className="testimonials-grid">
            {[
              { text: "GG Global connected us with skilled marketing professionals who truly boosted our team's output. The placement was fast and the quality was exceptional.", name: "J. Lee", role: "Marketing Director", location: "Singapore", avatar: "https://images.unsplash.com/photo-1613186267015-46dc938f2b8f?auto=format&fit=crop&w=96&h=96" },
              { text: "Their dedication to finding top accounting talent worldwide helped us meet tight deadlines with confidence. I couldn't recommend them highly enough.", name: "Ramesh K.", role: "CFO", location: "India", avatar: "https://images.unsplash.com/photo-1484627779360-23208a3d7389?auto=format&fit=crop&w=96&h=96" },
              { text: "GG Global connected us with skilled marketing professionals who fit perfectly into our team and culture.", name: "Priya Sharma", role: "Brand Manager", location: "Maharashtra, India", avatar: "https://images.unsplash.com/photo-1588480301554-82fe5d51a070?auto=format&fit=crop&w=96&h=96" },
            ].map(({ text, name, role, location, avatar }, i) => (
              <div className="testimonial-card reveal" key={name} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar"><img src={avatar} alt={name} /></div>
                  <div>
                    <div className="testimonial-name">{name}</div>
                    <div className="testimonial-role">{role} · {location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section style={{ background: "var(--cream)", padding: "72px 0" }}>
        <div className="container">
          <div className="clients-header reveal">
            <span className="pill">Our Allies</span>
            <h2>Trusted by Our Partners</h2>
          </div>
          <div className="clients-marquee-wrap">
            <div className="clients-marquee">
              {["SafeStay", "TalentBridge", "AlphaCorp", "GlobalVentures", "NexusBiz", "PeakFinance", "VelocityMkt", "CoreTech",
                "SafeStay", "TalentBridge", "AlphaCorp", "GlobalVentures", "NexusBiz", "PeakFinance", "VelocityMkt", "CoreTech"].map((n, i) => (
                <div className="client-logo" key={i}><span className="client-logo-text">{n}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Jobs CTA */}
      <div className="jobs-bg">
        <div className="jobs-inner">
          <div className="jobs-text">
            <h2>Looking for Your Next Opportunity?</h2>
            <p>Register with us if you are a skilled professional seeking accounting, marketing, or web development roles.</p>
          </div>
          <a href="#" className="btn-dark" onClick={(e) => { e.preventDefault(); setPage("contact"); window.scrollTo(0,0); }}>
            Register With Us <Icons.arrowRight />
          </a>
        </div>
      </div>

      {/* Gallery */}
      <section style={{ background: "var(--cream-dark)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }} className="reveal">
            <span className="pill">Our Work</span>
            <span className="gold-rule" />
            <h2>Professionals in Action</h2>
          </div>
          <div className="gallery-grid">
            {[
              { src: "https://images.unsplash.com/photo-1479800800845-03752b6188fa?auto=format&fit=crop&w=600&q=80", tall: false },
              { src: "https://images.unsplash.com/photo-1700952706955-bae5fb856891?auto=format&fit=crop&w=600&q=80", tall: true },
              { src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80", tall: false },
              { src: "https://images.unsplash.com/photo-1515435187718-b41654581592?auto=format&fit=crop&w=600&q=80", tall: false },
              { src: "https://images.unsplash.com/photo-1677506048148-0c914dd8197b?auto=format&fit=crop&w=600&q=80", tall: false },
              { src: "https://images.unsplash.com/photo-1538688554366-621d446302aa?auto=format&fit=crop&w=600&q=80", tall: false },
              { src: "https://images.unsplash.com/photo-1564445477052-8a3787406bbf?auto=format&fit=crop&w=600&q=80", tall: false },
            ].map(({ src, tall }, i) => (
              <div className={`gallery-cell ${tall ? "tall" : ""}`} key={i}>
                <img src={src} alt="GG Global professionals" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Strip */}
      <section style={{ background: "var(--cream)", padding: "80px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="pill">Get in Touch</span>
          <span className="gold-rule" />
          <h2 className="reveal" style={{ fontSize: "clamp(32px,4vw,52px)", maxWidth: 640, margin: "0 auto 1.25rem" }}>
            Ready to Find the Right Talent?
          </h2>
          <p className="reveal" style={{ color: "var(--ink-faint)", fontSize: 16, fontWeight: 300, maxWidth: 480, margin: "0 auto 2rem", lineHeight: 1.7 }}>
            Contact us today and let GG Global match your business with world-class professionals.
          </p>
          <div className="reveal" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#" className="btn-primary" onClick={(e) => { e.preventDefault(); setPage("contact"); window.scrollTo(0,0); }}>
              Contact Us <Icons.arrowRight />
            </a>
            <a href="tel:+919818315577" className="btn-ghost">+91-9818315577</a>
          </div>
        </div>
      </section>
    </>
  );
}

// ── About Page ────────────────────────────────────────────────────────────────
function AboutPage({ setPage }) {
  useScrollReveal();
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="pill" style={{ borderColor: "rgba(201,168,76,0.5)" }}>About GG Global</span>
          <h1>Connecting Talented<br />Cadets Worldwide</h1>
          <p>Over 150 satisfied clients. A global delivery model. One reliable partner.</p>
        </div>
      </div>

      {/* Mission */}
      <section>
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap reveal-left">
              <img src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=800&q=80" alt="Diverse professionals" />
              <div className="about-img-badge">
                <strong>50+</strong>
                <span>Countries</span>
              </div>
            </div>
            <div className="about-text reveal-right">
              <span className="pill">Our Mission</span>
              <span className="gold-rule gold-rule-left" />
              <h2>Purpose-Built for Global Talent</h2>
              <p>GG Global is a domestic and global business management and professional services firm providing end-to-end solutions for companies across the world. We partner with startups, SMEs, and established enterprises.</p>
              <p>We manage finance, accounting, legal, compliance, technology, and operational functions — enabling businesses to focus on strategic growth.</p>
              <ul className="about-checks">
                <li>Client-centric approach at every step</li>
                <li>Strong global delivery model</li>
                <li>Single reliable partner for complete company management</li>
                <li>Deployed more than 150 professionals globally</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          <div className="stat-item"><AnimatedCounter target={150} suffix="+" /><span className="stat-label">Cadets Deployed</span></div>
          <div className="stat-item"><AnimatedCounter target={50} suffix="+" /><span className="stat-label">Countries</span></div>
          <div className="stat-item"><AnimatedCounter target={5} suffix="+" /><span className="stat-label">Years Experience</span></div>
          <div className="stat-item"><AnimatedCounter target={3} suffix="" /><span className="stat-label">Core Disciplines</span></div>
        </div>
      </div>

      {/* Key Projects */}
      <section style={{ background: "var(--cream-dark)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }} className="reveal">
            <span className="pill">Our Work</span>
            <span className="gold-rule" />
            <h2>Key Projects & Our Promise</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="reveal">
            <div style={{ background: "var(--white)", padding: "48px" }}>
              <div style={{ width: 48, height: 2, background: "var(--gold)", marginBottom: 24 }} />
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14 }}>Key Projects</h3>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--ink-muted)", fontWeight: 300 }}>
                We have successfully placed over 150 candidates in accounting, marketing, and web development across numerous countries, helping businesses grow with the right talent.
              </p>
              <img src="https://images.unsplash.com/photo-1564445477052-8a3787406bbf?auto=format&fit=crop&w=600&q=80" alt="Team collaborating" style={{ width: "100%", height: 200, objectFit: "cover", marginTop: 24 }} />
            </div>
            <div style={{ background: "var(--ink)", padding: "48px" }}>
              <div style={{ width: 48, height: 2, background: "var(--gold)", marginBottom: 24 }} />
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: "#fff" }}>Our Promise</h3>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>
                Committed to delivering professional candidates who make a difference, we prioritize quality, dedication, and global reach in every placement.
              </p>
              <img src="https://images.unsplash.com/photo-1585858229735-cd08d8cb510d?auto=format&fit=crop&w=600&q=80" alt="World map" style={{ width: "100%", height: 200, objectFit: "cover", marginTop: 24 }} />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }} className="reveal">
            <span className="pill">Gallery</span>
            <span className="gold-rule" />
            <h2>Snapshots of Our Talent</h2>
          </div>
          <div className="gallery-grid reveal">
            {[
              "https://images.unsplash.com/photo-1479800800845-03752b6188fa?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1700952706955-bae5fb856891?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1515435187718-b41654581592?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1677506048148-0c914dd8197b?auto=format&fit=crop&w=600&q=80",
            ].map((src, i) => (
              <div className="gallery-cell" key={i}><img src={src} alt="GG Global gallery" loading="lazy" /></div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="jobs-bg">
        <div className="jobs-inner">
          <div className="jobs-text">
            <h2>Join Our Global Network</h2>
            <p>Whether you're hiring or job seeking — GG Global is your gateway to opportunity.</p>
          </div>
          <a href="#" className="btn-dark" onClick={(e) => { e.preventDefault(); setPage("contact"); window.scrollTo(0,0); }}>
            Get in Touch <Icons.arrowRight />
          </a>
        </div>
      </div>
    </>
  );
}

// ── Services Page ─────────────────────────────────────────────────────────────
function ServicesPage({ setPage }) {
  useScrollReveal();
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="pill" style={{ borderColor: "rgba(201,168,76,0.5)" }}>Our Services</span>
          <h1>Connecting Talented Cadets<br />with Top Companies</h1>
          <p>End-to-end talent solutions across accounting, marketing, web development and more.</p>
        </div>
      </div>

      {/* Services Detail */}
      <section className="services-bg" style={{ padding: "100px 0" }}>
        <div className="container">
          <div className="services-grid">
            {[
              { Icon: Icons.accounting, title: "Accounting Experts", desc: "Providing skilled accounting cadets ready to support your finance team. From bookkeeping to full-cycle accounting, our professionals bring precision and expertise.", tags: ["Bookkeeping", "Payroll", "Tax Filing", "Financial Reporting", "Audit Support"] },
              { Icon: Icons.marketing, title: "Marketing Talent", desc: "Delivering passionate marketing cadets to energize your brand's outreach. Social media, content creation, SEO, and campaign management.", tags: ["Social Media", "Content Strategy", "SEO", "Ad Campaigns", "Brand Management"] },
              { Icon: Icons.webdev, title: "Web Development", desc: "Full-stack developers and web professionals trusted by global and domestic clients to build, maintain, and scale digital products.", tags: ["Frontend", "Backend", "React", "Node.js", "E-commerce"] },
              { Icon: Icons.compliance, title: "Legal & Compliance", desc: "Expert compliance and legal support professionals ensuring your business meets regulatory requirements across multiple jurisdictions.", tags: ["Regulatory Compliance", "Legal Research", "Contract Review"] },
              { Icon: Icons.operations, title: "Operations & Admin", desc: "Operational professionals who streamline day-to-day processes, improve efficiency, and handle administrative functions.", tags: ["HR Support", "Admin", "Process Design", "Vendor Management"] },
              { Icon: Icons.strategy, title: "Business Strategy", desc: "Strategic advisors and consultants who help align your talent acquisition with broader business growth objectives.", tags: ["Consulting", "Talent Planning", "Growth Strategy", "Market Entry"] },
            ].map(({ Icon, title, desc, tags }, i) => (
              <div className="service-card reveal" key={title} style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="service-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="service-tags">
                  {tags.map((t) => <span className="service-tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-bg">
        <div className="container">
          <div className="testimonials-header reveal">
            <span className="pill">Client Feedback</span>
            <span className="gold-rule" />
            <h2>What Our Clients Say</h2>
          </div>
          <div className="testimonials-grid">
            {[
              { text: "GG Global connected us with skilled marketing professionals who fit perfectly into our team and culture.", name: "Priya Sharma", role: "Brand Manager · Maharashtra", avatar: "https://images.unsplash.com/photo-1588480301554-82fe5d51a070?auto=format&fit=crop&w=96&h=96" },
              { text: "Their dedication to finding top accounting talent worldwide helped us meet tight deadlines with confidence.", name: "Ramesh K.", role: "CFO · India", avatar: "https://images.unsplash.com/photo-1484627779360-23208a3d7389?auto=format&fit=crop&w=96&h=96" },
              { text: "The web development candidate placed by GG Global delivered outstanding results within weeks of joining.", name: "J. Lee", role: "CTO · Singapore", avatar: "https://images.unsplash.com/photo-1613186267015-46dc938f2b8f?auto=format&fit=crop&w=96&h=96" },
            ].map(({ text, name, role, avatar }, i) => (
              <div className="testimonial-card reveal" key={name} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar"><img src={avatar} alt={name} /></div>
                  <div>
                    <div className="testimonial-name">{name}</div>
                    <div className="testimonial-role">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="jobs-bg">
        <div className="jobs-inner">
          <div className="jobs-text">
            <h2>Ready to Find Your Perfect Match?</h2>
            <p>Tell us your needs and we'll connect you with the right professionals.</p>
          </div>
          <a href="#" className="btn-dark" onClick={(e) => { e.preventDefault(); setPage("contact"); window.scrollTo(0,0); }}>
            Start Hiring <Icons.arrowRight />
          </a>
        </div>
      </div>
    </>
  );
}

// ── Contact Page ──────────────────────────────────────────────────────────────
function ContactPage() {
  useScrollReveal();
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="pill" style={{ borderColor: "rgba(201,168,76,0.5)" }}>Contact</span>
          <h1>Let's Build Something<br />Together</h1>
          <p>Whether you're hiring or looking for your next role — we'd love to hear from you.</p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info reveal-left">
              <span className="pill">Get in Touch</span>
              <span className="gold-rule gold-rule-left" />
              <h2>We're Here to Help</h2>
              <p>Reach out to us via email, phone, or through the form. Our team typically responds within 24 hours.</p>
              <ul className="contact-details">
                <li><Icons.email /><span>business@ggglobal.com</span></li>
                <li><Icons.phone /><span>+91-9818315577</span></li>
                <li><Icons.phone /><span>Harry Paul: +91-8595492220</span></li>
                <li><Icons.globe /><span>ggglobal.in</span></li>
              </ul>
              <div className="contact-socials">
                {[
                  { Icon: Icons.facebook, href: "https://www.facebook.com/", label: "Facebook" },
                  { Icon: Icons.instagram, href: "https://www.instagram.com/", label: "Instagram" },
                  { Icon: Icons.tiktok, href: "https://tiktok.com/", label: "TikTok" },
                  { Icon: Icons.twitter, href: "https://x.com/", label: "Twitter/X" },
                ].map(({ Icon, href, label }) => (
                  <a key={label} href={href} className="social-btn" aria-label={label} target="_blank" rel="noreferrer">
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
            <div className="reveal-right">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map — India HQ */}
      <div style={{ width: "100%", height: 340, position: "relative", overflow: "hidden" }}>
        <iframe
          title="GG Global India HQ"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923270888!2d77.06889754912505!3d28.52725173384555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1710000000000"
          width="100%"
          height="340"
          style={{ border: 0, display: "block", filter: "grayscale(30%) contrast(1.05)" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(13,13,13,0.55) 0%, transparent 100%)",
          padding: "20px 32px",
          display: "flex", alignItems: "flex-end", gap: 8,
          pointerEvents: "none",
        }}>
          <Icons.globe />
          <p style={{ color: "#fff", fontSize: 13, fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Global Operations · New Delhi, India HQ
          </p>
        </div>
      </div>
    </>
  );
}

// ── Privacy Page ──────────────────────────────────────────────────────────────
function PrivacyPage() {
  useScrollReveal();
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="pill" style={{ borderColor: "rgba(201,168,76,0.5)" }}>Legal</span>
          <h1>Privacy Policy</h1>
          <p>How we collect, use, and protect your information.</p>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="privacy-content reveal">
            <p>Last updated: January 2025. This Privacy Policy describes how GG Global ("we", "us", or "our") collects, uses, and shares information about you when you use our website and services.</p>
            <h3>Information We Collect</h3>
            <p>We collect information you provide directly to us, such as when you fill out a contact form, register as a candidate, or otherwise communicate with us. This may include your name, email address, phone number, and any message content.</p>
            <h3>How We Use Your Information</h3>
            <p>We use the information we collect to provide, maintain, and improve our services — including matching candidates with employers, responding to enquiries, and sending relevant communications about job opportunities and updates.</p>
            <h3>Sharing of Information</h3>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with employers and clients strictly for placement purposes, and only with your consent. We may also share information when required by law.</p>
            <h3>Data Security</h3>
            <p>We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction.</p>
            <h3>Cookies</h3>
            <p>Our website may use cookies to improve your experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            <h3>Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at business@ggglobal.com.</p>
            <h3>Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at: <strong>business@ggglobal.com</strong> or call <strong>+91-9818315577</strong>.</p>
          </div>
        </div>
      </section>
    </>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  // Override Vite's default App.css which sets max-width/padding on #root
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "gg-root-reset";
    style.textContent = `
      #root {
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        text-align: left !important;
      }
      body, html {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
      }
    `;
    document.head.appendChild(style);
    return () => { const el = document.getElementById("gg-root-reset"); if (el) el.remove(); };
  }, []);

  const pages = {
    home: <HomePage setPage={setPage} />,
    about: <AboutPage setPage={setPage} />,
    services: <ServicesPage setPage={setPage} />,
    contact: <ContactPage />,
    privacy: <PrivacyPage />,
  };

  return (
    <>
      <GlobalStyle />
      <Nav page={page} setPage={setPage} />
      <main style={{ width: "100%", minHeight: "100vh" }}>
        {pages[page] || pages["home"]}
      </main>
      <Footer setPage={setPage} />
    </>
  );
}
