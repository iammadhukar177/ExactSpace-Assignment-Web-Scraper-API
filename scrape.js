// scrape.js - Node.js script to scrape a webpage using Puppeteer
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const url = process.env.SCRAPE_URL || 'https://example.com';
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
        return {
            title: document.title,
            heading: document.querySelector('h1')?.innerText || 'No heading found'
        };
    });

    fs.writeFileSync('/app/scraped_data.json', JSON.stringify(data, null, 2));
    console.log('Scraping complete:', data);

    await browser.close();
})();
