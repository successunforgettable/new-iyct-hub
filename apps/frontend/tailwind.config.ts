// Tailwind Configuration
// Reference: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md
// - Color Palette section (exact hex values)
// - Typography System section (fonts, sizes, weights)
// - Spacing System section (padding, gaps, container)

import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Colors - EXACT from COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md
      colors: {
        // Navy Blues (Background)
        navy: {
          darkest: '#0a1628', // Main background
          dark: '#1a2332', // Card backgrounds
          medium: '#2a3b52', // Lighter cards/sections
          light: '#3d5170', // Borders/dividers
        },
        // Accent Cyan/Teal (Primary actions)
        cyan: {
          primary: '#5dade2', // Main buttons, links
          light: '#7dc8f0', // Hover states
          dark: '#3b8fc7', // Active states
        },
        // Status Colors
        success: '#34c38f', // Green checkmarks
        warning: '#f1b44c', // Orange accents
        danger: '#f46a6a', // Red indicators
        // Text Colors
        text: {
          primary: '#ffffff', // Main headings
          secondary: '#e0e0e0', // Body text
          muted: '#a0a0a0', // Secondary info
          cyan: '#5dade2', // Highlighted text
        },
        // Brand Colors
        brand: {
          red: '#ff0000', // "INCREDIBLE YOU" red accent
          white: '#ffffff', // "THE INCREDIBLE" text
        },
      },
      // Typography - From COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md Typography System
      fontFamily: {
        sans: ["'Inter'", "'Segoe UI'", "'Roboto'", 'sans-serif'], // Body text
        heading: ["'Inter'", "'Segoe UI'", 'sans-serif'], // Headings
      },
      fontSize: {
        // Step titles (e.g., "WHAT COACHING REALLY IS?")
        'step-title': '1.75rem', // 28px
        // Section titles (e.g., "THE WELCOME SESSION")
        'section-title': '1.5rem', // 24px
        // Program titles
        'program-title': '1.25rem', // 20px
        // Standard sizes
        base: '1rem', // 16px
        sm: '0.875rem', // 14px
        lg: '1.125rem', // 18px
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      // Spacing - From COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md Spacing System
      spacing: {
        sidebar: '250px',
        'card-padding': '2rem', // 32px
        'section-gap': '3rem', // 48px
        'card-grid': '1.5rem', // 24px
      },
      maxWidth: {
        container: '1400px',
      },
      aspectRatio: {
        video: '16 / 9',
      },
    },
  },
  plugins: [],
} satisfies Config;
