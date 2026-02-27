const fetch = require('node-fetch');
const fs = require('fs');

async function scrape() {
    const url = 'https://www.sap.com/events/finder.html?sort=events_upcoming&tab=explore-all-events';
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        }
    });

    if (!response.ok) {
        console.error('Failed to fetch:', response.status);
        return;
    }

    const html = await response.text();
    fs.writeFileSync('sap_raw.html', html);
    console.log('Saved raw HTML to sap_raw.html');

    // Look for data-attributes or script tags that might contain event data
    const matches = html.match(/\[\{.*\}\]/g);
    if (matches) {
        console.log('Found potential JSON matches:', matches.length);
        fs.writeFileSync('potential_data.json', JSON.stringify(matches, null, 2));
    } else {
        console.log('No direct JSON array found in HTML');
    }
}

scrape();
