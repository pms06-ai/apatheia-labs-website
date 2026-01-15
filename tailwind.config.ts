import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Apatheia Labs Brand
        bronze: {
          50: '#fdf8ed',
          100: '#f9efd4',
          200: '#f2dca8',
          300: '#eac56f',
          400: '#e3aa3f',
          500: '#d4a017', // Primary bronze
          600: '#b8860b', // Brand bronze
          700: '#9a6a0a',
          800: '#7d5410',
          900: '#674514',
        },
        charcoal: {
          DEFAULT: '#1C1C1E',
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#cccccc',
          300: '#a3a3a3',
          400: '#6b6b6b', // Warm gray
          500: '#4a4a4c',
          600: '#2c2c2e', // Light
          700: '#232325',
          800: '#1c1c1e', // DEFAULT
          900: '#0f0f10', // Primary bg
        },
        // Semantic backgrounds
        bg: {
          primary: '#0f0f10',
          secondary: '#161618',
          tertiary: '#1c1c1e',
          elevated: '#242426',
        },
        // Status colors
        status: {
          critical: '#C94A4A',
          'critical-bg': 'rgba(201,74,74,0.12)',
          high: '#D4A017',
          'high-bg': 'rgba(212,160,23,0.12)',
          medium: '#8B7355',
          'medium-bg': 'rgba(139,115,85,0.12)',
          info: '#5B8A9A',
          'info-bg': 'rgba(91,138,154,0.12)',
          success: '#4A9A6A',
          'success-bg': 'rgba(74,154,106,0.12)',
        },
        // Institution colors
        institution: {
          police: '#5B7A9A',
          authority: '#8B6B5A',
          court: '#6B5A8B',
          expert: '#5A8B7A',
          guardian: '#9A6B5B',
          broadcast: '#7A5B9A',
        },
        // Regulator colors
        regulator: {
          ofcom: '#FF6B35',
          iopc: '#3B82F6',
          lgo: '#10B981',
          ico: '#8B5CF6',
          hcpc: '#EC4899',
          bps: '#F59E0B',
          ofsted: '#06B6D4',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.3)',
        elevated: '0 4px 16px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(184,134,11,0.2)',
        'glow-strong': '0 0 30px rgba(184,134,11,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
