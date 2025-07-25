#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 DESTROYING @asamuzakjp/css-color and related packages...');

const packagesToDestroy = [
  'node_modules/@asamuzakjp',
  'node_modules/cssstyle', 
  'node_modules/jsdom'
];

function destroyPackage(packagePath) {
  const fullPath = path.join(process.cwd(), packagePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`💥 Destroying: ${packagePath}`);
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ Destroyed: ${packagePath}`);
    } catch (error) {
      console.log(`❌ Failed to destroy ${packagePath}:`, error.message);
    }
  } else {
    console.log(`✅ Already gone: ${packagePath}`);
  }
}

// Destroy all problematic packages
packagesToDestroy.forEach(destroyPackage);

// Create fake empty packages to prevent reinstallation
const fakePackages = [
  'node_modules/@asamuzakjp/css-color',
  'node_modules/cssstyle',
  'node_modules/jsdom'
];

fakePackages.forEach(fakePackagePath => {
  const fullPath = path.join(process.cwd(), fakePackagePath);
  const packageJsonPath = path.join(fullPath, 'package.json');
  
  try {
    // Create directory if it doesn't exist
    fs.mkdirSync(fullPath, { recursive: true });
    
    // Create fake package.json
    const fakePackageJson = {
      name: path.basename(fakePackagePath),
      version: "999.999.999",
      description: "Fake package to prevent problematic installation",
      main: "index.js"
    };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(fakePackageJson, null, 2));
    
    // Create fake index.js
    const indexPath = path.join(fullPath, 'index.js');
    fs.writeFileSync(indexPath, '// Fake package - blocked by destroy script\nmodule.exports = {};');
    
    // Create fake index.ts if needed
    const indexTsPath = path.join(fullPath, 'src', 'index.ts');
    fs.mkdirSync(path.dirname(indexTsPath), { recursive: true });
    fs.writeFileSync(indexTsPath, '// Fake package - blocked by destroy script\nexport default {};');
    
    console.log(`🛡️  Created fake package: ${fakePackagePath}`);
  } catch (error) {
    console.log(`❌ Failed to create fake ${fakePackagePath}:`, error.message);
  }
});

console.log('🔥 DESTRUCTION COMPLETE! No more @asamuzakjp/css-color!');