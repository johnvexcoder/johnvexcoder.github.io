const path = require('node:path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (error) {
  ({ chromium } = require('/home/j0hn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
}

const projects = [
  {
    name: 'Your Coffee',
    url: 'https://your-coffee-six.vercel.app/',
    output: 'src/img/projects/your-coffee/your-coffee-source.png'
  }
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1 });

  for (const project of projects) {
    await page.goto(project.url, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images, image => image.complete ? image.decode().catch(() => {}) : new Promise(resolve => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      })));
    });
    await page.screenshot({ path: path.resolve(__dirname, '..', project.output), fullPage: true });
    console.log(`Captured ${project.name}`);
  }

  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
