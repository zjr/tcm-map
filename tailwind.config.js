// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/client/**/*.{ts,html,css,scss}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Roboto"', ...defaultTheme.fontFamily.sans]
			},
			colors: {
				tcmOrange: {
					500: '#F05C26'
				},
				tcmYellow: {
					500: '#EDE04D',
					900: '#C9892A'
				},
				tcmTeal: {
					500: '#78C9C2',
					800: '#43A89F'
				},
				tcmIndigo: {
					800: '#4949AE'
				},
				gray: {
					0: '#FFFFFF',
					500: '#727272',
					600: '#666666',
					700: '#545454',
					800: '#333333',
					900: '#0A0A0A'
				}
			},
			animation: {
				pop: 'pop 150ms ease-in forwards',
				hide: 'hide 150ms ease-out forwards'
			},
			keyframes: {
				pop: {
					'0%': { transform: 'scale(0)', opacity: 0 },
					'1%': { transform: 'scale(0.95)', opacity: 0 },
					'100%': { transform: 'scale(1)', opacity: 1 }
				},
				hide: {
					'0%': { transform: 'scale(1)', opacity: 1 },
					'99%': { transform: 'scale(0.95)', opacity: 0 },
					'100%': { transform: 'scale(0)', opacity: 0 }
				}
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
};
