import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { ShoppingBag, Sparkles, Star, ChevronRight, ShieldCheck } from 'lucide-react';

export default function ProductEngine() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;

  const [activeCategory, setActiveCategory] = useState<'skin' | 'hair'>('skin');

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <ShoppingBag size={48} className="text-pink-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Diagnostics Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please run your skin diagnostics scan first to load the Product Recommendation Engine.
        </p>
        <button 
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition shadow-glow-primary"
          onClick={() => navigate('/profile')}
        >
          Start Analysis
        </button>
      </div>
    );
  }

  const skinProducts = result.products.map(p => ({
    name: p.name,
    brand: p.brand,
    price: p.price,
    ingredients: p.keyIngredients,
    why: p.reason,
    results: 'Reduces sebum accumulation and prevents cellular inflammation markers.',
    confidence: p.matchScore,
    category: p.category
  }));

  const hairProducts = [
    {
      name: 'Scalp Calming Rosemary Shampoo',
      brand: 'Tricholabs',
      price: '$32',
      ingredients: ['Rosemary Extract', 'Tea Tree Oil', 'Caffeine'],
      why: 'Stimulates scalp micro-circulation and gently clears sebum accumulations around the hair bulb shafts.',
      results: 'Reduces hair follicle shedding risk and supports healthy shaft density.',
      confidence: 91,
      category: 'Shampoo'
    },
    {
      name: 'Keratin Bond Restoration Conditioner',
      brand: 'AuraHair',
      price: '$36',
      ingredients: ['Hydrolysed Keratin', 'Biotin', 'Argan Oil'],
      why: 'Fills structural micro-cracks in hair shaft cuticles to maximize tensile strength and prevent fiber breakage.',
      results: 'Boosts shaft elasticity and eliminates hair frizz under environmental dryness.',
      confidence: 88,
      category: 'Conditioner'
    },
    {
      name: 'Copper-Peptide Hair Growth Serum',
      brand: 'RootVital',
      price: '$48',
      ingredients: ['Copper Peptides 1.5%', 'Biotin', 'Caffeine'],
      why: 'Upregulates nutrient delivery to hair bulb matrices, extending the active Anagen growth cycle.',
      results: 'Increases active shaft thickness and supports new hair density.',
      confidence: 94,
      category: 'Hair Serum'
    }
  ];

  const currentProducts = (activeTab: string) => activeTab === 'skin' ? skinProducts : hairProducts;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Header */}
      <header className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 border border-pink-500/30 text-pink-400 mb-3">
          <ShoppingBag size={12} /> Bespoke Recommendations
        </span>
        <h1 className="text-3xl font-extrabold text-white font-display">Product Recommendation Engine</h1>
        <p className="text-sm text-aura-muted mt-1">Curated prescription-grade formulas matched to your skin category and scalp indices.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-black/45 rounded-xl border border-aura-border max-w-sm mb-8">
        <button
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition no-lift ${
            activeCategory === 'skin' ? 'bg-pink-600 text-white shadow-glow-secondary' : 'text-aura-muted hover:text-white'
          }`}
          onClick={() => setActiveCategory('skin')}
        >
          Skin Products
        </button>
        <button
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition no-lift ${
            activeCategory === 'hair' ? 'bg-pink-600 text-white shadow-glow-secondary' : 'text-aura-muted hover:text-white'
          }`}
          onClick={() => setActiveCategory('hair')}
        >
          Hair & Scalp Products
        </button>
      </div>

      {/* Product List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts(activeCategory).map((product, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col justify-between min-h-[380px]">
            <div>
              {/* Product Header */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-bold uppercase tracking-wider text-pink-400 font-mono bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded">
                  {product.category}
                </span>
                <span className="text-[10px] text-yellow-400 font-bold flex items-center gap-0.5">
                  <Star size={10} fill="currentColor" /> {product.confidence}% Match
                </span>
              </div>

              {/* Product Name */}
              <h3 className="text-sm font-bold text-white mb-0.5">{product.name}</h3>
              <div className="text-[11px] text-aura-muted mb-3">{product.brand} • {product.price}</div>

              {/* Ingredients tags */}
              <div className="flex gap-1.5 flex-wrap mb-4">
                {product.ingredients.map((ing, iIdx) => (
                  <span key={iIdx} className="text-[9px] text-white/80 bg-black/35 border border-white/5 px-2 py-0.5 rounded font-mono">
                    {ing}
                  </span>
                ))}
              </div>

              {/* Rationale Details */}
              <div className="flex flex-col gap-3">
                <div>
                  <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">Why Recommended</h4>
                  <p className="text-[10px] text-aura-muted leading-relaxed">{product.why}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Expected Outcome</h4>
                  <p className="text-[10px] text-aura-muted leading-relaxed">{product.results}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-aura-border flex items-center justify-between">
              <span className="text-[10px] text-aura-muted font-mono flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-pink-400" /> Bio-verified safe
              </span>
              <button 
                className="text-[10px] font-bold text-pink-400 flex items-center gap-0.5 hover:underline"
                onClick={() => alert(`${product.name} linked to your formulation routine!`)}
              >
                Link to Routine <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
