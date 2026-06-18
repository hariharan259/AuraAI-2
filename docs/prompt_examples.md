# AuraAI — Multi-Agent Prompt Examples

This document provides concrete, end-to-end examples of the inputs (rendered in our XML prompt format) and corresponding output structures for the core agents.

---

## 1. Dermatologist Agent Example

### XML Input Rendered to LLM:
```xml
<system_context>
You are the Dermatologist Agent in the AuraAI multi-agent skincare platform. Your task is to analyze user profile metrics and skin photos to diagnose concerns and compute score ratings.
</system_context>
<execution_rules>
- Respond STRICTLY in structured JSON format matching the schema instructions.
- Do NOT output conversational text, preambles, or markdown blocks outside the JSON payload.
</execution_rules>
<user_profile>
Skin Type: oily
Age: 24
Daily Sleep: 6 hours
Water Intake: 5 glasses
Stress Level: 7/10
Diet Quality: 6/10
</user_profile>
<diagnostic_task>
Execute diagnostics for Acne, Pigmentation, Redness, and Oiliness. Compute scores and root causes.
</diagnostic_task>
```

### JSON Output Payload:
```json
{
  "overallScore": 71,
  "acneScore": 64,
  "pigmentationScore": 76,
  "rednessScore": 73,
  "oilinessScore": 70,
  "concerns": [
    { "id": "acne", "label": "Active Acne", "severity": "Moderate" }
  ],
  "rootCauses": [
    "Elevated stress triggering sebum overproduction",
    "Dehydration impairing skin barrier function"
  ],
  "confidenceScore": 87
}
```

---

## 2. Ingredient Scientist Agent Example

### XML Input Rendered to LLM:
```xml
<system_context>
You are the Ingredient Scientist Agent. You receive the diagnostic reports from the Dermatologist and Trichologist agents, map them against the ingredient database, and formulate a customized active serum.
</system_context>
<execution_rules>
- Map concerns to specific active compounds.
- Highlight conflicts and risk factors.
- Design a custom compound ratio code.
</execution_rules>
<diagnostics>
Skin Score: 71 (Concerns: [{"id":"acne","label":"Active Acne","severity":"Moderate"}])
Hair Score: 74 (Concerns: [])
Skin Type: oily
</diagnostics>
<synthesis_task>
Formulate custom active serum, assign formulation code, and calculate compounding ratios.
</synthesis_task>
```

### JSON Output Payload:
```json
{
  "recommendations": [
    {
      "id": "salicylicAcid",
      "name": "Salicylic Acid",
      "type": "Active BHA",
      "description": "Exfoliates pore linings, dissolves oil buildup, and reduces active acne lesions."
    },
    {
      "id": "niacinamide",
      "name": "Niacinamide",
      "type": "Vitamin B3",
      "description": "Regulates sebum production, strengthens barrier lipid layers, and reduces redness."
    }
  ],
  "interactions": [],
  "risks": [],
  "customFormula": {
    "name": "AuraAI Custom Serum AURA-24OI-842",
    "base": "Water-Gel",
    "compounds": [
      { "name": "Salicylic Acid", "percentage": "2.0%" },
      { "name": "Niacinamide", "percentage": "4.0%" }
    ]
  }
}
```
