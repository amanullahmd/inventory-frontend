const fs = require('fs');  
const p = process.argv[1];  
let c = fs.readFileSync(p, 'utf8');  
const demoStart = c.indexOf('  // Demo Data');  
