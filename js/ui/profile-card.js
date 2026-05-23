/**
 * Module for creating and exporting a shareable Numerology Profile Card.
 * Uses html2canvas to capture a custom, isolated HTML node.
 */

import { getMulankBlueprintHTML } from './render.js';

// Function to format date nicely
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export async function exportProfileCard(reading) {
  if (!reading) return;

  // 1. Ensure html2canvas is loaded
  if (typeof html2canvas === 'undefined') {
    alert("Export library is loading, please try again in a moment.");
    return;
  }

  // 2. Create the isolated DOM node off-screen
  const cardContainer = document.createElement('div');
  cardContainer.className = 'share-card-container';
  cardContainer.style.position = 'absolute';
  cardContainer.style.left = '-9999px';
  cardContainer.style.top = '-9999px';
  cardContainer.style.width = '800px'; // Fixed width for consistent export
  cardContainer.style.background = '#0a0814';
  cardContainer.style.padding = '40px';
  cardContainer.style.color = '#fff';
  cardContainer.style.webkitPrintColorAdjust = 'exact';
  cardContainer.style.printColorAdjust = 'exact';

  const mulankNumber = reading.mulankMaster || reading.mulank;
  const blueprintContent = getMulankBlueprintHTML(mulankNumber, reading);
  
  // Create the exact visual structure for the shareable image
  cardContainer.innerHTML = `
    <div id="export-card-target" class="shareable-profile-card-v2">
      <div class="spc-user-overlay">
        <div class="spc-user-brand">
          <div class="spc-logo">7</div>
          <h4 class="spc-brand">Numerology Hub</h4>
        </div>
        <div class="spc-user-info">
          <h2 class="spc-name">${reading.name}</h2>
          <p class="spc-dob">${formatDate(reading.birthDate)}</p>
        </div>
      </div>
      
      <div class="spc-content-wrapper">
        ${blueprintContent}
      </div>
      
      <div class="spc-footer-v2">
        <p>Discover your unique numbers at <strong>numerologyhub.com</strong></p>
      </div>
    </div>
  `;
  
  document.body.appendChild(cardContainer);

  const targetNode = document.getElementById('export-card-target');

  try {
    // 3. Render node to canvas
    const canvas = await html2canvas(targetNode, {
      backgroundColor: '#0a0814', // Deep cosmic background color
      scale: 2, // High resolution for Retina displays / sharp social sharing
      logging: false,
      useCORS: true
    });
    
    // 4. Convert canvas to Image URL
    const image = canvas.toDataURL("image/png");
    
    // 5. Trigger native share or download
    const fileName = `${reading.name.replace(/\s+/g, '-').toLowerCase()}-numerology-profile.png`;

    if (navigator.share && navigator.canShare) {
      // Convert DataURL to File object for native sharing on Mobile
      const res = await fetch(image);
      const blob = await res.blob();
      const file = new File([blob], fileName, { type: 'image/png' });
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Numerology Profile',
          text: 'Check out my core numerology profile!'
        });
      } else {
        triggerDownload(image, fileName);
      }
    } else {
      // Fallback for Desktop
      triggerDownload(image, fileName);
    }
  } catch (error) {
    console.error("Failed to export profile card:", error);
    alert("Could not generate the image. Please try again.");
  } finally {
    // 6. Cleanup DOM
    document.body.removeChild(cardContainer);
  }
}

function triggerDownload(dataUrl, fileName) {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
