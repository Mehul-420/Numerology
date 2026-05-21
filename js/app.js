import { calculateReading, normalizeReading, calculateLoShuGrid } from './core/calculations.js';
import { 
  renderReading, 
  openChallengeDrawer, 
  openMulankDrawer, 
  openLoShuDrawer, 
  positionActiveTooltip,
  renderValidatorResult
} from './ui/render.js';
import { initTheme, toggleTheme } from './ui/theme.js';
import { generateNameSuggestions } from './optimization/suggestion-engine.js';
import { runFullAnalysis } from './analysis/analysis-engine.js';
import { validateManualMutation } from './validator/mutation-validator.js';
import { storageKey } from './utils/constants.js';
import { formatDate } from './utils/helpers.js';

const form = document.querySelector("#readingForm");
const historyList = document.querySelector("#historyList");
const historyCount = document.querySelector("#historyCount");
const clearHistoryButton = document.querySelector("#clearHistory");
const resultsPanel = document.querySelector("#results");
const themeToggle = document.querySelector("#themeToggle");

// Initialize theme immediately
initTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

function getHistory() {
  try {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveReading(reading) {
  try {
    const history = getHistory();
    const nextHistory = [reading, ...history.filter((item) => item.id !== reading.id)].slice(0, 6);
    localStorage.setItem(storageKey, JSON.stringify(nextHistory));
    renderHistory();
  } catch (e) {}
}

function renderHistory() {
  const history = getHistory();
  if (historyCount) historyCount.textContent = history.length;
  if (!historyList) return;

  if (!history.length) {
    historyList.innerHTML = `<p class="intro-copy">No saved readings yet.</p>`;
    return;
  }

  historyList.innerHTML = history.map((item) => `
    <button class="history-item" type="button" data-id="${item.id}">
      <h3>${item.name}</h3>
      <p>${formatDate(item.birthDate)} &middot; Mulank ${item.mulank} &middot; Kua ${item.kua}</p>
    </button>
  `).join("");
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const firstName = (formData.get("firstName") || "").trim();
    const middleName = (formData.get("middleName") || "").trim();
    const lastName = (formData.get("lastName") || "").trim();
    const fullName = `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ').trim();
    
    if (!formData.get("birthDate") || !firstName) return;

    form.classList.add("is-processing");
    const submitBtn = form.querySelector("button[type='submit']");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Decoding vibrations...";

    setTimeout(() => {
      const reading = calculateReading(fullName, formData.get("birthDate"), formData.get("gender"));
      const { suggestions } = generateNameSuggestions(reading);
      renderReading(reading, suggestions);
      saveReading(reading);

      form.classList.remove("is-processing");
      submitBtn.textContent = originalText;
      resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
  });
}

if (historyList) {
  historyList.addEventListener("click", (event) => {
    const item = event.target.closest(".history-item");
    if (!item) return;
    const history = getHistory();
    const reading = normalizeReading(history.find((h) => h.id === item.dataset.id));
    if (reading) {
      const { suggestions } = generateNameSuggestions(reading);
      renderReading(reading, suggestions);
    }
  });
}

/**
 * Handle All Clicks & Transitions in Results Panel
 */
function handleInteraction(event) {
  const target = event.target;
  const type = event.type;

  // We only need to handle CLICKS now. 
  // Tooltips are handled natively by CSS :hover + positionActiveTooltip on window events.
  if (type !== "click") return;

  // 1. Validator Analysis Trigger
  if (target.id === "analyzeVariantBtn") {
    const input = document.querySelector("#customVariantInput");
    const titleEl = document.querySelector(".reading-header h2");
    if (input && titleEl) {
      const history = getHistory();
      const reading = history.find(r => r.name === titleEl.textContent);
      if (reading) {
        const analysis = runFullAnalysis(reading);
        const report = validateManualMutation(reading.name, input.value, analysis);
        const resultContainer = document.querySelector("#validatorResult");
        if (report && resultContainer) {
          resultContainer.innerHTML = renderValidatorResult(report);
        }
      }
    }
    return;
  }

  // 2. Challenge Phase Buttons
  const challengeItem = target.closest(".challenge-mini-item");
  if (challengeItem) {
    openChallengeDrawer(challengeItem.dataset.phase, challengeItem.dataset.number);
    return;
  }

  // 3. View Profile (Mulank)
  const energyCTA = target.closest(".energy-profile-cta");
  if (energyCTA) {
    openMulankDrawer(energyCTA.dataset.number);
    return;
  }

  // 4. Lo Shu Chart Interaction
  const loshuGrid = target.closest(".loshu-grid");
  if (loshuGrid) {
    const titleEl = document.querySelector(".reading-header h2");
    if (titleEl) {
       const history = getHistory();
       const reading = history.find(r => r.name === titleEl.textContent);
       if (reading) {
         const counts = calculateLoShuGrid(reading.birthDate, reading.mulank, reading.bhagyank, reading.kua, reading.nameNumber);
         openLoShuDrawer(counts);
       }
    }
    return;
  }

  // 5. Progressive Disclosure (Accordion)
  const disclosureTrigger = target.closest(".disclosure-trigger");
  if (disclosureTrigger) {
    const section = disclosureTrigger.closest(".disclosure-section");
    section.classList.toggle("is-open");
    return;
  }

  // 6. Name Suggestion Card Expansion
  const cardTrigger = target.closest("[data-action='expand-card']");
  if (cardTrigger) {
    cardTrigger.classList.toggle("is-expanded");
    return;
  }
}

if (resultsPanel) {
  resultsPanel.addEventListener("click", handleInteraction);
  resultsPanel.addEventListener("pointerover", (event) => {
    if (event.target.closest(".info-wrapper, .badge-wrapper")) {
      positionActiveTooltip();
    }
  });
  resultsPanel.addEventListener("focusin", (event) => {
    if (event.target.closest(".info-wrapper, .badge-wrapper")) {
      positionActiveTooltip();
    }
  });
  resultsPanel.addEventListener("pointerout", (event) => {
    const wrapper = event.target.closest(".badge-wrapper");
    if (!wrapper || wrapper.contains(event.relatedTarget)) return;
    const focusedBadge = wrapper.querySelector(".master-badge:focus, .karmic-badge:focus");
    if (focusedBadge) focusedBadge.blur();
  });
}

/**
 * Performance: Dynamic Clamping for active tooltips
 */
let throttleT;
function throttledPositionActiveTooltip() {
  if (throttleT) return;
  throttleT = setTimeout(() => {
    positionActiveTooltip();
    throttleT = null;
  }, 60); // Faster response for smooth movement
}

window.addEventListener("resize", throttledPositionActiveTooltip);
window.addEventListener("scroll", throttledPositionActiveTooltip, true);

// Global hover check to trigger clamping immediately when mouse moves
window.addEventListener("pointerover", (e) => {
  if (e.target.closest(".info-wrapper, .badge-wrapper")) {
    positionActiveTooltip();
  }
});

document.addEventListener("pointerdown", (event) => {
  if (!event.target.closest(".badge-wrapper")) {
    const focusedBadge = document.querySelector(".master-badge:focus, .karmic-badge:focus");
    if (focusedBadge) focusedBadge.blur();
  }
});

if (clearHistoryButton) {
  clearHistoryButton.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    renderHistory();
  });
}

renderHistory();
