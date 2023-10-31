import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, 'src/client/tcm-map.ts'),
			name: 'TCM Member Map',
			// the proper extensions will be added
			fileName: 'tcm-map'
		}
	}
});
