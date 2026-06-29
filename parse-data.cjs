const fs = require('fs');

const dsaContent = fs.readFileSync('D:\\c++\\pattern.txt', 'utf8');
const webContent = fs.readFileSync('D:\\c++\\Full Stack Web Development Roadmap.txt', 'utf8');

const dsaCategories = [];
let currentCat = null;
let pId = 1;

for (let line of dsaContent.split('\n')) {
    line = line.trim();
    if (!line || line === 'Practice:') continue;
    if (line.match(/^\d+\./)) {
        currentCat = { id: 'c' + dsaCategories.length, title: line, patterns: [] };
        dsaCategories.push(currentCat);
    } else if (currentCat) {
        currentCat.patterns.push({ id: 'p' + pId++, name: line, completed: false });
    }
}

fs.writeFileSync('./src/data/dsaPatterns.json', JSON.stringify(dsaCategories, null, 2));

const webTopics = [];
let wId = 1;
for (let line of webContent.split('\n')) {
    line = line.trim();
    if (line) {
        webTopics.push({ id: 'w' + wId++, name: line, completed: false });
    }
}
fs.writeFileSync('./src/data/webDevRoadmap.json', JSON.stringify(webTopics, null, 2));
console.log('Data parsing complete.');
