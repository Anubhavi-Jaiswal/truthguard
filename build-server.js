import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outdir: 'dist/server',
  packages: 'external',
  sourcemap: true
});

console.log('✅ Server bundle generated successfully at dist/server/index.js');
