import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('tailwind.out.css', 'utf8');

const cleaned = html
  .replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/, '')
  .replace(/<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?<\/script>\s*/, '')
  .replace('</head>', `<style id="tailwind">${css}</style>\n</head>`);

writeFileSync('index.html', cleaned);
console.log('OK: CSS inline; Play CDN & tailwind.config dihapus.');
