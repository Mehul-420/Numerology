import { meanings, masterDetails, karmicDetails, challengeDetails, mulankDetails, tooltipContent } from '../config/numerology-config.js';
import { reduceNumber, formatDate, isMasterNumber } from '../utils/helpers.js';
import { calculateLoShuGrid } from '../core/calculations.js';
import { runFullAnalysis } from '../analysis/analysis-engine.js';
import { analyzeTemporalCycles } from '../temporal/temporal-analyzer.js';
import { renderTemporalCycles } from '../temporal/temporal-renderer.js';

const getRem = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

/**
 * DRAWER & TOOLTIP COMPONENTS
 */

export function openChallengeDrawer(phaseLabel, number) {
  const info = challengeDetails[number];
  if (!info) return;

  const existingDrawer = document.querySelector("#challengeDrawer");
  if (existingDrawer) existingDrawer.remove();

  const drawer = document.createElement("div");
  drawer.id = "challengeDrawer";
  drawer.className = "wisdom-drawer";
  drawer.innerHTML = `
    <div class="drawer-overlay"></div>
    <div class="drawer-content">
      <button class="drawer-close" aria-label="Close drawer">&times;</button>
      <div class="drawer-header">
        <p class="eyebrow">${phaseLabel} Phase Challenge</p>
        <h2>${info.theme} &mdash; Number ${number}</h2>
      </div>
      <div class="drawer-body">
        <section class="drawer-section"><h3>Main Lesson</h3><p class="highlight-text" style="font-size:1.4rem;">${info.lesson}</p></section>
        <section class="drawer-section"><h3>Vibrational Experience</h3><ul class="drawer-list" style="display:grid; gap:0.5rem;">${info.feel.map(item => `<li style="font-size:0.95rem; color:var(--text-muted);">• ${item}</li>`).join("")}</ul></section>
        <section class="drawer-section advice-section"><h3>Tactical Advice</h3><div class="advice-grid" style="display:grid; gap:0.75rem;">${info.advice.map(item => `<div class="advice-item" style="padding:1rem; background:var(--accent-soft); border-radius:0.75rem; border-left:0.25rem solid var(--accent-primary);"><span style="color:var(--accent-primary); font-weight:800; margin-right:0.5rem;">✦</span>${item}</div>`).join("")}</div></section>
        <div class="balance-row" style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:1rem; padding-top:1.5rem; border-top:0.0625rem solid var(--line-color);">
          <section class="drawer-section"><h3>Unbalanced Path</h3><p style="font-size:0.9rem; color:var(--rose-primary); font-weight:600;">${info.unbalanced}</p></section>
          <section class="drawer-section"><h3>Balanced Path</h3><p style="font-size:0.9rem; color:var(--accent-primary); font-weight:600;">${info.balanced}</p></section>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(drawer);
  requestAnimationFrame(() => drawer.classList.add("is-open"));
  const closeDrawer = () => { drawer.classList.remove("is-open"); setTimeout(() => drawer.remove(), 400); };
  drawer.querySelector(".drawer-close").onclick = closeDrawer;
  drawer.querySelector(".drawer-overlay").onclick = closeDrawer;
}

export function openMulankDrawer(number) {
  const info = mulankDetails[number];
  const masterInfo = masterDetails[number];
  if (!info) return;

  const existingDrawer = document.querySelector("#mulankDrawer");
  if (existingDrawer) existingDrawer.remove();

  const drawer = document.createElement("div");
  drawer.id = "mulankDrawer";
  drawer.className = "wisdom-drawer mulank-drawer";
  drawer.innerHTML = `
    <div class="drawer-overlay"></div>
    <div class="drawer-content">
      <button class="drawer-close" aria-label="Close drawer">&times;</button>
      <div class="drawer-header">
        <p class="eyebrow">Mulank / Archetypal Energy</p>
        <h2>Number ${number} &mdash; ${info.planet}</h2>
      </div>
      <div class="drawer-body">
        ${masterInfo ? `<section class="drawer-section" style="background:var(--accent-soft); padding:1.25rem; border-radius:1rem; border:0.0625rem solid var(--accent-primary);"><h3 style="color:var(--accent-primary);">Master Vibration: ${masterInfo.aliases}</h3><p style="font-size:0.95rem; margin:0;">${masterInfo.meaning}</p></section>` : ""}
        
        <section class="drawer-section"><h3>Core Energy</h3><div class="energy-tags" style="display:flex; flex-wrap:wrap; gap:0.5rem;">${info.energy.map(tag => `<span class="energy-tag" style="padding:0.5rem 1rem; background:var(--accent-soft); border-radius:6.25rem; font-size:0.85rem; font-weight:800; color:var(--accent-primary); border:0.0625rem solid var(--accent-primary);">${tag}</span>`).join("")}</div></section>
        
        <section class="drawer-section"><h3>Compatibility Spectrum</h3>
          <div class="compatibility-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.75rem; max-width:17.5rem; margin-bottom:1rem;">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
              const type = info.friendly.includes(n) ? 'friendly' : info.hardcoreAnti.includes(n) ? 'hardcore-anti' : info.anti.includes(n) ? 'anti' : 'neutral';
              const color = type === 'friendly' ? 'var(--accent-primary)' : type === 'hardcore-anti' ? 'var(--rose-primary)' : type === 'anti' ? 'var(--gold-primary)' : 'var(--text-muted)';
              return `<div class="compat-node ${type}" title="${type.replace("-", " ")}" style="height:3.125rem; display:grid; place-items:center; border-radius:0.75rem; font-weight:900; font-size:1.2rem; border:0.125rem solid ${color}; color:${color}; background:${type !== 'neutral' ? 'var(--card-bg)' : 'transparent'};">${n}</div>`;
            }).join("")}
          </div>
          <p style="font-size:0.95rem; color:var(--text-main);"><strong>Relationship Logic:</strong> ${info.logic.friendly}</p>
          ${info.logic.hardcoreAnti ? `<p style="font-size:0.9rem; color:var(--rose-primary); margin-top:0.5rem;"><strong>Conflict Note:</strong> ${info.logic.hardcoreAnti}</p>` : ""}
        </section>

        ${info.complementary && info.complementary.length > 0 ? `<section class="drawer-section"><h3>Complementary Vibrations</h3><div class="complementary-row" style="display:flex; gap:0.75rem;">${info.complementary.map(num => `<div style="padding:0.75rem 1.25rem; background:rgba(191,138,44,0.1); border:0.0625rem solid var(--gold-primary); border-radius:0.75rem;"><strong style="font-size:1.2rem; color:var(--gold-primary); display:block;">${num}</strong><small style="font-size:0.7rem; text-transform:uppercase; font-weight:800;">Harmonizer</small></div>`).join("")}</div></section>` : ""}
        
        ${masterInfo ? `<section class="drawer-section"><h3>Master Attributes</h3><p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6;">${masterInfo.attributes}</p><p style="font-size:0.9rem; color:var(--accent-primary); font-style:italic; margin-top:0.5rem;">${masterInfo.chartAttributes}</p></section>` : ""}
      </div>
    </div>
  `;
  document.body.appendChild(drawer);
  requestAnimationFrame(() => drawer.classList.add("is-open"));
  const closeDrawer = () => { drawer.classList.remove("is-open"); setTimeout(() => drawer.remove(), 400); };
  drawer.querySelector(".drawer-close").onclick = closeDrawer;
  drawer.querySelector(".drawer-overlay").onclick = closeDrawer;
}

export function openLoShuDrawer(counts) {
  const check = (nums) => nums.every(n => counts[String(n)]);
  const planes = [
    { name: "Mental Plane", nums: [4, 9, 2], strong: "Strategic, analytical, and highly organized mind.", weak: "Potential for mental confusion or scattered thoughts." },
    { name: "Emotional Plane", nums: [3, 5, 7], strong: "Deeply expressive, caring, and intuitive approach.", weak: "Emotional detachment or difficulty expressing feelings." },
    { name: "Practical Plane", nums: [8, 1, 6], strong: "Grounded, hardworking, and material stability.", weak: "Lack of grounding or financial instability." },
    { name: "Thought Plane", nums: [4, 3, 8], strong: "Powerful strategic vision and long-term thinking.", weak: "Lack of a clear mission or sense of direction." },
    { name: "Will Power Plane", nums: [9, 5, 1], strong: "Incredible determination and persistent drive.", weak: "Difficulty finishing tasks or inconsistent energy." },
    { name: "Actions Plane", nums: [2, 7, 6], strong: "Efficient implementer with strong practical execution.", weak: "Hesitation in starting projects or fear of action." },
    { name: "Golden Raj Yog", nums: [4, 5, 6], strong: "Supreme stability, prosperity, and life growth.", weak: "Need for more focus on foundational stability." },
    { name: "Silver Luxury Plane", nums: [2, 5, 8], strong: "Ability to generate comfort and material results.", weak: "Extra effort required to manifest material comforts." }
  ];

  const drawer = document.createElement("div");
  drawer.id = "loShuDrawer";
  drawer.className = "wisdom-drawer loshu-drawer";
  drawer.innerHTML = `
    <div class="drawer-overlay"></div>
    <div class="drawer-content">
      <button class="drawer-close" aria-label="Close drawer">&times;</button>
      <div class="drawer-header"><p class="eyebrow">Numero Chart Architecture</p><h2>Planes of Reality</h2></div>
      <div class="drawer-body">
        <div class="planes-report" style="display:grid; gap:1.25rem;">
          ${planes.map(p => {
            const isActive = check(p.nums);
            return `<div class="plane-report-card" style="padding:1.25rem; border:0.0625rem solid ${isActive ? 'var(--accent-primary)' : 'var(--panel-border)'}; border-radius:1rem; background:${isActive ? 'var(--accent-soft)' : 'var(--card-bg)'};">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <strong style="font-size:1.1rem;">${p.name}</strong>
                <span style="font-size:0.7rem; font-weight:900; text-transform:uppercase; padding:0.25rem 0.625rem; border-radius:6.25rem; background:${isActive ? 'var(--accent-primary)' : 'var(--card-border)'}; color:${isActive ? '#fff' : 'var(--text-muted)'};">${isActive ? 'Active' : 'Potential'}</span>
              </div>
              <p style="font-size:0.9rem; margin:0; color:var(--text-main); line-height:1.6;">${isActive ? p.strong : p.weak}</p>
              <div style="margin-top:0.75rem; font-size:0.8rem; color:var(--text-muted);">Vibrations: ${p.nums.join(" - ")}</div>
            </div>`;
          }).join("")}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(drawer);
  requestAnimationFrame(() => drawer.classList.add("is-open"));
  const closeDrawer = () => { drawer.classList.remove("is-open"); setTimeout(() => drawer.remove(), 400); };
  drawer.querySelector(".drawer-close").onclick = closeDrawer;
  drawer.querySelector(".drawer-overlay").onclick = closeDrawer;
}

function masterBadge(v, m = v) { 
  if (!isMasterNumber(m)) return "";
  const info = masterDetails[m];
  return `
    <span class="badge-wrapper" style="position:relative; display:inline-block; z-index:4;">
      <em class="master-badge" data-master="${m}" tabindex="0">Master ${m}</em>
    </span>
  `;
}

function karmicBadge(k) { 
  if (!k) return "";
  const info = karmicDetails[k];
  return `
    <span class="badge-wrapper" style="position:relative; display:inline-block; z-index:4;">
      <em class="karmic-badge" data-karmic="${k}" tabindex="0">Karmic ${k}</em>
    </span>
  `;
}

function masterInfoTooltip(val) {
  const info = masterDetails[val];
  return info ? `
    <div class="tooltip-header">
      <strong>Master Vibration ${val}</strong>
      <p>${info.aliases}</p>
    </div>
    <div class="tooltip-body">
      <strong>Key Attributes</strong>
      <p>${info.attributes}</p>
      <div class="master-meaning-callout">
        <strong>Meaning</strong>
        <p>${info.meaning}</p>
      </div>
      <div class="tooltip-impact-box">
        <strong>Master Numbers Attributes</strong>
        <p>${info.chartAttributes}</p>
      </div>
    </div>
  ` : "";
}

function karmicInfoTooltip(val) {
  const info = karmicDetails[val];
  return info ? `
    <div class="tooltip-header">
      <strong>Karmic Debt ${val}</strong>
      <p>Core Theme: ${info.meaning}</p>
    </div>
    <div class="tooltip-body">
      <p>Karmic numbers highlight specific developmental challenges that need conscious balancing.</p>
      <div class="karmic-meaning-callout">
        <strong>${val}: ${info.meaning}</strong>
        <p>${info.impacts.join(" ")}</p>
      </div>
      <strong>Impacts</strong>
      <div class="karmic-impact-list">
        ${info.impacts.map(impact => `<span>${impact}</span>`).join("")}
      </div>
    </div>
  ` : "";
}

function ensureBadgeTooltipPortal() {
  let tooltip = document.querySelector("#badgeTooltipPortal");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "badgeTooltipPortal";
    tooltip.className = "badge-tooltip-portal";
    tooltip.setAttribute("role", "tooltip");
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

function positionBadgeTooltip(badge, type) {
  const tooltip = ensureBadgeTooltipPortal();
  tooltip.innerHTML = type === "master" ? masterInfoTooltip(badge.dataset.master) : karmicInfoTooltip(badge.dataset.karmic);
  tooltip.dataset.type = type;
  tooltip.classList.add("is-visible");

  const margin = 16;
  const rect = badge.getBoundingClientRect();
  const width = Math.min(type === "karmic" ? 420 : 380, window.innerWidth - margin * 2);
  const left = Math.min(Math.max(rect.left, margin), window.innerWidth - width - margin);
  const below = rect.bottom + 10;

  tooltip.style.width = `${width}px`;
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${below}px`;

  const tooltipRect = tooltip.getBoundingClientRect();
  if (tooltipRect.bottom > window.innerHeight - margin) {
    tooltip.style.top = `${Math.max(margin, rect.top - tooltipRect.height - 10)}px`;
  }
}

function hideBadgeTooltip() {
  const tooltip = document.querySelector("#badgeTooltipPortal");
  if (tooltip) tooltip.classList.remove("is-visible");
}

function renderInfoTooltip(key) {
  const content = tooltipContent[key];
  if (!content) return "";
  return `
    <div class="info-wrapper" style="position:relative; display:inline-block; z-index:4;">
      <button class="info-button" type="button">i</button>
      <div class="info-tooltip" style="min-width:18rem;">
        <div class="tooltip-header">
          <strong>${content.title}</strong>
          <p>${content.subtitle}</p>
        </div>
        <div class="tooltip-body">
          <p>${content.text}</p>
          <div class="tooltip-impact-box">
            <strong>Vibrational Impact</strong>
            <p>${content.impact}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function positionActiveTooltip() {
  const activeWrappers = document.querySelectorAll(".info-wrapper:hover, .badge-wrapper:hover, .info-wrapper:focus-within, .badge-wrapper:focus-within");
  
  activeWrappers.forEach(wrapper => {
    const tooltip = wrapper.querySelector(".info-tooltip");
    if (!tooltip) return;

    const rem = getRem();
    const margin = rem;
    const wrapperRect = wrapper.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 1. Dynamic Width Calculation
    const targetWidth = rem * 21.25; 
    const tooltipWidth = Math.min(targetWidth, viewportWidth - (margin * 2));
    tooltip.style.width = `${tooltipWidth}px`;
    
    // 2. Horizontal Clamping
    let absoluteLeft = wrapperRect.left + (wrapperRect.width / 2) - (tooltipWidth / 2);
    const minLeft = margin;
    const maxLeft = viewportWidth - tooltipWidth - margin;
    absoluteLeft = Math.max(minLeft, Math.min(absoluteLeft, maxLeft));
    tooltip.style.left = `${absoluteLeft - wrapperRect.left}px`;

    // 3. Vertical Flip Logic (Prevent Bottom Overflow)
    // We measure scrollHeight because offsetHeight might be affected by current transforms
    const tooltipHeight = tooltip.scrollHeight || (rem * 15);
    
    // Calculate available space
    const spaceBelow = viewportHeight - wrapperRect.bottom - margin;
    const spaceAbove = wrapperRect.top - margin;

    // Flip if:
    // a) Not enough space below AND more space above than below
    // b) Bottom overflow is imminent
    if (spaceBelow < tooltipHeight && spaceAbove > spaceBelow) {
      tooltip.style.top = "auto";
      tooltip.style.bottom = "calc(100% + 0.75rem)";
      tooltip.style.transformOrigin = "bottom center";
      // Reverse the entry transform direction for flipped state
      if (!wrapper.matches(":hover") && !wrapper.matches(":focus-within")) {
         tooltip.style.transform = "translateY(-0.625rem) scale(0.95)";
      }
    } else {
      tooltip.style.top = "calc(100% + 0.75rem)";
      tooltip.style.bottom = "auto";
      tooltip.style.transformOrigin = "top center";
      if (!wrapper.matches(":hover") && !wrapper.matches(":focus-within")) {
         tooltip.style.transform = "translateY(0.625rem) scale(0.95)";
      }
    }
  });

  const activeMaster = document.querySelector(".master-badge:hover, .master-badge:focus");
  if (activeMaster) {
    positionBadgeTooltip(activeMaster, "master");
    return;
  }

  const activeKarmic = document.querySelector(".karmic-badge:hover, .karmic-badge:focus");
  if (activeKarmic) {
    positionBadgeTooltip(activeKarmic, "karmic");
    return;
  }

  if (!document.querySelector(".master-badge:hover, .karmic-badge:hover, .master-badge:focus, .karmic-badge:focus")) {
    hideBadgeTooltip();
  }
}

/**
 * ATOMIC RENDER COMPONENTS
 */

function renderDisclosureSection(title, content, isOpen = false, subtitle = "") {
  return `
    <div class="disclosure-section ${isOpen ? 'is-open' : ''}">
      <button type="button" class="disclosure-trigger">
        <div>
          <h3>${title}</h3>
          ${subtitle ? `<p class="disclosure-subtitle" style="font-size:0.75rem; color:var(--text-muted); margin-top:0.125rem;">${subtitle}</p>` : ''}
        </div>
        <div class="disclosure-icon">
          <svg width="1.125rem" height="1.125rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </button>
      <div class="disclosure-content">
        <div class="disclosure-inner" style="padding-top:1.25rem;">
          ${content}
        </div>
      </div>
    </div>
  `;
}

function renderSuggestions(suggestions) {
  if (!suggestions || suggestions.length === 0) return "";
  const grid = `
    <p class="intro-copy" style="margin-bottom:1.5rem;">Optimized spelling variations to harmonize your vibrational score.</p>
    <div class="suggestions-grid">
      ${suggestions.map(s => {
        const isNatural = s.phonetics.readability.hasNaturalVibe;
        const isSmooth = s.phonetics.pronunciation.isSmooth;
        const scoreVibe = s.score > 90 ? 'Excellent' : s.score > 80 ? 'Strong' : 'Balanced';
        return `
          <div class="suggestion-card" data-action="expand-card">
            <span class="suggestion-score">${s.score}</span>
            <div class="suggestion-header">
              <strong>${s.name}</strong>
              <div class="quality-indicators">
                ${isNatural ? '<span class="q-tag natural">Natural</span>' : ''}
                ${isSmooth ? '<span class="q-tag smooth">Smooth</span>' : ''}
                <span class="score-vibe-label" style="font-size:0.6rem; opacity:0.7; font-weight:800; text-transform:uppercase;">${scoreVibe}</span>
              </div>
            </div>
            <div class="suggestion-details">
              <div class="suggestion-meta" style="font-size:0.8rem; margin-bottom:0.75rem; font-weight:700;">
                <span>Total: ${s.total}</span> &middot; <span>Reduced: ${s.reduced}</span>
              </div>
              <ul class="suggestion-reasons" style="list-style:none; padding:0; display:grid; gap:0.375rem;">
                ${s.reasons.map(r => `<li style="font-size:0.8rem; display:flex; gap:0.5rem; align-items:start;"><span style="color:var(--accent-primary);">✦</span>${r}</li>`).join("")}
              </ul>
              ${s.warnings.length > 0 ? `<div class="suggestion-warnings" style="margin-top:0.75rem; padding:0.625rem; background:rgba(184, 80, 66, 0.05); border-radius:0.375rem;">${s.warnings.map(w => `<span style="font-size:0.75rem; color:var(--rose-primary); display:block;">⚠️ ${w}</span>`).join("")}</div>` : ""}
            </div>
            <div class="expand-hint">Analyze Details <svg width="0.625rem" height="0.625rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg></div>
          </div>
        `;
      }).join("")}
    </div>
  `;
  
  const subtitle = `${suggestions.length} high-frequency variants identified`;
  return renderDisclosureSection("Optimized Name Suggestions", grid, true, subtitle);
}

function renderValidator(originalName) {
  const content = `
    <p class="intro-copy">Enter a manual variation of <strong>${originalName}</strong> to validate its phonetic and numerological signature.</p>
    <div class="validator-input-row" style="display:flex; gap:0.75rem; margin-top:1rem;">
      <input type="text" id="customVariantInput" placeholder="Variation (e.g., Suniel)" style="flex:1;" />
      <button type="button" id="analyzeVariantBtn" class="primary-action" style="min-width:7.5rem; min-height:3rem;">Analyze</button>
    </div>
    <div id="validatorResult" class="validator-result" style="margin-top:1.25rem;"></div>
  `;
  return renderDisclosureSection("Manual Variant Analysis", content, false, "Validate your own spelling theories");
}

export function renderValidatorResult(report) {
  const v = report.verdict;
  return `
    <div class="verdict-card ${v.color}">
      <div class="verdict-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
        <strong>${v.title}</strong>
        <span class="score-pill" style="background:var(--accent-primary); color:#fff; padding:0.25rem 0.625rem; border-radius:6.1875rem; font-weight:800;">${report.score}</span>
      </div>
      <p class="verdict-summary" style="font-size:0.9rem; margin-bottom:1rem; color:var(--text-muted);">${v.summary}</p>
      <div class="comparison-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1rem;">
        <div class="comp-item"><small style="display:block; font-weight:800; color:var(--text-muted); text-transform:uppercase; font-size:0.65rem;">Original</small><strong>${report.comparison.metrics.original.total} / ${report.comparison.metrics.original.reduced}</strong></div>
        <div class="comp-item"><small style="display:block; font-weight:800; color:var(--text-muted); text-transform:uppercase; font-size:0.65rem;">Variant</small><strong>${report.comparison.metrics.variant.total} / ${report.comparison.metrics.variant.reduced}</strong></div>
      </div>
      <div class="report-lists" style="display:grid; gap:0.5rem;">
        ${report.reasons.length > 0 ? `<ul class="report-reasons" style="list-style:none; padding:0;">${report.reasons.map(r => `<li style="font-size:0.8rem; color:var(--accent-primary);">✓ ${r}</li>`).join("")}</ul>` : ""}
        ${report.warnings.length > 0 ? `<div class="report-warnings">${report.warnings.map(w => `<span style="font-size:0.8rem; color:var(--rose-primary); display:block;">⚠️ ${w}</span>`).join("")}</div>` : ""}
      </div>
    </div>
  `;
}

function updateSideSummary(reading, temporal) {
  const sideSummary = document.querySelector("#sideSummary");
  if (!sideSummary) return;

  sideSummary.innerHTML = `
    <div class="side-summary-item"><span>Mulank</span><span>${reading.mulank}</span></div>
    <div class="side-summary-item"><span>Bhagyank</span><span>${reading.bhagyank}</span></div>
    <div class="side-summary-item"><span>Frequency</span><span>${reading.nameNumber}</span></div>
    <div class="side-summary-item"><span>Kua</span><span>${reading.kua}</span></div>
  `;
  sideSummary.classList.add("has-data");
}

function renderCoreNumbers(reading) {
  return `
    <section class="core-numbers-section">
      <div class="section-heading"><h3>Vibrational Foundation</h3></div>
      <div class="traditional-grid">
        <div class="traditional-card mulank-card">
          <div class="card-title-row"><strong>Primary &middot; Mulank</strong>${renderInfoTooltip("mulank")}</div>
          <span>${reading.mulank}</span>${masterBadge(reading.mulank, reading.mulankMaster)}${karmicBadge(reading.mulankKarmic)}
          <button class="energy-profile-cta" type="button" data-number="${reading.mulank}">
            <span>View Profile</span>
            <svg width="0.875rem" height="0.875rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
        <div class="traditional-card bhagyank-card">
          <div class="card-title-row"><strong>Primary &middot; Bhagyank</strong>${renderInfoTooltip("bhagyank")}</div>
          <span>${reading.bhagyank}</span>${masterBadge(reading.bhagyank, reading.bhagyankMaster)}${karmicBadge(reading.bhagyankKarmic)}
        </div>
        <div class="traditional-card">
          <div class="card-title-row"><strong>Name Frequency</strong>${renderInfoTooltip("nameNumber")}</div>
          <span>${reading.nameNumber}</span>${masterBadge(reading.nameNumber, reading.nameNumber)}${karmicBadge(reading.nameNumberKarmic)}
        </div>
        <div class="traditional-card">
          <div class="card-title-row"><strong>Kua Energy</strong>${renderInfoTooltip("kua")}</div>
          <span>${reading.kua}</span><p style="font-size:0.65rem; text-transform:uppercase; margin-top:auto; font-weight:800; opacity:0.6;">${reading.gender === "female" ? "Solar Cycle + 4" : "Solar Cycle - 11"}</p>
        </div>
      </div>
    </section>
  `;
}

function renderLifeChallenges(challengeNumbers) {
  const content = `
    <div class="challenge-summary-grid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:0.75rem; margin-bottom:1.5rem;">
      <button class="challenge-mini-item" type="button" data-phase="Young" data-number="${challengeNumbers.c1}" style="display:flex; flex-direction:column; align-items:center; padding:0.75rem; background:var(--accent-soft); border:0.0625rem solid var(--accent-soft); border-radius:0.625rem; cursor:pointer;"><small style="font-size:0.6rem; font-weight:800; text-transform:uppercase; margin-bottom:0.25rem; color:var(--text-muted);">Young</small><span style="font-size:1.2rem; font-weight:900; color:var(--accent-primary);">${challengeNumbers.c1}</span></button>
      <button class="challenge-mini-item" type="button" data-phase="Adult" data-number="${challengeNumbers.c2}" style="display:flex; flex-direction:column; align-items:center; padding:0.75rem; background:var(--accent-soft); border:0.0625rem solid var(--accent-soft); border-radius:0.625rem; cursor:pointer;"><small style="font-size:0.6rem; font-weight:800; text-transform:uppercase; margin-bottom:0.25rem; color:var(--text-muted);">Adult</small><span style="font-size:1.2rem; font-weight:900; color:var(--accent-primary);">${challengeNumbers.c2}</span></button>
      <button class="challenge-mini-item" type="button" data-phase="Lifelong" data-number="${challengeNumbers.c3}" style="display:flex; flex-direction:column; align-items:center; padding:0.75rem; background:var(--accent-soft); border:0.0625rem solid var(--accent-soft); border-radius:0.625rem; cursor:pointer;"><small style="font-size:0.6rem; font-weight:800; text-transform:uppercase; margin-bottom:0.25rem; color:var(--text-muted);">Lifelong</small><span style="font-size:1.2rem; font-weight:900; color:var(--accent-primary);">${challengeNumbers.c3}</span></button>
      <button class="challenge-mini-item" type="button" data-phase="Later" data-number="${challengeNumbers.c4}" style="display:flex; flex-direction:column; align-items:center; padding:0.75rem; background:var(--accent-soft); border:0.0625rem solid var(--accent-soft); border-radius:0.625rem; cursor:pointer;"><small style="font-size:0.6rem; font-weight:800; text-transform:uppercase; margin-bottom:0.25rem; color:var(--text-muted);">Later</small><span style="font-size:1.2rem; font-weight:900; color:var(--accent-primary);">${challengeNumbers.c4}</span></button>
    </div><p class="intro-copy" style="font-size:0.8rem; text-align:center;">Select a cycle to reveal tactical archetypal guidance.</p>
  `;
  return renderDisclosureSection("Life Challenges", content, false, "Analyze 4 developmental challenge cycles");
}

function renderLoShuGridComponent(loShuCounts) {
  const cells = [
    { n: 4, r: 'mental' }, { n: 9, r: 'mental' }, { n: 2, r: 'mental' },
    { n: 3, r: 'emotional' }, { n: 5, r: 'emotional' }, { n: 7, r: 'emotional' },
    { n: 8, r: 'practical' }, { n: 1, r: 'practical' }, { n: 6, r: 'practical' }
  ];

  const gridHtml = cells.map(c => {
    const v = loShuCounts[String(c.n)] || "";
    const int = v.length > 2 ? 'high' : v.length > 1 ? 'medium' : 'normal';
    return `<div class="loshu-cell ${c.r} ${!v ? 'is-ghost' : 'has-value'}" data-intensity="${int}" style="height:6.25rem; display:flex; align-items:center; justify-content:center; border-radius:0.875rem; border:0.125rem solid var(--line-color); background:var(--card-bg); position:relative;">
      ${!v ? `<span class="ghost-mark" style="position:absolute; font-size:2.2rem; font-weight:900; opacity:0.1; color:var(--text-muted);">${c.n}</span>` : `<span class="cell-value" style="font-size:1.8rem; font-weight:900; color:var(--accent-primary);">${v}</span>`}
    </div>`;
  }).join("");

  const check = (nums) => nums.every(n => loShuCounts[String(n)]);

  const content = `
    <div class="loshu-grid-container" style="max-width:21.25rem; margin: 2rem auto; position:relative;">
      <div class="loshu-grid" style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.75rem;">
        ${gridHtml}
      </div>
      <svg class="loshu-arrows" viewBox="0 0 300 300" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:5; overflow:visible;">
        <line class="arrow-line h1 ${check([4, 9, 2]) ? 'is-active' : ''}" x1="20" y1="50" x2="280" y2="50" />
        <line class="arrow-line h2 ${check([3, 5, 7]) ? 'is-active' : ''}" x1="20" y1="150" x2="280" y2="150" />
        <line class="arrow-line h3 ${check([8, 1, 6]) ? 'is-active' : ''}" x1="20" y1="250" x2="280" y2="250" />
        <line class="arrow-line v1 ${check([4, 3, 8]) ? 'is-active' : ''}" x1="50" y1="20" x2="50" y2="280" />
        <line class="arrow-line v2 ${check([9, 5, 1]) ? 'is-active' : ''}" x1="150" y1="20" x2="150" y2="280" />
        <line class="arrow-line v3 ${check([2, 7, 6]) ? 'is-active' : ''}" x1="250" y1="20" x2="250" y2="280" />
        <line class="arrow-line d1 ${check([4, 5, 6]) ? 'is-active' : ''}" x1="30" y1="30" x2="270" y2="270" />
        <line class="arrow-line d2 ${check([2, 5, 8]) ? 'is-active' : ''}" x1="270" y1="30" x2="30" y2="270" />
        <line class="arrow-line s1 ${check([9, 7]) ? 'is-active' : ''}" x1="150" y1="50" x2="250" y2="150" />
        <line class="arrow-line s2 ${check([7, 1]) ? 'is-active' : ''}" x1="250" y1="150" x2="150" y2="250" />
        <line class="arrow-line s3 ${check([3, 1]) ? 'is-active' : ''}" x1="50" y1="150" x2="150" y2="250" />
        <line class="arrow-line s4 ${check([3, 9]) ? 'is-active' : ''}" x1="50" y1="150" x2="150" y2="50" />
      </svg>
    </div>
    <div class="active-planes-list" style="display:grid; gap:0.5rem;">
      ${[
        { nums: [4, 9, 2], name: "Mental Plane", m: "Analytical depth." },
        { nums: [3, 5, 7], name: "Emotional Plane", m: "Sensitive balance." },
        { nums: [8, 1, 6], name: "Practical Plane", m: "Grounded results." },
        { nums: [4, 3, 8], name: "Thought Plane", m: "Mission vision." },
        { nums: [9, 5, 1], name: "Will Power Plane", m: "Persistent drive." },
        { nums: [2, 7, 6], name: "Action Plane", m: "Skillful doing." },
        { nums: [4, 5, 6], name: "Golden Raj Yog", m: "Prosperity alignment." },
        { nums: [2, 5, 8], name: "Silver Luxury Plane", m: "Material comfort." },
        { nums: [9, 7], name: "9 & 7 Pair", m: "Balancing karma." },
        { nums: [7, 1], name: "7 & 1 Pair", m: "Deep research." },
        { nums: [3, 1], name: "3 & 1 Pair", m: "Spiritual knowledge." },
        { nums: [3, 9], name: "3 & 9 Pair", m: "Assertive logic." }
      ].filter(p => check(p.nums)).map(p => `
        <div class="active-plane-note" style="padding:0.75rem; background:var(--accent-soft); border-left:0.25rem solid var(--accent-primary); border-radius:0.375rem; font-size:0.85rem;">
          <strong>${p.name}:</strong> ${p.m}
        </div>
      `).join("")}
    </div>
    <p class="grid-cta" style="text-align:center; font-size:0.8rem; margin-top:1.25rem; opacity:0.7;">Click chart for advanced structural archetypes.</p>
  `;

  return renderDisclosureSection("Lo Shu Grid Visualization", content, false, "Interactive 3x3 numero-grid chart");
}

export function renderReading(reading, suggestions = []) {
  const loShuCounts = calculateLoShuGrid(reading.birthDate, reading.mulank, reading.bhagyank, reading.kua, reading.nameNumber);
  const temporal = analyzeTemporalCycles(reading);
  
  const focus = meanings[reading.mulank] || meanings[reduceNumber(reading.mulank, false)];
  const py = meanings[reading.personalYear] || meanings[reduceNumber(reading.personalYear, false)];

  updateSideSummary(reading, temporal);

  const resultsPanel = document.querySelector("#results");
  resultsPanel.className = "results-panel reveal-stagger";
  
  const headerHtml = `
    <header class="reading-header">
      <p class="eyebrow">${formatDate(reading.birthDate)}</p>
      <h2>${reading.name}</h2>
      <div class="reading-identity"><strong>Core Archetype:</strong> ${focus.title} &mdash; ${focus.text}</div>
    </header>
  `;

  const coreNumbersHtml = renderCoreNumbers(reading);
  const suggestionsHtml = renderSuggestions(suggestions);
  
  const temporalHtml = `
    <section class="temporal-section-wrapper" style="margin-top: 4rem;">
      <div class="section-heading"><h3>Energy Cycles</h3></div>
      ${renderTemporalCycles(temporal)}
      <div class="reading-identity py-insight" style="margin-top: 1.5rem; border-left-color: var(--gold-primary);">
        <strong>Personal Year ${reading.personalYear} Alignment:</strong> ${py.title} &mdash; ${py.text}
      </div>
    </section>
  `;

  const deepAnalysisHtml = `
    <section class="deep-analysis-section" style="margin-top: 4rem;">
      <div class="section-heading"><h3>Structural Analysis</h3></div>
      ${renderLifeChallenges(reading.challengeNumbers)}
      ${renderLoShuGridComponent(loShuCounts)}
      ${renderValidator(reading.name)}
    </section>
  `;

  resultsPanel.innerHTML = headerHtml + coreNumbersHtml + suggestionsHtml + temporalHtml + deepAnalysisHtml;
}
