import { calculateReading, normalizeReading, calculateLoShuGrid } from './core/calculations.js';
import { 
  renderReading, 
  openChallengeDrawer, 
  openMulankDrawer, 
  openKarmicDrawer,
  openLoShuDrawer, 
  positionActiveTooltip,
  renderValidatorResult
} from './ui/render.js';
import { generateNameSuggestions } from './optimization/suggestion-engine.js';
import { validateManualMutation } from './validator/mutation-validator.js';
import { runFullAnalysis } from './analysis/analysis-engine.js';
import { initTheme, toggleTheme } from './ui/theme.js';
import { formatDate } from './utils/helpers.js';
import { storageKey } from './utils/constants.js';
import { exportProfileCard } from './ui/profile-card.js';

const form = document.querySelector("#readingForm");
const historyList = document.querySelector("#historyList");
const historyCount = document.querySelector("#historyCount");
const clearHistoryButton = document.querySelector("#clearHistory");
const resultsPanel = document.querySelector("#results");
const themeToggle = document.querySelector("#themeToggle");
const mainWorkspace = document.querySelector(".main-workspace");
const historyPanel = document.querySelector(".history-panel");
const inputSidebar = document.querySelector(".input-sidebar");

// Global state for active analysis
let activeReading = null;

// Initialize theme immediately
initTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

/**
 * Navigation / View Management
 */
function showHome() {
  document.body.classList.remove("view-results");
  document.body.classList.add("view-home");
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showResults() {
  document.body.classList.remove("view-home");
  document.body.classList.add("view-results");
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // Filter out existing entries with the same ID OR the same Name + BirthDate combination
    const nextHistory = [
      reading,
      ...history.filter(
        (item) =>
          item.id !== reading.id &&
          !(item.name === reading.name && item.birthDate === reading.birthDate)
      ),
    ].slice(0, 6);
    localStorage.setItem(storageKey, JSON.stringify(nextHistory));
    renderHistory();
  } catch (e) {}
}

function deleteHistoryItem(id) {
  try {
    const history = getHistory();
    const nextHistory = history.filter((item) => item.id !== id);
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
    <div class="history-item" data-id="${item.id}">
      <div class="history-item-content">
        <h3>${item.name}</h3>
        <p>${formatDate(item.birthDate)} &middot; Mulank ${item.mulank} &middot; Kua ${item.kua}</p>
      </div>
      <button class="delete-history-item" type="button" data-id="${item.id}" aria-label="Remove reading">
        &times;
      </button>
    </div>
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
      
      // Set active state
      activeReading = reading;
      
      renderReading(reading, suggestions);
      saveReading(reading);

      form.classList.remove("is-processing");
      submitBtn.textContent = originalText;
      showResults();
    }, 600);
  });
}

if (historyList) {
  historyList.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest(".delete-history-item");
    if (deleteBtn) {
      event.stopPropagation();
      deleteHistoryItem(deleteBtn.dataset.id);
      return;
    }

    const item = event.target.closest(".history-item");
    if (!item) return;
    const history = getHistory();
    const entry = history.find((h) => h.id === item.dataset.id);
    if (entry) {
      const reading = normalizeReading(entry);
      const { suggestions } = generateNameSuggestions(reading);
      
      // Populate form fields for editing
      const names = entry.name.split(' ');
      if (names.length >= 2) {
        document.querySelector("#firstName").value = names[0];
        document.querySelector("#lastName").value = names[names.length - 1];
        document.querySelector("#middleName").value = names.slice(1, -1).join(' ');
      } else {
        document.querySelector("#firstName").value = entry.name;
      }
      document.querySelector("#birthDate").value = entry.birthDate;
      if (entry.gender) {
        const genderInput = document.querySelector(`input[name="gender"][value="${entry.gender}"]`);
        if (genderInput) genderInput.checked = true;
      }

      // Set active state
      activeReading = reading;

      renderReading(reading, suggestions);
      showHome(); // Scroll to form as requested
    }
  });
}

/**
 * Handle All Clicks & Transitions in Results Panel
 */
function handleInteraction(event) {
  const target = event.target;
  const type = event.type;

  // 0. Back to Home / Brand Click (Reload for fresh state as requested)
  if (target.closest(".nav-brand") || target.id === "backToHomeBtn" || target.closest("#backToHomeBtn")) {
    window.location.reload();
    return;
  }

  // We only need to handle CLICKS now. 
  if (type !== "click") return;

  // 1.5 Number Grid / Lo Shu
  const gridTrigger = target.closest(".dashboard-number-grid");
  if (gridTrigger) {
    if (activeReading) {
      const counts = calculateLoShuGrid(activeReading.birthDate, activeReading.mulank, activeReading.bhagyank, activeReading.kua, activeReading.nameNumber);
      openLoShuDrawer(counts);
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
    openMulankDrawer(energyCTA.dataset.number, activeReading);
    return;
  }

  // 3.6 Special Badges (Master/Karmic)
  const specialBadge = target.closest(".special-badge");
  if (specialBadge) {
    const { type, number } = specialBadge.dataset;
    if (type === "master") {
      openMulankDrawer(number, activeReading);
    } else if (type === "karmic") {
      openKarmicDrawer(number);
    }
    return;
  }

  // 3.5 Share Profile
  const shareCTA = target.closest(".share-profile-cta");
  if (shareCTA) {
    if (activeReading) {
      exportProfileCard(activeReading);
    }
    return;
  }

  // 4. Manual Validator logic
  const analyzeBtn = target.closest("#analyzeVariantBtn");
  if (analyzeBtn) {
    const input = document.querySelector("#customVariantInput");
    if (input && input.value && activeReading) {
      const analysis = runFullAnalysis(activeReading);
      const report = validateManualMutation(activeReading.name, input.value, analysis);
      const resultContainer = document.querySelector("#validatorResult");
      if (report && resultContainer) {
        resultContainer.innerHTML = renderValidatorResult(report);
      }
    }
    return;
  }

  // 5. Suggestions Accordion (Card Expansion)
  const suggestionCard = target.closest(".suggestion-card");
  if (suggestionCard) {
    suggestionCard.classList.toggle("is-expanded");
    return;
  }

  // 6. Disclosure triggers (Accordion)
  const disclosureTrigger = target.closest(".disclosure-trigger");
  if (disclosureTrigger) {
    const section = disclosureTrigger.closest(".disclosure-section");
    section.classList.toggle("is-open");
    return;
  }
}

// Global Interaction Handler
document.addEventListener("click", handleInteraction);

renderHistory();
