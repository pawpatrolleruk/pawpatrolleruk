import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define source and destination directories
const sourceImagesDir = path.join(__dirname, 'assets', 'reviews');
const destinationImagesDir = path.join(__dirname, 'public', 'reviews');
const sourceDataDir = path.join(__dirname, 'assets', 'data');
const destinationDataDir = path.join(__dirname, 'public', 'data');

// Create destination directories if they don't exist
if (!fs.existsSync(destinationImagesDir)) {
  fs.mkdirSync(destinationImagesDir, { recursive: true });
}

if (!fs.existsSync(destinationDataDir)) {
  fs.mkdirSync(destinationDataDir, { recursive: true });
}

// Copy function
function copyFilesInDirectory(sourceDir, destDir) {
  if (!fs.existsSync(sourceDir)) {
    console.log(`Source directory doesn't exist: ${sourceDir}`);
    return;
  }
  
  const files = fs.readdirSync(sourceDir);
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isFile()) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${file} to ${destDir}`);
    } else if (stats.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      copyFilesInDirectory(sourcePath, destPath);
    }
  });
}

// Copy review images to public directory
try {
  copyFilesInDirectory(sourceImagesDir, destinationImagesDir);
  console.log('Review images copied successfully');
} catch (err) {
  console.error('Error copying review images:', err);
}

// Copy JSON data to public directory
try {
  copyFilesInDirectory(sourceDataDir, destinationDataDir);
  console.log('Data files copied successfully');
} catch (err) {
  console.error('Error copying data files:', err);
}

console.log('Assets copy process completed');
