import { SkincareRoutineItem } from '../types';

export interface RoutineTemplate {
  morning: SkincareRoutineItem[];
  night: SkincareRoutineItem[];
  weekly: Array<{ day: string; treatment: string; product: string; duration: string; why: string }>;
  monthly: Array<{ cycle: string; treatment: string; product: string; why: string }>;
}

export const ROUTINE_TEMPLATES: Record<string, RoutineTemplate> = {
  normal: {
    morning: [
      { step: 1, productType: 'Cleanser', product: 'Gentle Foam Cleanser', duration: '60 sec', why: 'Removes overnight sebum without stripping skin barrier', tip: 'Use lukewarm water — hot water damages the lipid barrier' },
      { step: 2, productType: 'Toner', product: 'Alcohol-Free Toner', duration: '30 sec', why: 'Balances pH and preps skin for actives', tip: 'Pat gently — do not rub to avoid micro-tears' },
      { step: 3, productType: 'Serum', product: 'Vitamin C Serum (15%)', duration: '60 sec', why: 'Antioxidant protection against UV and free radicals', tip: 'Wait 5 min before next step for full absorption' },
      { step: 4, productType: 'Serum', product: 'Niacinamide Serum (5%)', duration: '30 sec', why: 'Controls sebum, brightens, reduces pore appearance', tip: 'Layer on top of Vitamin C after absorption' },
      { step: 5, productType: 'Moisturizer', product: 'Lightweight Moisturizer', duration: '30 sec', why: 'Seals in actives and maintains hydration', tip: 'Choose a formula with hyaluronic acid for dewy finish' },
      { step: 6, productType: 'Sunscreen', product: 'Broad Spectrum SPF 50+', duration: '60 sec', why: 'Non-negotiable UV protection — prevents photoaging and pigmentation', tip: 'Apply 15 min before sun exposure; reapply every 2 hours' },
    ],
    night: [
      { step: 1, productType: 'Cleanser', product: 'Double Cleanse (Oil + Foam)', duration: '3 min', why: 'Removes sunscreen, makeup, and day pollutants', tip: 'Start with oil cleanser to dissolve sunscreen effectively' },
      { step: 2, productType: 'Treatment', product: 'Exfoliating Toner (AHA, 2x/week)', duration: '30 sec', why: 'Accelerates cell turnover for brighter skin', tip: 'Skip on retinol nights to prevent over-exfoliation' },
      { step: 3, productType: 'Treatment', product: 'Retinol Serum (0.025–0.1%)', duration: '60 sec', why: 'Stimulates collagen synthesis during skin\'s repair cycle', tip: 'Start 2x/week; build up gradually over 8 weeks' },
      { step: 4, productType: 'Moisturizer', product: 'Peptide Moisturizer', duration: '30 sec', why: 'Supports retinol-boosted collagen production', tip: 'Peptides and retinol are excellent nighttime companions' },
      { step: 5, productType: 'Moisturizer', product: 'Overnight Sleeping Mask', duration: '30 sec', why: 'Intensive moisture repair while you sleep', tip: 'Apply as last step; do not rinse until morning' },
    ],
    weekly: [
      { day: 'Tuesday', treatment: 'Chemical Exfoliation', product: 'AHA Exfoliant (Glycolic 7%)', duration: '15 min', why: 'Weekly surface renewal for glow and texture improvement' },
      { day: 'Thursday', treatment: 'Face Mask', product: 'Brightening Vitamin C Mask', duration: '20 min', why: 'Concentrated brightening treatment for radiance boost' },
      { day: 'Saturday', treatment: 'Pore Treatment', product: 'Clay Mask (Kaolin)', duration: '10 min', why: 'Deep pore cleansing and excess oil absorption' },
      { day: 'Sunday', treatment: 'Massage', product: 'Jade Gua Sha + Facial Oil', duration: '10 min', why: 'Boosts lymphatic drainage, reduces puffiness, sculpts face' },
    ],
    monthly: [
      { cycle: 'End of Month', treatment: 'Professional Facial', product: 'Enzyme Peel Facial', why: 'Deep cellular exfoliation and micro-circulation enhancement' }
    ]
  },
  oily: {
    morning: [
      { step: 1, productType: 'Cleanser', product: 'Salicylic Acid Cleanser (1%)', duration: '90 sec', why: 'Deep-cleans pores, controls morning oiliness', tip: 'Massage in circular motions for 60 seconds' },
      { step: 2, productType: 'Toner', product: 'Oil-Control Toner (Witch Hazel)', duration: '30 sec', why: 'Tightens pores, removes residual impurities', tip: 'Refrigerate toner for extra pore-tightening effect' },
      { step: 3, productType: 'Serum', product: 'Vitamin C Serum (10%)', duration: '60 sec', why: 'Protects against oxidative stress that worsens oily skin', tip: 'Lighter concentration for oily skin to avoid congestion' },
      { step: 4, productType: 'Serum', product: 'Niacinamide Serum (10%)', duration: '30 sec', why: 'Significantly reduces sebum production at 10%', tip: 'Key ingredient — don\'t skip this step' },
      { step: 5, productType: 'Moisturizer', product: 'Oil-Free Gel Moisturizer', duration: '30 sec', why: 'Hydrates without clogging pores', tip: 'Even oily skin needs moisture — skipping causes rebound oil' },
      { step: 6, productType: 'Sunscreen', product: 'Mattifying SPF 50 (Oil-Free)', duration: '60 sec', why: 'UV protection without adding shine', tip: 'Press — don\'t rub — to avoid pilling' },
    ],
    night: [
      { step: 1, productType: 'Cleanser', product: 'Micellar + Salicylic Acid Cleanser', duration: '3 min', why: 'Thorough removal of sebum, SPF, and environmental debris', tip: 'Double cleanse is essential even for oily skin types' },
      { step: 2, productType: 'Treatment', product: 'BHA Exfoliant (1%, 3x/week)', duration: '30 sec', why: 'Keeps pores cleared overnight while skin repairs', tip: 'Leave on — do not rinse (leave-on formulas are most effective)' },
      { step: 3, productType: 'Treatment', product: 'Azelaic Acid Serum (10%)', duration: '60 sec', why: 'Anti-acne, anti-pigmentation, anti-inflammatory', tip: 'Safe to use nightly; excellent for oily, acne-prone skin' },
      { step: 4, productType: 'Treatment', product: 'Retinol (0.5%) — 3x/week', duration: '60 sec', why: 'Cell renewal to prevent future acne and dark spots', tip: 'Alternate nights with BHA exfoliant' },
      { step: 5, productType: 'Moisturizer', product: 'Oil-Free Night Gel', duration: '30 sec', why: 'Non-comedogenic hydration without adding shine', tip: 'Lightweight formula lets skin breathe overnight' },
    ],
    weekly: [
      { day: 'Monday', treatment: 'BHA Peel', product: 'Salicylic Acid 2% Exfoliant', duration: '20 min', why: 'Deep pore exfoliation to prevent clogged pores' },
      { day: 'Wednesday', treatment: 'Clay Mask', product: 'Bentonite Clay Mask', duration: '15 min', why: 'Absorbs excess sebum and tightens enlarged pores' },
      { day: 'Friday', treatment: 'Sheet Mask', product: 'Niacinamide + Centella Sheet Mask', duration: '20 min', why: 'Oil control + soothing inflammation mid-week refresh' },
      { day: 'Sunday', treatment: 'Scalp Treatment', product: 'Salicylic Scalp Serum', duration: '30 min', why: 'Oily scalp management alongside skin care' },
    ],
    monthly: [
      { cycle: 'Every 4 Weeks', treatment: 'Clarifying Peel', product: 'Salicylic Acid Peel (20%)', why: 'Dissolves deep follicular congestion and controls excessive sebaceous output' }
    ]
  },
  dry: {
    morning: [
      { step: 1, productType: 'Cleanser', product: 'Cream/Milk Cleanser', duration: '60 sec', why: 'Cleanses without stripping essential moisture', tip: 'Can cleanse with lukewarm water only in AM if very dry' },
      { step: 2, productType: 'Toner', product: 'Hydrating Essence', duration: '30 sec', why: 'Floods skin with humectants for deep hydration', tip: 'Apply on slightly damp skin for maximum absorption' },
      { step: 3, productType: 'Serum', product: 'Vitamin C Serum (10%) + Ferulic Acid', duration: '60 sec', why: 'Antioxidant protection; ferulic acid stabilizes and enhances', tip: 'Pat gently — avoid rubbing on dry, delicate skin' },
      { step: 4, productType: 'Serum', product: 'Hyaluronic Acid Serum (Multi-weight)', duration: '30 sec', why: 'Draws and holds moisture at multiple skin layers', tip: 'Apply on damp skin for best humectant effect' },
      { step: 5, productType: 'Moisturizer', product: 'Rich Moisturizing Cream', duration: '30 sec', why: 'Occlusive layer locks in all hydration', tip: 'For very dry skin, add a few drops of facial oil' },
      { step: 6, productType: 'Sunscreen', product: 'Hydrating SPF 50+', duration: '60 sec', why: 'UV protection with moisturizing ingredients', tip: 'Look for formulas with ceramides and glycerin' },
    ],
    night: [
      { step: 1, productType: 'Cleanser', product: 'Gentle Cream Cleanser', duration: '2 min', why: 'Cleanses without disrupting moisture balance overnight', tip: 'Avoid foam cleansers — they strip essential lipids' },
      { step: 2, productType: 'Toner', product: 'Hydrating Toner with Ceramides', duration: '30 sec', why: 'Immediate replenishment after cleansing', tip: 'Use several layers for maximum hydration (7-skin method)' },
      { step: 3, productType: 'Treatment', product: 'Retinol (0.025–0.05%) + Moisturizer Sandwich', duration: '90 sec', why: 'The sandwich method reduces retinol irritation on dry skin', tip: 'Moisturizer → Retinol → Moisturizer reduces sensitivity' },
      { step: 4, productType: 'Moisturizer', product: 'Overnight Rich Repair Cream', duration: '30 sec', why: 'Intensively repairs and replenishes during peak repair hours', tip: 'Look for: ceramides, shea butter, squalane, peptides' },
      { step: 5, productType: 'Moisturizer', product: 'Facial Oil (Squalane or Rosehip)', duration: '30 sec', why: 'Final occlusive seal to prevent transepidermal water loss', tip: 'Press into skin — do not rub' },
    ],
    weekly: [
      { day: 'Wednesday', treatment: 'Hydrating Mask', product: 'Hyaluronic Acid Sleeping Mask', duration: '20 min', why: 'Intense moisture surge mid-week for dry skin' },
      { day: 'Friday', treatment: 'Gentle Exfoliation', product: 'Lactic Acid 5% (gentle AHA)', duration: '15 min', why: 'Lactic acid exfoliates while hydrating — ideal for dry skin' },
      { day: 'Sunday', treatment: 'Oil Massage', product: 'Rosehip + Squalane Oil Blend', duration: '15 min', why: 'Intense nourishment and barrier repair for the week ahead' },
    ],
    monthly: [
      { cycle: 'Every 4 Weeks', treatment: 'Hydration Infusion', product: 'Polyhydroxy Acid (PHA) Gentle Peel', why: 'Gently dissolves dry flakes while reinforcing skin hydration levels' }
    ]
  },
  sensitive: {
    morning: [
      { step: 1, productType: 'Cleanser', product: 'Micellar Water Cleanser', duration: '60 sec', why: 'No-rinse option that avoids harsh surfactants', tip: 'Rinse with plain water after if preferred' },
      { step: 2, productType: 'Toner', product: 'Alcohol-Free Calming Toner', duration: '30 sec', why: 'Soothes and preps without irritating triggers', tip: 'Look for ingredients: centella, allantoin, panthenol' },
      { step: 3, productType: 'Serum', product: 'Centella Asiatica Serum', duration: '60 sec', why: 'Anti-inflammatory protection and barrier support', tip: 'Madecassoside-rich formula for maximum soothing' },
      { step: 4, productType: 'Moisturizer', product: 'Barrier Repair Moisturizer', duration: '30 sec', why: 'Ceramides and fatty acids restore compromised barrier', tip: 'Fragrance-free is non-negotiable for sensitive skin' },
      { step: 5, productType: 'Sunscreen', product: 'Mineral SPF 50 (Zinc Oxide)', duration: '60 sec', why: 'Physical SPF is gentler on reactive skin than chemical filters', tip: 'Zinc oxide also has anti-inflammatory benefits' },
    ],
    night: [
      { step: 1, productType: 'Cleanser', product: 'Gentle Cream Cleanser', duration: '2 min', why: 'Cleanses without triggering reactive skin', tip: 'Rinse with cool water to minimize redness' },
      { step: 2, productType: 'Toner', product: 'Calming Toner (Centella + Panthenol)', duration: '30 sec', why: 'Anti-inflammatory start to evening routine', tip: 'Build tolerance gradually before adding actives' },
      { step: 3, productType: 'Treatment', product: 'Gentle Retinoid (Retinyl Propionate) — 2x/week', duration: '60 sec', why: 'Gentler retinoid ester for sensitive skin anti-aging', tip: 'Gentler than retinol — better tolerated by reactive skin' },
      { step: 4, productType: 'Moisturizer', product: 'Barrier Cream (Ceramide + Cholesterol + Fatty Acids)', duration: '30 sec', why: 'Replicates skin\'s natural lipid ratio for repair', tip: '3:1:1 ceramide:cholesterol:fatty acid ratio is ideal' },
    ],
    weekly: [
      { day: 'Thursday', treatment: 'Soothing Mask', product: 'Centella + Aloe Calming Mask', duration: '20 min', why: 'Anti-inflammatory treatment to reset reactive skin' },
      { day: 'Sunday', treatment: 'Barrier Boost', product: 'Ceramide Sleeping Mask', duration: 'Overnight', why: 'Weekly intensive repair for compromised sensitive skin' },
    ],
    monthly: [
      { cycle: 'Every 4-6 Weeks', treatment: 'Barrier Restore Facial', product: 'Colloidal Oatmeal Masking', why: 'Calms dilated micro-capillaries and reduces chronic skin reactivity' }
    ]
  },
  combination: {
    morning: [
      { step: 1, productType: 'Cleanser', product: 'Balancing Gel Cleanser', duration: '60 sec', why: 'Addresses both oily T-zone and dry cheeks', tip: 'Gentle formula that does not over-dry any zone' },
      { step: 2, productType: 'Toner', product: 'Balancing Toner', duration: '30 sec', why: 'Normalizes both dry and oily zones', tip: 'Use cotton pad on T-zone, hands on dry areas' },
      { step: 3, productType: 'Serum', product: 'Vitamin C Serum (15%)', duration: '60 sec', why: 'Universal antioxidant benefit across all zones', tip: 'Apply evenly across face' },
      { step: 4, productType: 'Serum', product: 'Niacinamide Serum (5%)', duration: '30 sec', why: 'Controls T-zone oil without over-drying cheeks', tip: 'Concentrate application on T-zone if preferred' },
      { step: 5, productType: 'Moisturizer', product: 'Gel-Cream Moisturizer', duration: '30 sec', why: 'Lightweight hydration for all zones', tip: 'Can layer slightly more on dry areas' },
      { step: 6, productType: 'Sunscreen', product: 'SPF 50+ (Lightweight)', duration: '60 sec', why: 'Complete UV protection without congesting pores', tip: 'Fluid textures work well for combination skin' },
    ],
    night: [
      { step: 1, productType: 'Cleanser', product: 'Balancing Double Cleanse', duration: '3 min', why: 'Thorough cleanse across all face zones', tip: 'Use oil cleanser only on T-zone if dryness is concern' },
      { step: 2, productType: 'Treatment', product: 'Gentle AHA Toner (1–2x/week)', duration: '30 sec', why: 'Surface exfoliation for balanced radiance', tip: 'Glycolic or lactic acid works well for combination skin' },
      { step: 3, productType: 'Treatment', product: 'Retinol (0.1–0.3%)', duration: '60 sec', why: 'Collagen boost and pore refinement overnight', tip: 'Concentrate on T-zone areas with larger pores' },
      { step: 4, productType: 'Moisturizer', product: 'Balancing Night Cream', duration: '30 sec', why: 'Lightweight moisture appropriate for combination zones', tip: 'Gel-cream textures balance both zones effectively' },
    ],
    weekly: [
      { day: 'Tuesday', treatment: 'Zone Masking', product: 'Clay (T-zone) + Hydrating (cheeks)', duration: '15 min', why: 'Dual-mask approach to address different skin zones simultaneously' },
      { day: 'Friday', treatment: 'AHA Exfoliation', product: 'Mandelic Acid 8%', duration: '15 min', why: 'Balanced exfoliation suitable for combination skin types' },
      { day: 'Sunday', treatment: 'Hydration Reset', product: 'Hyaluronic Acid Sheet Mask', duration: '20 min', why: 'End-of-week hydration top-up across all zones' },
    ],
    monthly: [
      { cycle: 'Every 4 Weeks', treatment: 'Dual-Zone Balancing', product: 'Custom AHA/BHA Masking', why: 'De-congests T-zone while intensely nourishing lipid-depleted cheek zones' }
    ]
  }
};
