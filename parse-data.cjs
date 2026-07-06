const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node parse-data.cjs <dsa_patterns_file> <web_roadmap_file>');
  console.log('Example: node parse-data.cjs D:\\c++\\pattern.txt D:\\c++\\roadmap.txt');
  process.exit(1);
}

const dsaFile = path.resolve(args[0]);
const webFile = path.resolve(args[1]);

if (!fs.existsSync(dsaFile)) {
  console.error(`File not found: ${dsaFile}`);
  process.exit(1);
}

if (!fs.existsSync(webFile)) {
  console.error(`File not found: ${webFile}`);
  process.exit(1);
}

const dsaContent = fs.readFileSync(dsaFile, 'utf8');
const webContent = fs.readFileSync(webFile, 'utf8');

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

const dsaOut = path.resolve(__dirname, 'src/data/dsaPatterns.json');
fs.writeFileSync(dsaOut, JSON.stringify(dsaCategories, null, 2));
console.log(`Wrote ${dsaCategories.length} categories to ${dsaOut}`);

const webTopics = [];
let wId = 1;
for (let line of webContent.split('\n')) {
    line = line.trim();
    if (line) {
        webTopics.push({ id: 'w' + wId++, name: line, completed: false });
    }
}

const webOut = path.resolve(__dirname, 'src/data/webDevRoadmap.json');
fs.writeFileSync(webOut, JSON.stringify(webTopics, null, 2));
console.log(`Wrote ${webTopics.length} topics to ${webOut}`);
console.log('Data parsing complete.');
