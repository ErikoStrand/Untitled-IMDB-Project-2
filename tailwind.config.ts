import type { Config } from 'tailwindcss';
import fluid, { extract, screens, fontSize } from 'fluid-tailwind';

export default {
	content: { files: ['./src/**/*.{html,js,svelte,ts}'], extract },

	theme: {
		extend: {
			animation: {
				'slide-up': 'slide-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'slide-left': 'slide-left 0.6s ease-in-out forwards',
				'slide-right': 'slide-right 0.6s ease-in-out forwards'
			},
			keyframes: {
				'slide-up': {
					'0%': {
						transform: 'translateY(70px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'slide-left': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-right': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				}
			},
			fontFamily: {
				poppin: ['"Poppins"', 'sans-serif'],
				heebo: ['"Heebo"', 'sans-serif'],
				quicksand: ['"Quicksand"', 'sans-serif'],
				archivo: ['"Archivo"', 'sans-serif']
			},
			colors: {
				'licorice-xl': '#3D3029',
				'licorice-l': '#40322a',
				floral: '#fdfaf5',
				dogwood: '#CCB6A9',
				champagne: '#f1eae1',
				mortuum: '#632B29',
				jasmine: '#F6DB65',
				licorice: '#211A16',
				accent: '#f6c615',
				'accent-dark': '#d0a508',
				'bg-normal': '#ebebeb'
			}
		},
		screens,
		fontSize
	},

	plugins: [fluid]
} as Config;
