const fs = require('fs');
const f = 'src/app/stock-in/page.tsx';
let c = fs.readFileSync(f, 'utf8');

c = c.replace(
  "import { useState, useEffect } from 'react'",
  "import { useState, useEffect, useCallback } from 'react'"
);

const oldIsToday = '  const isToday = (iso: string) => {\n    const d = new Date(iso)\n    const now = new Date()\n    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()\n  }\n';
const newIsToday = '\nconst isToday = (iso: string) => {\n  const d = new Date(iso)\n  const now = new Date()\n  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()\n}\n';
c = c.replace(oldIsToday, '');
c = c.replace('export default function StockInPage()', newIsToday + 'export default function StockInPage()');

c = c.replace(
  "const addLine = () => setLines([...lines, { itemId: '', quantity: ' ' }])",
  "const addLine = useCallback(() => setLines(prev => [...prev, { itemId: '', quantity: ' ' }]), [])"  
);
c = c.replace(
  "const updateLine = (idx: number, field: 'itemId' | 'quantity', value: string) => {\n    setLines(lines.map((l, i) => i === idx ? { ..., [field]: value } : l))\n  }",
  "const updateLine = useCallback((idx: number, field: 'itemId' | 'quantity', value: string) => {\n    setLines(prev => prev.map((l, i) => i === idx ? { ..., [field]: value } : l))\n  }, [])"
);
c = c.replace(
  "const removeLine = (idx: number) => setLines(lines.filter((_, i) => iǌ== idx))",
  "const removeLine = useCallback((idx: number) => setLines(prev => prev.filter((_, i) => i !== idx)), [])"  
);

fs.writeFileSync(f, c);
console.log('Stock-in optimized');