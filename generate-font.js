const fs = require('fs');
const path = require('path');

try {
    const fontPath = path.join(__dirname, 'public', 'solaimanlipi.ttf');
    const fontData = fs.readFileSync(fontPath);
    const base64Data = fontData.toString('base64');
    
    // We create a typescript file that exports the base64 string directly
    const tsContent = `export const solaimanFontBase64 = "${base64Data}";\n`;
    fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'fonts', 'solaiman.ts'), tsContent);
    
    console.log("Successfully created font Base64 export in src/lib/fonts/solaiman.ts!");
} catch (error) {
    console.error("Failed to generate font base64:", error);
}
