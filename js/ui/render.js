import {
  meanings,
  masterDetails,
  karmicDetails,
  challengeDetails,
  mulankDetails,
  tooltipContent,
} from "../config/numerology-config.js";
import { reduceNumber, formatDate, isMasterNumber } from "../utils/helpers.js";
import { calculateLoShuGrid } from "../core/calculations.js";
import { runFullAnalysis } from "../analysis/analysis-engine.js";
import { smallRowDefinitions } from "../utils/constants.js";
import { analyzeTemporalCycles } from "../temporal/temporal-analyzer.js";
import { renderTemporalCycles } from "../temporal/temporal-renderer.js";

const getRem = () =>
  parseFloat(getComputedStyle(document.documentElement).fontSize);

/**
 * DRAWER & TOOLTIP COMPONENTS
 */

export function openChallengeDrawer(phaseLabel, number) {
  const info = challengeDetails[number];
  if (!info) return;

  const existingModal = document.querySelector("#challengeModal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.id = "challengeModal";
  modal.className = "bento-modal-overlay";
  modal.innerHTML = `
    <div class="bento-modal-content">
      <button class="bento-close" aria-label="Close">&times;</button>
      <div class="bento-grid">
        
        <!-- Header Card -->
        <div class="bento-card span-2 accent-primary" style="text-align: center; padding: 2rem 1rem;">
          <h3>${phaseLabel} Phase Challenge</h3>
          <p class="bento-value" style="font-size: 2.5rem; margin: 0.5rem 0;">${number}</p>
          <p style="font-size: 1.1rem; font-family: var(--font-heading); color: rgba(255,255,255,0.9);">${
            info.theme
          }</p>
        </div>

        <!-- Main Lesson -->
        <div class="bento-card span-2">
          <h3>Main Lesson</h3>
          <p style="font-size: 1.1rem; line-height: 1.6; margin-top: 0.5rem;">${
            info.lesson
          }</p>
        </div>

        <!-- Vibrational Experience -->
        <div class="bento-card span-2">
          <h3>Vibrational Experience</h3>
          <ul style="margin: 0.75rem 0 0 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.95rem;">
            ${info.feel
              .map((item) => `<li style="margin-bottom: 0.25rem;">${item}</li>`)
              .join("")}
          </ul>
        </div>

        <!-- Tactical Advice -->
        <div class="bento-card span-2">
          <h3>Tactical Advice</h3>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.75rem;">
            ${info.advice
              .map(
                (item) => `
              <div style="display: flex; gap: 0.75rem; background: var(--accent-soft); padding: 0.75rem; border-radius: 0.75rem;">
                <span style="color: var(--indigo-primary);">✦</span>
                <span style="font-size: 0.9rem; color: var(--text-main);">${item}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Unbalanced Path -->
        <div class="bento-card span-1" style="background: rgba(184, 80, 66, 0.05); border-color: rgba(184, 80, 66, 0.15);">
          <h3 style="color: var(--rose-primary);">Unbalanced Path</h3>
          <p style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--text-muted);">${
            info.unbalanced
          }</p>
        </div>

        <!-- Balanced Path -->
        <div class="bento-card span-1" style="background: rgba(107, 72, 200, 0.05); border-color: rgba(107, 72, 200, 0.15);">
          <h3 style="color: var(--indigo-primary);">Balanced Path</h3>
          <p style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--text-muted);">${
            info.balanced
          }</p>
        </div>

      </div>
    </div>
  `;
  document.body.appendChild(modal);

  void modal.offsetWidth;
  modal.classList.add("is-active");

  const closeModal = () => {
    modal.classList.remove("is-active");
    setTimeout(() => modal.remove(), 400);
  };
  modal.querySelector(".bento-close").onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

export function openKarmicDrawer(number) {
  const info = karmicDetails[number];
  if (!info) return;

  const existingModal = document.querySelector("#karmicModal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.id = "karmicModal";
  modal.className = "bento-modal-overlay";
  modal.innerHTML = `
    <div class="bento-modal-content">
      <button class="bento-close" aria-label="Close">&times;</button>
      <div class="bento-grid">
        
        <!-- Header Card -->
        <div class="bento-card span-2" style="background: linear-gradient(135deg, #451a1a 0%, #2a0a0a 100%); border-color: rgba(184, 80, 66, 0.4); text-align: center; padding: 2rem 1rem;">
          <h3 style="color: #fca5a5;">⚠️ Karmic Debt Number</h3>
          <p class="bento-value" style="font-size: 3rem; color: #fff;">${number}</p>
          <p style="font-size: 1.1rem; color: #fca5a5;">${info.meaning}</p>
        </div>

        <!-- Lessons & Challenges -->
        <div class="bento-card span-2">
          <h3>Spiritual Lesson</h3>
          <div style="display: grid; gap: 0.75rem; margin-top: 0.5rem;">
            ${info.impacts
              .map(
                (impact) => `
              <div style="display: flex; gap: 0.75rem; background: rgba(184, 80, 66, 0.05); padding: 0.85rem; border-radius: 0.75rem; border: 1px solid rgba(184, 80, 66, 0.15);">
                <span style="color: var(--rose-primary);">✦</span>
                <span style="font-size: 0.95rem; color: var(--text-main); line-height: 1.5;">${impact}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="bento-card span-2" style="background: var(--accent-soft);">
           <p style="font-size: 0.9rem; margin: 0; font-style: italic; color: var(--text-muted);">Karmic Debt numbers indicate lessons your soul is learning to balance from past experiences, offering a path to profound personal evolution.</p>
        </div>

      </div>
    </div>
  `;
  document.body.appendChild(modal);
  void modal.offsetWidth;
  modal.classList.add("is-active");

  const closeModal = () => {
    modal.classList.remove("is-active");
    setTimeout(() => modal.remove(), 400);
  };
  modal.querySelector(".bento-close").onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

export function getMulankBlueprintHTML(number, reading = null) {
  const n = parseInt(number, 10);
  const info = mulankDetails[n] || mulankDetails[number];
  if (!info) return "";

  const isMasculine = info.genderType.includes("Masculine");
  const groupColor = info.group.includes("Devta")
    ? "var(--indigo-primary)"
    : "var(--rose-primary)";

  // Kua Analysis (If reading exists)
  let kuaHtml = "";
  if (reading && reading.kua) {
    const kuaMap = {
      1: {
        group: "East Group",
        directions: ["South-East", "East", "South", "North"],
      },
      2: {
        group: "West Group",
        directions: ["North-East", "West", "North-West", "South-West"],
      },
      3: {
        group: "East Group",
        directions: ["South", "North", "South-East", "East"],
      },
      4: {
        group: "East Group",
        directions: ["North", "South", "East", "South-East"],
      },
      5: {
        group: reading.gender === "male" ? "West Group" : "West Group",
        directions: ["North-East", "West", "North-West", "South-West"],
      },
      6: {
        group: "West Group",
        directions: ["West", "North-East", "South-West", "North-West"],
      },
      7: {
        group: "West Group",
        directions: ["North-West", "South-West", "North-East", "West"],
      },
      8: {
        group: "West Group",
        directions: ["South-West", "North-West", "West", "North-East"],
      },
      9: {
        group: "East Group",
        directions: ["East", "South-East", "North", "South"],
      },
    };
    const kuaInfo = kuaMap[reading.kua];
    kuaHtml = `
      <div class="bento-card span-2" style="background: rgba(20, 184, 166, 0.04); border-color: rgba(20, 184, 166, 0.2);">
        <h3 style="color: #14b8a6;">Kua Environmental Harmony</h3>
        <p style="font-size: 1.1rem; color: var(--text-main);">You belong to the <strong>${
          kuaInfo.group
        }</strong>.</p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem;">
          ${kuaInfo.directions
            .map(
              (d) =>
                `<span style="padding: 0.3rem 0.6rem; background: rgba(20, 184, 166, 0.1); border-radius: 0.5rem; font-size: 0.75rem; color: var(--text-main); font-weight: 700;">${d}</span>`
            )
            .join("")}
        </div>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.75rem;">Align your workspace or bed towards these directions to maximize flow and potential improvement.</p>
      </div>
    `;
  }

  // Synthesis Logic
  let synthesisHtml = "";
  if (reading) {
    const temporal = analyzeTemporalCycles(reading);
    const py = temporal.personalYear.value;
    synthesisHtml = `
      <div class="bento-card span-2" style="background: var(--accent-soft); border: 2px solid var(--accent-primary);">
        <h3 style="color: var(--accent-primary);">Current Energy Synthesis</h3>
        <p style="font-size: 1.1rem; line-height: 1.6; margin-top: 0.5rem; color: var(--text-main);">
          As a <strong>Mulank ${number}</strong> (${
      info.mainAttribute
    }) navigating a <strong>Personal Year ${py}</strong>, this is a powerful cycle for 
          ${
            py === 1
              ? "taking bold new initiatives and setting your trajectory for the next 9 years."
              : py === 7
              ? "turning inward to refine your spiritual wisdom and research your deeper purpose."
              : "aligning your core personality with the current cosmic flow."
          }
        </p>
      </div>
    `;
  }

  return `
      <div class="bento-grid">
        
        <!-- Header Card -->
        <div class="bento-card span-2 accent-primary" style="align-items: center; text-align: center; padding: 2.5rem 1.5rem;">
          <h3 style="margin-bottom: 0.5rem; letter-spacing: 0.2em;">Ultimate Vibrational Blueprint</h3>
          <p class="bento-value" style="font-size: 4rem; line-height: 1;">${number}</p>
          <p style="font-size: 1.4rem; font-family: var(--font-heading);">${
            info.planet
          } Governance</p>
        </div>

        <!-- Cosmic Governance Section -->
        <div class="bento-card span-1" style="border-color: ${groupColor}; background: rgba(139, 92, 246, 0.04);">
          <h3 style="color: ${groupColor};">Planetary Group</h3>
          <p style="font-size: 1.25rem; font-weight: 800; color: var(--text-main);">${
            info.group
          }</p>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">${
            info.group.includes("Devta")
              ? "Guided by Divine/Spiritual frequencies."
              : "Guided by Material/Execution frequencies."
          }</p>
        </div>

        <div class="bento-card span-1">
          <h3>Gender Polarity</h3>
          <p style="font-size: 1.25rem; font-weight: 800; color: var(--text-main);">${
            info.genderType
          }</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.75rem;">
            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">${
              isMasculine ? "Active" : "Receptive"
            }</div>
            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">${
              isMasculine ? "Extrovert" : "Introvert"
            }</div>
          </div>
        </div>

        <!-- Core Essence -->
        <div class="bento-card span-2">
          <h3>Core Essence: ${info.mainAttribute}</h3>
          <p style="font-size: 1.2rem; line-height: 1.7; color: var(--text-main); margin-bottom: 0;">${
            info.description
          }</p>
        </div>

        <!-- The Four Pillars (If reading exists) -->
        ${
          reading
            ? `
          <div class="bento-card span-2">
            <h3 style="margin-bottom: 1.25rem;">The Four Soul Pillars</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem;">
              <div style="padding: 1rem; background: var(--accent-soft); border-radius: 12px; text-align: center;">
                <small style="display: block; margin-bottom: 0.25rem; color: var(--text-muted);">Mulank</small>
                <span class="mystic-num" style="font-size: 1.5rem;">${
                  reading.mulank
                }</span>
                <p style="font-size: 0.6rem; margin-top: 0.5rem; opacity: 0.8;">Core Nature</p>
              </div>
              <div style="padding: 1rem; background: var(--accent-soft); border-radius: 12px; text-align: center;">
                <small style="display: block; margin-bottom: 0.25rem; color: var(--text-muted);">Bhagyank</small>
                <span class="mystic-num" style="font-size: 1.5rem;">${
                  reading.bhagyank
                }</span>
                <p style="font-size: 0.6rem; margin-top: 0.5rem; opacity: 0.8;">Destiny Path</p>
              </div>
              <div style="padding: 1rem; background: var(--accent-soft); border-radius: 12px; text-align: center;">
                <small style="display: block; margin-bottom: 0.25rem; color: var(--text-muted);">Soul Urge</small>
                <span class="mystic-num" style="font-size: 1.5rem;">${
                  reading.soulUrge || reduceNumber(reading.nameNumber, false)
                }</span>
                <p style="font-size: 0.6rem; margin-top: 0.5rem; opacity: 0.8;">Inner Desire</p>
              </div>
              <div style="padding: 1rem; background: var(--accent-soft); border-radius: 12px; text-align: center;">
                <small style="display: block; margin-bottom: 0.25rem; color: var(--text-muted);">Destiny</small>
                <span class="mystic-num" style="font-size: 1.5rem;">${
                  reading.destiny || reading.nameNumber
                }</span>
                <p style="font-size: 0.6rem; margin-top: 0.5rem; opacity: 0.8;">Capability</p>
              </div>
            </div>
          </div>
        `
            : ""
        }

        <!-- Expressions -->
        <div class="bento-card span-1">
          <h3 style="color: var(--indigo-primary);">Positive Expression</h3>
          <p style="font-size: 1rem; line-height: 1.6; color: var(--text-main);">${
            info.positive
          }</p>
        </div>

        <div class="bento-card span-1">
          <h3 style="color: var(--rose-primary);">Areas for Growth</h3>
          <p style="font-size: 1rem; line-height: 1.6; color: var(--text-main);">${
            info.negative
          }</p>
        </div>

        <!-- Success Alignment -->
        <div class="bento-card span-1" style="background: rgba(251, 191, 36, 0.04); border-color: rgba(251, 191, 36, 0.2);">
          <h3>Success & Remedies</h3>
          <div style="display: flex; align-items: center; gap: 1.5rem; margin-top: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 2.5rem; height: 2.5rem; border-radius: 50%; background: ${
                info.remedyColor === "Silky White"
                  ? "#fdfdfd"
                  : info.remedyColor.includes("Gray")
                  ? "#888"
                  : info.remedyColor === "Sun-Red"
                  ? "#f43f5e"
                  : info.remedyColor.toLowerCase()
              }; border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 0 10px rgba(0,0,0,0.1);"></div>
              <div>
                <small style="display: block; color: var(--text-muted);">Power Color</small>
                <span style="font-weight: 800; color: var(--text-main);">${
                  info.remedyColor
                }</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bento-card span-1" style="background: rgba(139, 92, 246, 0.04); border-color: rgba(139, 92, 246, 0.15);">
          <h3>Weightage Shift</h3>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
             <div>
               <small style="display: block; color: var(--text-muted);">Starting</small>
               <span style="font-weight: 800; color: var(--indigo-primary);">75-80%</span>
             </div>
             <div style="font-size: 1.2rem; color: var(--text-muted);">→</div>
             <div>
               <small style="display: block; color: var(--text-muted);">Ending</small>
               <span style="font-weight: 800; color: var(--gold-primary);">20-40%</span>
             </div>
          </div>
        </div>

        ${kuaHtml}
        ${synthesisHtml}

        <!-- Life Theme -->
        <div class="bento-card span-2">
          <h3>Archetypal Life Theme</h3>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-main); font-style: italic;">"${
            info.theme
          }"</p>
        </div>

        <!-- Compatibility Analysis Table -->
        <div class="bento-card span-2" style="background: rgba(139, 92, 246, 0.03); border-color: rgba(139, 92, 246, 0.15);">
          <h3 style="margin-bottom: 1.25rem;">Compatibility Number Analysis</h3>
          <div style="overflow-x: auto; width: 100%;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
              <thead>
                <tr style="border-bottom: 1px solid var(--panel-border);">
                  <th style="padding: 0.75rem 0.5rem; color: var(--text-muted); font-family: var(--font-body); text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em;">Planetary Energy</th>
                  <th style="padding: 0.75rem 0.5rem; color: var(--text-muted); font-family: var(--font-body); text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em;">Vibrational Relationship</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid rgba(139, 92, 246, 0.08);">
                  <td style="padding: 0.85rem 0.5rem; font-weight: 800; color: var(--indigo-primary);">Friendly</td>
                  <td style="padding: 0.85rem 0.5rem; color: var(--text-main); letter-spacing: 0.1em;">${info.friendly.join(
                    ", "
                  )}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(139, 92, 246, 0.08);">
                  <td style="padding: 0.85rem 0.5rem; font-weight: 800; color: var(--gold-primary);">Neutral</td>
                  <td style="padding: 0.85rem 0.5rem; color: var(--text-main); letter-spacing: 0.1em;">${
                    info.neutral.join(", ") || "-"
                  }</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(139, 92, 246, 0.08);">
                  <td style="padding: 0.85rem 0.5rem; font-weight: 800; color: var(--rose-primary);">Non-Friend / Anti</td>
                  <td style="padding: 0.85rem 0.5rem; color: var(--text-main); letter-spacing: 0.1em;">${
                    info.anti.join(", ") || "-"
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 0.85rem 0.5rem; font-weight: 900; color: #f43f5e;">Hardcore Anti</td>
                  <td style="padding: 0.85rem 0.5rem; color: var(--text-main); letter-spacing: 0.1em; font-weight: 700;">${
                    info.hardcoreAnti.join(", ") || "-"
                  }</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
  `;
}

export function openMulankDrawer(number, reading = null) {
  const content = getMulankBlueprintHTML(number, reading);
  if (!content) return;

  const existingModal = document.querySelector("#vibrationalBlueprint");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.id = "vibrationalBlueprint";
  modal.className = "bento-modal-overlay";

  modal.innerHTML = `
    <div class="bento-modal-content" style="width: min(52rem, 100%);">
      <button class="bento-close" aria-label="Close">&times;</button>
      ${content}
    </div>
  `;

  document.body.appendChild(modal);

  void modal.offsetWidth;
  modal.classList.add("is-active");

  const closeModal = () => {
    modal.classList.remove("is-active");
    setTimeout(() => modal.remove(), 400);
  };
  modal.querySelector(".bento-close").onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

/**
 * Helper to render a metric with Master/Karmic support
 */
function renderSpecialMetric(label, value, master, karmic) {
  const isKarmic = karmic && [10, 13, 14, 16, 19].includes(karmic);
  const isMaster = [11, 22, 33].includes(master);

  let displayValue = value;
  let classes = "profile-metric-card";
  let badges = "";
  let tagline = "";

  if (isMaster) {
    displayValue = master;
    classes += " master-glow";
    badges += `<div class="special-badge master" data-type="master" data-number="${master}">✨ Master</div>`;
    tagline =
      master === 11
        ? "The Visionary"
        : master === 22
        ? "The Master Builder"
        : "The Healer Teacher";
  } else if (isKarmic) {
    displayValue = `${karmic}/${value}`;
    classes += " karmic-glow";
    badges += `<div class="special-badge karmic" data-type="karmic" data-number="${karmic}">⚠️ Karmic</div>`;
    // tagline = "Karmic Debt detected";
  }

  return `
    <div class="${classes}">
      <span class="metric-label">${label}</span>
      <span class="metric-value">${displayValue}</span>
      ${badges ? `<div class="badge-container">${badges}</div>` : ""}
      ${
        tagline
          ? `<p style="font-size: 0.6rem; margin-top: 0.4rem; color: ${
              isMaster ? "#fbbf24" : "var(--rose-primary)"
            }; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">${tagline}</p>`
          : ""
      }
    </div>
  `;
}

export function openLoShuDrawer(counts) {
  const check = (nums) => nums.every((n) => counts[String(n)]);

  const cells = [
    { n: 4, label: "Mental" },
    { n: 9, label: "Soul" },
    { n: 2, label: "Expression" },
    { n: 3, label: "Action" },
    { n: 5, label: "Status" },
    { n: 7, label: "Spirit" },
    { n: 8, label: "Practical" },
    { n: 1, label: "Career" },
    { n: 6, label: "Friends" },
  ];

  const gridHtml = cells
    .map((c) => {
      const v = counts[String(c.n)] || "";
      const isActive = v.length > 0;
      return `
      <div class="db-grid-cell ${
        isActive ? "active" : ""
      }" style="aspect-ratio: 1/1;">
        <span class="db-cell-num">${isActive ? v : c.n}</span>
        <span class="db-cell-label">${isActive ? c.label : "Empty"}</span>
      </div>
    `;
    })
    .join("");

  const planes = [
    {
      name: "Mental Plane",
      nums: [4, 9, 2],
      strong: "Strategic, analytical, and highly organized mind.",
      weak: "Potential for mental confusion or scattered thoughts.",
    },
    {
      name: "Emotional Plane",
      nums: [3, 5, 7],
      strong: "Deeply expressive, caring, and intuitive approach.",
      weak: "Emotional detachment or difficulty expressing feelings.",
    },
    {
      name: "Practical Plane",
      nums: [8, 1, 6],
      strong: "Grounded, hardworking, and material stability.",
      weak: "Lack of grounding or financial instability.",
    },
    {
      name: "Thought Plane",
      nums: [4, 3, 8],
      strong: "Powerful strategic vision and long-term thinking.",
      weak: "Lack of a clear mission or sense of direction.",
    },
    {
      name: "Will Power Plane",
      nums: [9, 5, 1],
      strong: "Incredible determination and persistent drive.",
      weak: "Difficulty finishing tasks or inconsistent energy.",
    },
    {
      name: "Actions Plane",
      nums: [2, 7, 6],
      strong: "Efficient implementer with strong practical execution.",
      weak: "Hesitation in starting projects or fear of action.",
    },
    {
      name: "Golden Raj Yog",
      nums: [4, 5, 6],
      strong: "Supreme stability, prosperity, and life growth.",
      weak: "Need for more focus on foundational stability.",
    },
    {
      name: "Silver Luxury Plane",
      nums: [2, 5, 8],
      strong: "Ability to generate comfort and material results.",
      weak: "Extra effort required to manifest material comforts.",
    },
  ];

  const existingModal = document.querySelector("#loShuModal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.id = "loShuModal";
  modal.className = "bento-modal-overlay";
  modal.innerHTML = `
    <div class="bento-modal-content">
      <button class="bento-close" aria-label="Close">&times;</button>
      <div class="bento-grid">
        
        <!-- Header Card -->
        <div class="bento-card span-2 accent-primary" style="text-align: center; padding: 1.5rem 1rem;">
          <h3 style="color: rgba(255,255,255,0.85); font-size: 0.8rem;">Numero Chart Architecture</h3>
          <p class="bento-value" style="font-size: 1.5rem; color: #fff; margin-top: 0.25rem;">Planes of Reality</p>
        </div>

        <!-- Visual Grid Card -->
        <div class="bento-card span-2" style="padding: 1.5rem;">
          <div class="dashboard-number-grid" style="width: 100%; max-width: 250px; margin: 0 auto; position: relative;">
            ${gridHtml}
            <svg class="loshu-arrows" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:5; overflow:visible;">
              <!-- Horizontal Planes -->
              <line class="arrow-line-track h1 ${
                check([4, 9, 2]) ? "is-active" : ""
              }" x1="5" y1="16.6" x2="95" y2="16.6" />
              <line class="arrow-line-track h2 ${
                check([3, 5, 7]) ? "is-active" : ""
              }" x1="5" y1="50" x2="95" y2="50" />
              <line class="arrow-line-track h3 ${
                check([8, 1, 6]) ? "is-active" : ""
              }" x1="5" y1="83.3" x2="95" y2="83.3" />
              <!-- Vertical Planes -->
              <line class="arrow-line-track v1 ${
                check([4, 3, 8]) ? "is-active" : ""
              }" x1="16.6" y1="5" x2="16.6" y2="95" />
              <line class="arrow-line-track v2 ${
                check([9, 5, 1]) ? "is-active" : ""
              }" x1="50" y1="5" x2="50" y2="95" />
              <line class="arrow-line-track v3 ${
                check([2, 7, 6]) ? "is-active" : ""
              }" x1="83.3" y1="5" x2="83.3" y2="95" />
              <!-- Diagonal Planes -->
              <line class="arrow-line-track d1 ${
                check([4, 5, 6]) ? "is-active" : ""
              }" x1="10" y1="10" x2="90" y2="90" />
              <line class="arrow-line-track d2 ${
                check([2, 5, 8]) ? "is-active" : ""
              }" x1="90" y1="10" x2="10" y2="90" />
              <!-- Secondary Pairings (Diamond) -->
              <line class="arrow-line-track s1 ${
                check([9, 7]) ? "is-active" : ""
              }" x1="50" y1="16.6" x2="83.3" y2="50" />
              <line class="arrow-line-track s2 ${
                check([7, 1]) ? "is-active" : ""
              }" x1="83.3" y1="50" x2="50" y2="83.3" />
              <line class="arrow-line-track s3 ${
                check([3, 1]) ? "is-active" : ""
              }" x1="50" y1="83.3" x2="16.6" y2="50" />
              <line class="arrow-line-track s4 ${
                check([3, 9]) ? "is-active" : ""
              }" x1="16.6" y1="50" x2="50" y2="16.6" />
            </svg>
          </div>
        </div>

        ${planes
          .map((p) => {
            const isActive = check(p.nums);
            return `
          <div class="bento-card span-2" style="${
            isActive
              ? "background: rgba(107, 72, 200, 0.06); border-color: rgba(107, 72, 200, 0.25);"
              : ""
          }">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <h3 style="color: ${
                isActive ? "var(--indigo-primary)" : "var(--text-muted)"
              }; font-size: 0.95rem; text-transform: none;">${p.name}</h3>
              <span style="font-size: 0.65rem; font-weight: 900; text-transform: uppercase; padding: 0.2rem 0.5rem; border-radius: 1rem; background: ${
                isActive ? "var(--indigo-primary)" : "var(--accent-soft)"
              }; color: ${isActive ? "#fff" : "var(--text-muted)"};">${
              isActive ? "Active" : "Potential"
            }</span>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-main); line-height: 1.5;">${
              isActive ? p.strong : p.weak
            }</p>
            <div style="margin-top: auto; padding-top: 0.75rem; font-size: 0.75rem; font-family: monospace; color: var(--indigo-primary); font-weight: bold; opacity: 0.7;">
              [ ${p.nums.join(" · ")} ]
            </div>
          </div>
          `;
          })
          .join("")}

        <!-- Small Planes Section -->
        <div class="bento-card span-2">
          <h3 style="margin-bottom: 1rem;">Secondary Combinations</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${smallRowDefinitions
              .filter((p) => check(p.nums))
              .map(
                (p) =>
                  `<div class="small-plane-badge"><span>${p.nums.join(
                    " & "
                  )}</span>${p.name}</div>`
              )
              .join("")}
            ${
              smallRowDefinitions.filter((p) => check(p.nums)).length === 0
                ? '<p style="font-size: 0.85rem; color: var(--text-muted);">No secondary combinations active.</p>'
                : ""
            }
          </div>
        </div>

      </div>
    </div>
  `;
  document.body.appendChild(modal);

  void modal.offsetWidth;
  modal.classList.add("is-active");

  const closeModal = () => {
    modal.classList.remove("is-active");
    setTimeout(() => modal.remove(), 400);
  };
  modal.querySelector(".bento-close").onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

export function positionActiveTooltip() {
  const activeTooltip = document.querySelector(
    ".info-tooltip, .badge-tooltip-portal"
  );
  if (!activeTooltip) return;

  const parent = activeTooltip.parentElement;
  if (!parent) return;

  const rect = parent.getBoundingClientRect();
  const tooltipRect = activeTooltip.getBoundingClientRect();
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Horizontal position
  let left = rect.left + rect.width / 2 - tooltipRect.width / 2;

  // Keep on screen (padding 1rem)
  const padding = 16;
  if (left < padding) left = padding;
  if (left + tooltipRect.width > screenWidth - padding) {
    left = screenWidth - tooltipRect.width - padding;
  }

  activeTooltip.style.left = `${left}px`;
  activeTooltip.style.transform = `translateY(0) scale(1)`;
}

function renderSuggestions(suggestions) {
  if (!suggestions || !suggestions.length) {
    return `
      <div class="disclosure-section is-open">
        <button class="disclosure-trigger" type="button">
          <h3>Optimized Name Suggestions</h3>
          <span class="disclosure-icon">▼</span>
        </button>
        <div class="disclosure-content">
          <div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.9rem; background:var(--card-bg); border-radius:1rem; border:0.0625rem solid var(--card-border);">
            Your current name is already highly optimized, or no significantly better variations were found without compromising phonetic identity.
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="disclosure-section is-open">
      <button class="disclosure-trigger" type="button">
        <h3>Optimized Name Suggestions</h3>
        <span class="disclosure-icon">▼</span>
      </button>
      <div class="disclosure-content">
        <div class="suggestions-grid">
          ${suggestions
            .map((s) => {
              const impact = s.score >= 80 ? "Major" : "Minor";
              const impactColor =
                impact === "Major"
                  ? "var(--rose-primary)"
                  : "var(--indigo-primary)";
              const standardValue = s.total || s.standardValue;
              const reducedValue = s.reduced || s.total;
              const reason = (s.reasons && s.reasons.length) ? s.reasons[0] : (s.reason || "Balanced Match");
              const meaning = (meanings[reducedValue] && meanings[reducedValue].text) || s.meaning || "A harmonious name combination.";

              const insights = [
                ...(s.reasons || []),
                ...(s.warnings || [])
              ];
              if (insights.length === 0) {
                insights.push("No major warnings or distinct reasons found. Neutral impact.");
              }

              return `
              <div class="suggestion-card" data-action="expand-card">
                <div class="suggestion-score">${s.score}% Match</div>
                <div class="suggestion-header">
                  <strong>${s.name}</strong>
                  <div style="display:flex; gap:0.5rem; align-items:center;">
                    <span style="font-size:0.8rem; font-weight:800; color:var(--gold-primary);">Total: ${standardValue}</span>
                    <span style="font-size:0.7rem; padding:0.15rem 0.4rem; border-radius:0.4rem; background:rgba(107,72,200,0.1); color:var(--indigo-primary);">${reason}</span>
                  </div>
                </div>
                
                <div class="suggestion-details">
                  <div style="margin-top:1rem; padding:1rem; background:var(--card-bg); border-radius:0.75rem; border:0.0625rem solid var(--card-border); margin-bottom:1rem;">
                    <h4 style="margin:0 0 0.5rem 0; font-size:0.9rem; color:var(--gold-primary); font-family:var(--font-body); text-transform:uppercase; letter-spacing:0.05em;">Vibrational Verdict</h4>
                    <p style="font-size:0.95rem; margin:0; line-height:1.6; color:var(--text-main);">
                      <strong style="color:${impactColor}">${impact} Improvement:</strong> ${meaning}
                    </p>
                  </div>

                  <div style="display:grid; gap:0.5rem; margin-bottom:0.5rem;">
                    ${insights.map(i => `
                      <div style="display:flex; gap:0.75rem; align-items:center; font-size:0.85rem; color:var(--text-muted);">
                        <span style="color:var(--indigo-primary); font-size:1rem;">✦</span>
                        <span>${i}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>
                
                <div class="expand-hint">Analyze Details <svg width="0.625rem" height="0.625rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg></div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderValidator(currentName) {
  const content = `
    <div style="display:grid; gap:1.25rem;">
      <div>
        <p class="intro-copy" style="font-size:0.9rem; margin-bottom:1rem;">Manually test spelling variations of <strong>${currentName}</strong> to find the highest vibrational alignment for your specific chart.</p>
        <div class="validator-input-row" style="display:flex; gap:0.75rem;">
          <input type="text" id="customVariantInput" placeholder="Enter new spelling..." style="flex:1;">
          <button id="analyzeVariantBtn" class="primary-action" style="width:auto; padding:0 1.5rem; min-height:3rem; font-size:0.85rem;">Validate Variant</button>
        </div>
      </div>
      <div id="validatorResult"></div>
    </div>
  `;
  return renderDisclosureSection(
    "Vibrational spelling validator",
    content,
    false,
    "Check any name variant against your chart"
  );
}

export function renderValidatorResult(report) {
  const isBetter = report.score >= 80;
  const verdictColor = isBetter
    ? "var(--indigo-primary)"
    : "var(--text-muted)";
    
  const verdictText = report.verdict && report.verdict.title 
    ? `<strong>${report.verdict.title}</strong>: ${report.verdict.summary}`
    : (typeof report.verdict === 'string' ? report.verdict : "Verdict ready.");

  const insights = [
    ...(report.reasons || []),
    ...(report.warnings || [])
  ];

  if (insights.length === 0) {
    insights.push("No major warnings or distinct reasons found. Neutral impact.");
  }

  return `
    <div class="reveal-stagger" style="padding:1.25rem; background:var(--accent-soft); border:0.0625rem solid var(--accent-primary); border-radius:1rem;">
      <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:1rem;">
        <div>
          <span style="display:block; font-size:0.65rem; font-weight:800; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.25rem;">Proposed Variation</span>
          <h3 style="margin:0; font-size:1.4rem; color:var(--text-main);">${report.variant}</h3>
          <div style="margin-top:0.25rem;">
            <span style="font-size:0.8rem; font-weight:800; color:var(--gold-primary);">Total: ${report.evaluation ? report.evaluation.total : "N/A"}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <span style="display:block; font-size:0.65rem; font-weight:800; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.25rem;">Vibrational Score</span>
          <span style="font-size:1.4rem; font-weight:900; color:var(--accent-primary);">${
            report.score
          }%</span>
        </div>
      </div>

      <div style="padding:1rem; background:var(--card-bg); border-radius:0.75rem; border:0.0625rem solid var(--card-border); margin-bottom:1rem;">
        <h4 style="margin:0 0 0.5rem 0; font-size:0.9rem; color:var(--gold-primary); font-family:var(--font-body); text-transform:uppercase; letter-spacing:0.05em;">Vibrational Verdict</h4>
        <p style="font-size:0.95rem; margin:0; line-height:1.6; color:var(--text-main);">${
          verdictText
        }</p>
      </div>

      <div style="display:grid; gap:0.5rem;">
        ${insights
          .map(
            (i) => `
          <div style="display:flex; gap:0.75rem; align-items:center; font-size:0.85rem; color:var(--text-muted);">
            <span style="color:var(--indigo-primary); font-size:1rem;">✦</span>
            <span>${i}</span>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderLifeChallenges(challengeNumbers) {
  const content = `
    <div class="challenge-summary-grid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:0.75rem; margin-bottom:1.5rem;">
      <button class="challenge-mini-item" type="button" data-phase="Young" data-number="${challengeNumbers.c1}">
        <small>Young</small>
        <span class="mystic-num">${challengeNumbers.c1}</span>
      </button>
      <button class="challenge-mini-item" type="button" data-phase="Adult" data-number="${challengeNumbers.c2}">
        <small>Adult</small>
        <span class="mystic-num">${challengeNumbers.c2}</span>
      </button>
      <button class="challenge-mini-item" type="button" data-phase="Lifelong" data-number="${challengeNumbers.c3}">
        <small>Lifelong</small>
        <span class="mystic-num">${challengeNumbers.c3}</span>
      </button>
      <button class="challenge-mini-item" type="button" data-phase="Later" data-number="${challengeNumbers.c4}">
        <small>Later</small>
        <span class="mystic-num">${challengeNumbers.c4}</span>
      </button>
    </div><p class="intro-copy" style="font-size:0.8rem; text-align:center;">Select a cycle to reveal tactical archetypal guidance.</p>
  `;
  return renderDisclosureSection(
    "Life Challenges",
    content,
    false,
    "Analyze 4 developmental challenge cycles"
  );
}

/**
 * Tarot Archtype Mapper for Premium Tarot Card pairing
 */
function getTarotArchetype(number) {
  const tarotMap = {
    1: {
      card: "The Magician",
      meaning: "Manifestation, resourcefulness, power, inspired action.",
    },
    2: {
      card: "The High Priestess",
      meaning: "Intuition, sacred knowledge, divine feminine, subconscious.",
    },
    3: {
      card: "The Empress",
      meaning: "Creativity, fertility, nature, abundance in expression.",
    },
    4: {
      card: "The Emperor",
      meaning:
        "Structure, stability, life cycle foundations, ultimate authority.",
    },
    5: {
      card: "The Hierophant",
      meaning: "Spiritual learning, traditional alignments, community values.",
    },
    6: {
      card: "The Lovers",
      meaning:
        "Deep cosmic attractions, relationship choices, absolute harmony.",
    },
    7: {
      card: "The Chariot",
      meaning: "Unwavering focus, focused drive, overcoming obstacles.",
    },
    8: {
      card: "Strength",
      meaning: "Infinite patience, quiet courage, soft energetic control.",
    },
    9: {
      card: "The Hermit",
      meaning:
        "Inner cosmic light, self-research, profound spiritual guidelines.",
    },
    11: {
      card: "Justice / Ace of Swords",
      meaning: "Mental plane mastery, objective truth, karmic balance.",
    },
    22: {
      card: "The Fool",
      meaning: "Infinite potential, creative leaps, universal mastery.",
    },
  };
  return (
    tarotMap[number] ||
    tarotMap[reduceNumber(number, false)] || {
      card: "The Wheel of Fortune",
      meaning: "Dynamic cyclical shifts in status.",
    }
  );
}

/**
 * Renders a premium, dynamic smooth SVG wave graph for Personal Cycles
 */
function renderSVGWaveChart(pyScore, pmScore, pdScore) {
  // Map scores (typically 0-100) to Y coordinates (height is 80, Y goes 0 to 80, so higher score is lower Y)
  const pyY = 80 - ((Math.min(100, Math.max(0, pyScore)) / 100) * 50 + 15);
  const pmY = 80 - ((Math.min(100, Math.max(0, pmScore)) / 100) * 50 + 15);
  const pdY = 80 - ((Math.min(100, Math.max(0, pdScore)) / 100) * 50 + 15);

  return `
    <div class="wave-chart-container">
      <svg class="wave-svg" viewBox="0 0 200 80">
        <defs>
          <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#8b5cf6" />
            <stop offset="50%" stop-color="#a78bfa" />
            <stop offset="100%" stop-color="#14b8a6" />
          </linearGradient>
          <linearGradient id="wave-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(167, 139, 250, 0.22)" />
            <stop offset="100%" stop-color="rgba(167, 139, 250, 0)" />
          </linearGradient>
        </defs>

        <!-- Faint Background Threshold Guidelines -->
        <line x1="10" y1="20" x2="190" y2="20" stroke="rgba(255,255,255,0.06)" stroke-dasharray="2,3" stroke-width="0.4" />
        <text x="190" y="17" fill="rgba(255,255,255,0.22)" font-family="var(--font-body)" font-size="3.2px" font-weight="800" letter-spacing="0.05em" text-anchor="end">PEAK / HARVEST</text>

        <line x1="10" y1="40" x2="190" y2="40" stroke="rgba(255,255,255,0.06)" stroke-dasharray="2,3" stroke-width="0.4" />
        <text x="190" y="37" fill="rgba(255,255,255,0.22)" font-family="var(--font-body)" font-size="3.2px" font-weight="800" letter-spacing="0.05em" text-anchor="end">BALANCE / FLOW</text>

        <line x1="10" y1="60" x2="190" y2="60" stroke="rgba(255,255,255,0.06)" stroke-dasharray="2,3" stroke-width="0.4" />
        <text x="190" y="57" fill="rgba(255,255,255,0.22)" font-family="var(--font-body)" font-size="3.2px" font-weight="800" letter-spacing="0.05em" text-anchor="end">REST / REFLECT</text>

        <!-- Area path under wave -->
        <path class="wave-area" d="M 10,80 L 10,${pyY} C 55,${
    pyY - 15
  } 55,${pmY} 100,${pmY} C 145,${pmY} 145,${pdY + 15} 190,${pdY} L 190,80 Z" />
        <!-- Wave outline -->
        <path class="wave-path" d="M 10,${pyY} C 55,${
    pyY - 15
  } 55,${pmY} 100,${pmY} C 145,${pmY} 145,${pdY + 15} 190,${pdY}" />
        <!-- Data nodes -->
        <circle class="wave-point" cx="10" cy="${pyY}" title="Year Point" />
        <circle class="wave-point" cx="100" cy="${pmY}" title="Month Point" />
        <circle class="wave-point" cx="190" cy="${pdY}" title="Day Point" />
      </svg>
    </div>
  `;
}

/**
 * Computes Western Zodiac Sign from birth date based on exact date ranges
 */
function getZodiacSign(birthDate) {
  if (!birthDate) return "Aries";
  const parts = birthDate.split("-");
  if (parts.length < 3) return "Aries";
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(month) || isNaN(day)) return "Aries";

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "Aries";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "Taurus";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return "Gemini";
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return "Cancer";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "Leo";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "Virgo";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return "Libra";
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return "Scorpio";
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return "Sagittarius";
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return "Capricorn";
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "Aquarius";
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return "Pisces";
  }
  return "Aries";
}

/**
 * Generates a dynamic 1-sentence synthesis summary of temporal cycles
 */
function generateCycleSummary(temporal) {
  const yrVal = temporal.personalYear.value;
  const yrLabel = temporal.personalYear.favorability.label.toLowerCase();
  const dyVal = temporal.personalDay.value;
  const dyLabel = temporal.personalDay.favorability.label.toLowerCase();

  let text = `Your day is governed by a <strong>Personal Day ${dyVal}</strong> (${dyLabel} vibration), acting within the overarching theme of your <strong>Personal Year ${yrVal}</strong> (${yrLabel} phase).`;

  if (temporal.personalDay.score >= 80 && temporal.personalYear.score >= 80) {
    text += ` Both cycles are in high harmony—it's an exceptionally powerful moment to initiate high-impact activities.`;
  } else if (
    temporal.personalDay.score >= 80 &&
    temporal.personalYear.score <= 40
  ) {
    text += ` Although the year calls for reflection, today's high-vibration energy offers a temporary burst of action.`;
  } else if (
    temporal.personalDay.score <= 40 &&
    temporal.personalYear.score >= 80
  ) {
    text += ` Despite a highly favorable year, today is best suited for resting and gathering your energy.`;
  } else {
    text += ` Focus on maintaining balance, steady progress, and self-awareness today.`;
  }
  return text;
}

/**
 * Returns Hex color matching score favorability thresholds
 */
function getColorForScore(score) {
  if (score >= 90) return "#22c55e"; // Green
  if (score >= 70) return "#8b5cf6"; // Purple/Indigo
  if (score >= 50) return "#eab308"; // Gold
  if (score >= 30) return "#64748b"; // Grey
  return "#f43f5e"; // Red
}

export function renderReading(reading, suggestions = []) {
  const loShuCounts = calculateLoShuGrid(
    reading.birthDate,
    reading.mulank,
    reading.bhagyank,
    reading.kua,
    reading.nameNumber
  );
  const temporal = analyzeTemporalCycles(reading);

  const focus =
    meanings[reading.mulankMaster] ||
    meanings[reading.mulank] ||
    meanings[reduceNumber(reading.mulank, false)];
  const py =
    meanings[reading.personalYear] ||
    meanings[reading.personalYearKarmic] ||
    meanings[reduceNumber(reading.personalYear, false)];
  const pyAlignment =
    meanings[temporal.personalYear.value] || py || meanings[1];
  const tarot = getTarotArchetype(reading.mulankMaster || reading.mulank);
  const suggestionsHtml = renderSuggestions(suggestions);

  updateSideSummary(reading, temporal);

  const resultsPanel = document.querySelector("#results");
  resultsPanel.className = "results-panel reveal-stagger";

  // Initials for avatar
  const initials = reading.name
    ? reading.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .substring(0, 2)
    : "P";
  const zodiacSign = getZodiacSign(reading.birthDate) || "Aries";
  const zodiacSymbols = {
    Aries: "♈",
    Taurus: "♉",
    Gemini: "♊",
    Cancer: "♋",
    Leo: "♌",
    Virgo: "♍",
    Libra: "♎",
    Scorpio: "♏",
    Sagittarius: "♐",
    Capricorn: "♑",
    Aquarius: "♒",
    Pisces: "♓",
  };
  const zodiacSymbol = zodiacSymbols[zodiacSign] || "♈";

  // Grid Cell configurations for Lo Shu Grid
  const cellLabels = {
    4: "Numbers",
    9: "Soul",
    2: "Expression",
    3: "Number",
    5: "Status",
    7: "Number",
    8: "Number",
    1: "Current",
    6: "Symbols",
  };
  const cells = [4, 9, 2, 3, 5, 7, 8, 1, 6];
  const check = (nums) => nums.every((n) => loShuCounts[String(n)]);

  resultsPanel.innerHTML = `
    <!-- Bento Dashboard results Grid -->
    <div class="bento-results-container">
      
      <!-- CARD 1: Profile Header (Spans 4 columns) -->
      <div class="bento-card-wrapper db-span-4">
        <div class="reading-header" style="display: none;"><h2>${
          reading.name
        }</h2></div>
        <div class="db-profile-header">
          <div class="db-profile-avatar">${initials}</div>
          <div class="db-profile-info">
            <h2>${reading.name}</h2>
            <p>${formatDate(reading.birthDate)} &middot; Mulank ${
    reading.mulankMaster || reading.mulank
  } &middot; Zodiac: ${zodiacSign} ${zodiacSymbol}</p>
          </div>
          <div class="form-actions" style="margin-left:auto; display:flex; align-items:center;">
            <button class="share-profile-cta silver-pulse" type="button" title="Share Profile Card" style="width:auto; min-width:max-content; margin-top:0; padding: 0 1.25rem; height: 2.75rem; font-size: 0.8rem; border-radius: 2rem; border: none; font-weight: 800; color: #000; background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 50%, #9ca3af 100%); margin-right: 0.5rem; flex-shrink:0;">
              <span style="margin-right: 0.5rem;">📤</span>
              <span>Share Profile</span>
            </button>
            <button class="energy-profile-cta golden-pulse" type="button" data-number="${
              reading.mulankMaster || reading.mulank
            }" title="View Archetypal Profile" style="width:auto; min-width:max-content; margin-top:0; padding: 0 1.25rem; height: 2.75rem; font-size: 0.8rem; border-radius: 2rem; border: none; font-weight: 800; color: #000; background: linear-gradient(135deg, #fde68a 0%, #fbbf24 50%, #f59e0b 100%);">
              <span style="margin-right: 0.5rem;">👤</span>
              <span>View Energy Profile</span>
            </button>
          </div>
        </div>
      </div>

      <!-- CARD 2: Daily Insight (Spans 2 columns) -->
      <div class="bento-card-wrapper db-span-4 accent-glow">
        <h3>Daily Insight</h3>
        <div class="daily-insight-body">
          <div class="insight-text-col">
            <h4>Mulank ${reading.mulankMaster || reading.mulank} | ${
    focus.title
  }</h4>
            <p style="font-size:0.72rem; font-weight:800; color:#a78bfa; text-transform:uppercase; margin-bottom:0.5rem; letter-spacing:0.05em;">
              Day ${temporal.personalDay.value} — ${
    temporal.personalDay.favorability.label
  }
            </p>
            <p style="font-size: 0.82rem; line-height: 1.6; color: rgba(255,255,255,0.75); margin: 0;">
              ${focus.text}
            </p>
          </div>
          <div class="circle-glow-container">
            <div class="circle-glow-ring"></div>
            <div class="circle-number">${
              reading.mulankMaster || reading.mulank
            }</div>
          </div>
        </div>
      </div>

      <!-- CARD 3: Numerology Profile Core Metrics (Spans 2 columns) -->
      <div class="bento-card-wrapper db-span-2">
        <h3>Numerology Profile</h3>
        <div class="profile-metrics-grid">
          ${renderSpecialMetric(
            "Mulank",
            reading.mulank,
            reading.mulankMaster,
            reading.mulankKarmic
          )}
          ${renderSpecialMetric(
            "Bhagyank",
            reading.bhagyank,
            reading.bhagyankMaster,
            reading.bhagyankKarmic
          )}
          ${renderSpecialMetric(
            "Frequency",
            reading.nameNumber,
            reading.nameNumberMaster,
            reading.nameNumberKarmic
          )}
          
          <div class="profile-metric-card">
            <span class="metric-label">Kua</span>
            <span class="metric-value">${reading.kua}</span>
          </div>
          
        </div>
      </div>

      <!-- CARD 4: Number Grid Lo Shu Cell (Spans 2 columns) -->
      <div class="bento-card-wrapper db-span-2">
        <h3>Number Grid</h3>
        <p style="font-size: 0.7rem; color: rgba(160, 145, 210, 0.6); margin: 0 0 0.5rem 0;">Numbers:</p>
        <!-- Triggers openLoShuDrawer dynamically in app.js -->
        <div class="dashboard-number-grid" style="width: 100%; position: relative;">
          ${cells
            .map((c) => {
              const count = loShuCounts[String(c)] || "";
              const isActive = count.length > 0;
              // In the reference, active cells all have a small decorative mark
              const starGlyph =
                c === 5 || c === 3 || c === 7
                  ? "✦"
                  : c === 2 || c === 6 || c === 9
                  ? "✧"
                  : "+";
              return `
              <div class="db-grid-cell ${isActive ? "active" : ""}" title="${
                isActive ? cellLabels[c] + " — Active" : "Grid Potential"
              }">
                ${
                  isActive
                    ? `<span class="cell-star-decor">${starGlyph}</span>`
                    : ""
                }
                <span class="db-cell-num">${isActive ? count : c}</span>
                <span class="db-cell-label">${
                  isActive ? cellLabels[c] : "Empty"
                }</span>
              </div>
            `;
            })
            .join("")}
          <svg class="loshu-arrows" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:5; overflow:visible;">
            <!-- Horizontal Planes -->
            <line class="arrow-line-track h1 ${
              check([4, 9, 2]) ? "is-active" : ""
            }" x1="5" y1="16.6" x2="95" y2="16.6" />
            <line class="arrow-line-track h2 ${
              check([3, 5, 7]) ? "is-active" : ""
            }" x1="5" y1="50" x2="95" y2="50" />
            <line class="arrow-line-track h3 ${
              check([8, 1, 6]) ? "is-active" : ""
            }" x1="5" y1="83.3" x2="95" y2="83.3" />
            <!-- Vertical Planes -->
            <line class="arrow-line-track v1 ${
              check([4, 3, 8]) ? "is-active" : ""
            }" x1="16.6" y1="5" x2="16.6" y2="95" />
            <line class="arrow-line-track v2 ${
              check([9, 5, 1]) ? "is-active" : ""
            }" x1="50" y1="5" x2="50" y2="95" />
            <line class="arrow-line-track v3 ${
              check([2, 7, 6]) ? "is-active" : ""
            }" x1="83.3" y1="5" x2="83.3" y2="95" />
            <!-- Diagonal Planes -->
            <line class="arrow-line-track d1 ${
              check([4, 5, 6]) ? "is-active" : ""
            }" x1="10" y1="10" x2="90" y2="90" />
            <line class="arrow-line-track d2 ${
              check([2, 5, 8]) ? "is-active" : ""
            }" x1="90" y1="10" x2="10" y2="90" />
            <!-- Secondary Pairings (Diamond) -->
            <line class="arrow-line-track s1 ${
              check([9, 7]) ? "is-active" : ""
            }" x1="50" y1="16.6" x2="83.3" y2="50" />
            <line class="arrow-line-track s2 ${
              check([7, 1]) ? "is-active" : ""
            }" x1="83.3" y1="50" x2="50" y2="83.3" />
            <line class="arrow-line-track s3 ${
              check([3, 1]) ? "is-active" : ""
            }" x1="50" y1="83.3" x2="16.6" y2="50" />
            <line class="arrow-line-track s4 ${
              check([3, 9]) ? "is-active" : ""
            }" x1="16.6" y1="50" x2="50" y2="16.6" />
          </svg>
        </div>
      </div>

      

      <!-- CARD 6: Energy Cycles (Spans 4 columns) -->
      <div class="bento-card-wrapper db-span-4" style="background: transparent; border: none; padding: 0; box-shadow: none;">
        <h2 style="font-family: var(--font-heading); font-size: 1.5rem; text-transform: uppercase; color: var(--text-main); margin: 1rem 0 0.5rem 0; letter-spacing: 0.05em;">Energy Cycles</h2>
        ${renderTemporalCycles(temporal)}
      </div>

      
      <!-- CARD 9: Structural Analysis, Challenges & Manual Validator (Spans 4 columns) -->
      <div class="bento-card-wrapper db-span-4" style="background:transparent; border:none; padding:0; gap:0;">
      <section class="deep-analysis-section" style="margin-top:0; display:grid; gap:1.25rem; width:100%;">
      ${renderLifeChallenges(reading.challengeNumbers)}
      </section>
      </div>
      
      <!-- CARD 8: Suggestions Accordion (Spans 4 columns) -->
      <div class="bento-card-wrapper db-span-4" style="background:transparent; border:none; padding:0; gap:0;">
        ${suggestionsHtml}
      </div>
      
      
      <div class="bento-card-wrapper db-span-4" style="background:transparent; border:none; padding:0; gap:0;">
      <section class="deep-analysis-section" style="margin-top:0; display:grid; gap:1.25rem; width:100%;">
      ${renderValidator(reading.name)}
          
      </section>
      </div>
          
    </div>
  `;
}

function renderDisclosureSection(
  title,
  content,
  isOpen = false,
  subtitle = ""
) {
  return `
    <div class="disclosure-section ${isOpen ? "is-open" : ""}">
      <button class="disclosure-trigger">
        <div>
          <h3>${title}</h3>
          ${
            subtitle
              ? `<p style="font-size:0.7rem; color:var(--text-muted); margin:0;">${subtitle}</p>`
              : ""
          }
        </div>
        <span class="disclosure-icon">▼</span>
      </button>
      <div class="disclosure-content">
        ${content}
      </div>
    </div>
  `;
}

function updateSideSummary(reading, temporal) {
  const sideSummary = document.querySelector("#sideSummary");
  if (!sideSummary) return;

  sideSummary.classList.add("has-data");
  sideSummary.innerHTML = `
    <div class="side-summary-item">
      <span>Mulank</span>
      <span>${reading.mulankMaster || reading.mulank}</span>
    </div>
    <div class="side-summary-item">
      <span>Bhagyank</span>
      <span>${reading.bhagyankMaster || reading.bhagyank}</span>
    </div>
    <div class="side-summary-item">
      <span>Cycle</span>
      <span>${temporal.personalYear.value}</span>
    </div>
    <div class="side-summary-item">
      <span>Luck</span>
      <span>${temporal.personalDay.score}%</span>
    </div>
  `;
}
