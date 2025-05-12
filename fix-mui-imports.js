const fs = require('fs');
const path = require('path');

function fixImports(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      fixImports(fullPath);
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Fix imports with trailing slashes
        if (content.includes("@mui/material/';")) {
          console.log(`Fixing imports in ${fullPath}`);
          content = content.replace(/@mui\/material\/';/g, "@mui/material';");
          fs.writeFileSync(fullPath, content, 'utf8');
        }
      } catch (error) {
        console.error(`Error processing file ${fullPath}:`, error);
      }
    }
  }
}

// Start from the src directory
fixImports(path.join(__dirname, 'src'));
console.log('MUI imports fixed successfully!'); 