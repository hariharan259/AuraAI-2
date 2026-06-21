/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          bg: '#0F172A',
          panel: 'rgba(30, 41, 59, 0.65)',
          border: 'rgba(255, 255, 255, 0.08)',
          primary: '#6D28D9',
          'primary-light': '#8B5CF6',
          secondary: '#EC4899',
          cyan: '#06B6D4',
          gold: '#F59E0B',
          green: '#10B981',
          red: '#ef4444',
          text: '#F8FAFC',
          muted: '#CBD5E1',
        }
      },
      backgroundImage: {
        'medical-radial': 'radial-gradient(circle at 50% 50%, rgba(13, 148, 136, 0.12) 0%, transparent 60%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'brand-primary': 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)',
        'brand-wellness': 'linear-gradient(135deg, #00C9A7 0%, #92FE9D 100%)',
        'brand-skin': 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)',
        'brand-hair': 'linear-gradient(135deg, #434343 0%, #000000 100%)',
        'brand-journey': 'linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)',
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(106, 17, 203, 0.3)',
        'glow-secondary': '0 0 15px rgba(252, 70, 107, 0.3)',
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.3)',
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.3)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.3)',
        'glow-brand-primary': '0 0 20px rgba(106, 17, 203, 0.35)',
        'glow-brand-wellness': '0 0 20px rgba(0, 201, 167, 0.35)',
        'glow-brand-skin': '0 0 20px rgba(255, 154, 158, 0.25)',
        'glow-brand-journey': '0 0 20px rgba(252, 70, 107, 0.35)',
      }
    },
  },
  plugins: [],
}
