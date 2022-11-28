import preprocess from 'svelte-preprocess';
import path from 'path';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter( {
      out: 'build',
      precompress: true,
    } ),
    alias: {
      $logs: './logs'
    }
  }
};

export default config;
