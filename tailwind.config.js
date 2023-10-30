/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/client/**/*.ts'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/forms')]
};
