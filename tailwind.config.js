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
				}
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
};
