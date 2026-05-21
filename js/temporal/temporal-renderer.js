/**
 * Renders the temporal cycles section.
 */
export function renderTemporalCycles(analysis) {
  const cycles = [
    { label: "Personal Year", data: analysis.personalYear },
    { label: "Personal Month", data: analysis.personalMonth },
    { label: "Personal Day", data: analysis.personalDay }
  ];

  return `
    <div class="temporal-grid">
      ${cycles.map(c => `
        <div class="temporal-card ${c.data.favorability.color}">
          <div class="temporal-card-header">
            <small>${c.label}</small>
            <span class="cycle-value">${c.data.value}</span>
          </div>
          <div class="favorability-badge">
            <strong>${c.data.favorability.label}</strong>
            <span>Score: ${c.data.score}</span>
          </div>
          <p class="cycle-insight">${c.data.insight}</p>
        </div>
      `).join("")}
    </div>

    ${analysis.recommendations.length > 0 ? `
      <div class="temporal-recs" style="margin-top:1.5rem; padding:1.25rem; background:var(--card-bg); border-radius:0.75rem; border:0.0625rem solid var(--card-border);">
        <h4 style="margin:0 0 0.75rem; font-size:0.85rem; text-transform:uppercase; color:var(--accent-primary);">Strategic Guidance</h4>
        <ul style="margin:0; padding-left:1.25rem; display:grid; gap:0.5rem;">
          ${analysis.recommendations.map(r => `<li style="font-size:0.9rem; color:var(--text-muted);">${r}</li>`).join("")}
        </ul>
      </div>
    ` : ""}
  `;
}
