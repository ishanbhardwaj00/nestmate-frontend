import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/containers/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      height: {
        20: '75px',
      },
      maxWidth: {
        '1/2': '50%',
        '3/4': '75%',
        '4/5': '80%',
        '2/3': '66%',
      },
      keyframes: {
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        slideRight: 'slideRight 0.5s ease-out',
      },

      textShadow: {
        outline:
          '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'custom-pattern': "url('/images/bg-svg.svg')",
        step1: "url('/images/register-svg.svg')",
        step2: "url('/images/step2.svg')",
        match: "url('/images/match-bg.svg')",
      },
      colors: {
        primary: {
          DEFAULT: '#232beb',
          light: '#232beb',
        },
        nav: {
          light: '#FAFAFA',
        },
        home: {
          light: '#F0F0F0',
        },
        userdetails: {
          DEFAULT: '#EFEFF9',
        },
        gray: {
          dark: '#858585',
        },
        chat: {
          DEFAULT: '#EAEAEA',
        },
        location: {
          DEFAULT: '#EDEEFF',
        },
        button: {
          primary: {
            DEFAULT: '#a7ebcf',
          },
          radio: {
            DEFAULT: '#EBEBEB',
            button: '#040752',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
