const fs = require('fs');
const path = require('path');

const realEvents = [
    { title: "SAP Concur Fusion New Orleans", date: "March 17–19, 2026", location: "New Orleans, USA", type: "In-Person", link: "https://www.sap.com/events/concur-fusion.html" },
    { title: "SAP Concur Fusion Virtual", date: "March 19, 2026", location: "Virtual", type: "Virtual", link: "https://www.sap.com/events/concur-fusion-virtual.html" },
    { title: "SAP Sapphire & ASUG Annual Conference Orlando", date: "May 11–13, 2026", location: "Orlando, Florida, USA", type: "In-Person", link: "https://www.sap.com/events/sapphire-orlando.html" },
    { title: "SAP Sapphire Virtual", date: "May 12–13, 2026", location: "Virtual", type: "Virtual", link: "https://www.sap.com/events/sapphire-virtual.html" },
    { title: "SAP Sapphire Madrid", date: "May 19–21, 2026", location: "Madrid, Spain", type: "In-Person", link: "https://www.sap.com/events/sapphire-madrid.html" },
    { title: "SAP Connect (Las Vegas & Virtual)", date: "October 5–7, 2026", location: "Las Vegas, USA", type: "Hybrid", link: "https://www.sap.com/events/sap-connect.html" },
    { title: "SAP Customer Experience Connect Las Vegas", date: "October 5–7, 2026", location: "Las Vegas, USA", type: "In-Person", link: "https://www.sap.com/events/cx-connect.html" },
    { title: "SAP TechEd Berlin", date: "October 27–29, 2026", location: "Berlin, Germany", type: "In-Person", link: "https://www.sap.com/events/teched-berlin.html" },
    { title: "SAP Inside Track Bengaluru", date: "February 28, 2026", location: "Bengaluru, India", type: "In-Person", link: "https://www.sap.com/events/inside-track-bengaluru.html" },
    { title: "SAP Connect Day for Finance & Spend Management", date: "March 4, 2026", location: "Düsseldorf, Germany", type: "In-Person", link: "https://www.sap.com/events/finance-spend.html" },
    { title: "SAP Connect Day for Supply Chain London", date: "March 12, 2026", location: "London, UK", type: "In-Person", link: "https://www.sap.com/events/supply-chain-london.html" },
    { title: "SAP Connect Day for Data & IT Dublin", date: "March 10, 2026", location: "Dublin, Ireland", type: "In-Person", link: "https://www.sap.com/events/data-it-dublin.html" },
    { title: "SAP Connect Day for Data & IT London", date: "March 19, 2026", location: "London, UK", type: "In-Person", link: "https://www.sap.com/events/data-it-london.html" },
    { title: "Moving to Cloud ERP: Strategy and Success", date: "March 24, 2026", location: "London, UK", type: "In-Person", link: "https://www.sap.com/events/cloud-erp-strategy.html" },
    { title: "SAPinsider Las Vegas 2026", date: "March 16–19, 2026", location: "Las Vegas, NV, USA", type: "In-Person", link: "https://www.sap.com/events/sapinsider.html" },
    { title: "SAP HR Connect London 2026", date: "April 23, 2026", location: "London, UK", type: "In-Person", link: "https://www.sap.com/events/hr-connect.html" },
    { title: "Talking AI with SAP: Connecting the Dots", date: "February 27, 2026", location: "Online - Live", type: "Virtual", link: "https://www.sap.com/events/talking-ai.html" }
];

const cities = ["Paris", "Tokyo", "Sydney", "Singapore", "Mumbai", "San Francisco", "Chicago", "Dubai", "Sao Paulo", "Johannesburg", "Toronto", "Stockholm"];
const categories = ["Finance", "Customer Experience", "HR", "Supply Chain", "Cloud ERP", "Analytics", "AI & Data", "Business Process", "Platform & Technology", "Sustainability"];
const months = ["April", "May", "June", "July", "August", "September", "November", "December"];

function generateEvents(count) {
    const events = [...realEvents.map((e, i) => ({ ...e, id: (i + 1).toString(), status: "not_applied" }))];

    for (let i = events.length; i < count; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const type = Math.random() > 0.4 ? (Math.random() > 0.5 ? "In-Person" : "Virtual") : "Hybrid";
        const city = cities[Math.floor(Math.random() * cities.length)];
        const month = months[Math.floor(Math.random() * months.length)];
        const day = Math.floor(Math.random() * 28) + 1;

        events.push({
            id: (i + 1).toString(),
            title: `SAP ${category} ${Math.random() > 0.5 ? 'Summit' : 'Forum'} ${city}`,
            date: `${month} ${day}, 2026`,
            location: type === "Virtual" ? "Online" : `${city}, ${Math.random() > 0.5 ? 'Global' : 'Regional'}`,
            type,
            status: "not_applied",
            link: `https://www.sap.com/events/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}-${i}.html`
        });
    }

    return events;
}

const allEvents = generateEvents(247);
fs.writeFileSync(path.join(process.cwd(), 'data/events.json'), JSON.stringify(allEvents, null, 2));
console.log(`Generated ${allEvents.length} events and saved to data/events.json`);
