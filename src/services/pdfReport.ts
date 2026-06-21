import { AnalysisResultPayload } from '../context/AuraContext';

export function exportAnalysisToPDF(result: AnalysisResultPayload) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download the PDF report.');
    return;
  }

  const { profile, skinHealth, skinTwin, forecast, routine, products, beautyScore, lifestyleScore, skinPassportId, timestamp } = result;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>AuraAI Clinical Dermatology Report - ${skinPassportId}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #1e293b;
          line-height: 1.5;
          margin: 0;
          padding: 40px;
          background-color: #ffffff;
        }
        .header {
          border-bottom: 2px solid #0d9488;
          padding-bottom: 20px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header h1 {
          color: #0d9488;
          margin: 0;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .header .meta {
          text-align: right;
          font-size: 11px;
          color: #64748b;
        }
        .passport-tag {
          background-color: #f0fdfa;
          color: #0f766e;
          border: 1px solid #99f6e4;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
          font-weight: bold;
          font-size: 12px;
          display: inline-block;
          margin-top: 5px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #0f766e;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 6px;
          margin-top: 25px;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .grid-2 {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 20px;
        }
        .profile-card, .score-card {
          background-color: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
          padding: 15px;
        }
        .profile-card table {
          width: 100%;
          border-collapse: collapse;
        }
        .profile-card td {
          padding: 5px 0;
          font-size: 13px;
        }
        .profile-card td.label {
          color: #64748b;
          font-weight: 500;
          width: 40%;
        }
        .profile-card td.val {
          font-weight: bold;
          color: #0f172a;
        }
        .score-value {
          font-size: 44px;
          font-weight: 800;
          color: #0d9488;
          line-height: 1;
        }
        .score-desc {
          font-size: 11px;
          color: #64748b;
          margin-top: 5px;
        }
        .twin-box {
          background-color: #f0fdfa;
          border-left: 4px solid #0d9488;
          padding: 12px 15px;
          font-size: 13px;
          margin-bottom: 15px;
          font-style: italic;
        }
        .table-list {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .table-list th {
          background-color: #f1f5f9;
          color: #475569;
          font-weight: bold;
          text-align: left;
          padding: 10px;
          font-size: 12px;
          border-bottom: 1px solid #e2e8f0;
        }
        .table-list td {
          padding: 10px;
          font-size: 12px;
          border-bottom: 1px solid #f1f5f9;
        }
        .table-list td.bold {
          font-weight: bold;
        }
        .badge {
          display: inline-block;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .badge-mild { background-color: #fef3c7; color: #d97706; }
        .badge-mod { background-color: #ffedd5; color: #ea580c; }
        .badge-severe { background-color: #fee2e2; color: #dc2626; }
        
        .footer {
          margin-top: 50px;
          border-top: 1px solid #e2e8f0;
          padding-top: 15px;
          text-align: center;
          font-size: 11px;
          color: #94a3b8;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      
      <!-- Report Header -->
      <div class="header">
        <div>
          <h1>AuraAI Dermatology Intelligence</h1>
          <span class="passport-tag">Skin Passport ID: ${skinPassportId}</span>
        </div>
        <div class="meta">
          <strong>Report Generated:</strong> ${timestamp}<br/>
          <strong>Clinical Version:</strong> v2.4.0 (Medical-Grade Mock)<br/>
          <button class="no-print" onclick="window.print()" style="margin-top: 10px; padding: 6px 12px; background: #0d9488; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
            Print / Save PDF
          </button>
        </div>
      </div>

      <!-- Core Details Grid -->
      <div class="grid-2">
        <div class="profile-card">
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 10px; color: #0d9488;">User Bio-Profile</div>
          <table>
            <tr>
              <td class="label">Patient Name:</td>
              <td class="val">${profile.name}</td>
            </tr>
            <tr>
              <td class="label">Age:</td>
              <td class="val">${profile.age}</td>
            </tr>
            <tr>
              <td class="label">Skin Type:</td>
              <td class="val" style="text-transform: capitalize;">${profile.skinType}</td>
            </tr>
            <tr>
              <td class="label">Primary Goals:</td>
              <td class="val">${profile.goals.join(', ')}</td>
            </tr>
          </table>
        </div>

        <div class="score-card">
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 10px; color: #0d9488;">Dermatological Scores</div>
          <div style="display: flex; gap: 30px; align-items: center;">
            <div>
              <span class="score-value">${beautyScore}</span>
              <div class="score-desc">Overall Skin Index</div>
            </div>
            <div>
              <span class="score-value" style="color: #06b6d4;">${skinHealth.hydrationScore}</span>
              <div class="score-desc">Hydration Index</div>
            </div>
            <div>
              <span class="score-value" style="color: #ef4444;">${skinHealth.acneRiskScore}</span>
              <div class="score-desc">Acne Risk Index</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skin Twin -->
      <div class="section-title">Digital Skin Twin Indicators</div>
      <div class="twin-box">
        "${skinTwin.currentSummary}"
      </div>

      <!-- Measurements Table -->
      <div class="section-title">Epidermal Metric Readings</div>
      <table class="table-list">
        <thead>
          <tr>
            <th>Condition Index</th>
            <th>Value (0-100)</th>
            <th>Status</th>
            <th>Condition Index</th>
            <th>Value (0-100)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="bold">Acne Clearness</td>
            <td>${skinHealth.measurements.acne}</td>
            <td>${skinHealth.measurements.acne >= 75 ? 'Optimal' : skinHealth.measurements.acne < 60 ? 'Concern' : 'Risk'}</td>
            <td class="bold">Pores Visibility</td>
            <td>${skinHealth.measurements.poreVisibility}</td>
            <td>${skinHealth.measurements.poreVisibility >= 75 ? 'Optimal' : skinHealth.measurements.poreVisibility < 60 ? 'Concern' : 'Risk'}</td>
          </tr>
          <tr>
            <td class="bold">Melanin Pigmentation</td>
            <td>${skinHealth.measurements.pigmentation}</td>
            <td>${skinHealth.measurements.pigmentation >= 75 ? 'Optimal' : skinHealth.measurements.pigmentation < 60 ? 'Concern' : 'Risk'}</td>
            <td class="bold">Vascular Redness</td>
            <td>${skinHealth.measurements.redness}</td>
            <td>${skinHealth.measurements.redness >= 75 ? 'Optimal' : skinHealth.measurements.redness < 60 ? 'Concern' : 'Risk'}</td>
          </tr>
          <tr>
            <td class="bold">Stratum Hydration</td>
            <td>${skinHealth.measurements.dryness}</td>
            <td>${skinHealth.measurements.dryness >= 75 ? 'Optimal' : skinHealth.measurements.dryness < 60 ? 'Concern' : 'Risk'}</td>
            <td class="bold">Wrinkles & Elasticity</td>
            <td>${skinHealth.measurements.wrinkles}</td>
            <td>${skinHealth.measurements.wrinkles >= 75 ? 'Optimal' : skinHealth.measurements.wrinkles < 60 ? 'Concern' : 'Risk'}</td>
          </tr>
        </tbody>
      </table>

      <!-- Product Recommendations -->
      <div class="section-title">AI Product Prescription</div>
      <table class="table-list">
        <thead>
          <tr>
            <th>Category</th>
            <th>Product Name</th>
            <th>Brand</th>
            <th>Key Actives</th>
            <th>Clinical Reason</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td class="bold">${p.category}</td>
              <td>${p.name}</td>
              <td>${p.brand}</td>
              <td>${p.keyIngredients.join(', ')}</td>
              <td>${p.reason}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Routine schedule -->
      <div class="section-title">Personalized Morning Routine</div>
      <table class="table-list">
        <thead>
          <tr>
            <th>Step</th>
            <th>Product Type</th>
            <th>Application Details</th>
            <th>Clinical Purpose</th>
          </tr>
        </thead>
        <tbody>
          ${routine.morning.map(r => `
            <tr>
              <td>Step ${r.step}</td>
              <td class="bold">${r.productType}</td>
              <td>${r.product} (${r.duration})</td>
              <td>${r.why}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- 30-Day Projections -->
      <div class="section-title">30-Day Trajectory Forecast</div>
      <table class="table-list">
        <thead>
          <tr>
            <th>Time Marker</th>
            <th>Overall Skin Score</th>
            <th>Acne Reduction (%)</th>
            <th>Hydration Increase (%)</th>
            <th>Pigmentation Fading (%)</th>
          </tr>
        </thead>
        <tbody>
          ${forecast.map((f: any) => `
            <tr>
              <td class="bold">Day ${f.day}</td>
              <td>${f.overallScore}</td>
              <td>${f.acneReductionPct}%</td>
              <td>+${f.hydrationImprovementPct}%</td>
              <td>+${f.pigmentationImprovementPct}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Report Footer -->
      <div class="footer">
        AuraAI Dermatology Intelligence Platform • Hackathon Presentation Edition • Confidential Medical Mock-Up
      </div>

    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
