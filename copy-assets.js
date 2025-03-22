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

// Create default review image if it doesn't exist
const defaultImagePath = path.join(destinationImagesDir, 'default-review.jpg');
if (!fs.existsSync(defaultImagePath)) {
  try {
    // If there's a template default image in assets, copy it
    const templatePath = path.join(__dirname, 'assets', 'default-review.jpg');
    if (fs.existsSync(templatePath)) {
      fs.copyFileSync(templatePath, defaultImagePath);
      console.log('Created default review image from template');
    } else {
      // Otherwise, create a simple placeholder (this is a very basic placeholder)
      const placeholderContent = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUJFRjU1MEIzRDMzMTFFM0E2RUM5QUZEMzlFMTJBOEUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUJFRjU1MEMzRDMzMTFFM0E2RUM5QUZEMzlFMTJBOEUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQkVGNTUwOTNEMzMxMUUzQTZFQzlBRkQzOUUxMkE4RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQkVGNTUwQTNEMzMxMUUzQTZFQzlBRkQzOUUxMkE4RSIvPiA8L3JkZjpEZXNjcmlwdGlvbiA8L3JkZjpSRGY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+cu0ClAAAAYZJREFUeNr42DEOwgAAgGFD2DrA2IkxvARn4hm4Dw/AcnEMJjbEsqUZicgGIrWl/x8IqRJD6riOU9fp8l4BkAAAQAAAAgBAAACAAAABAAAACAAAABAAgAAAAQAgAAAEAIAAAAABABAAgAAAEAAAAgAAABAAgAAAAQAgAAAEAIAAAEAAAAIAQAAACAAAAQAgAAAEAIAAABAAgAAAAQAgAAAEAIAAABAAgAAAAQD4lz4jj07nlVIaY8Z97enzmWXZtm2llJeXI8lXdO5UKeV/FH3f13W9rmue58MwjGOacZ5TcJxYjX7J3ViWJYTQNE1RFPu+h7FyANTOpUsp8zyPMYYQyrLM83ye5+v3sgUs+j9G3B9ihBi99S7LMk1T27Z1Xe/7PrvdGXiHuEv8W9u2VVUNw+C9vwTx66yfgW+Ii2GapvixQxzH0Rij9hoA3iG+Zlpr6ey/AAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAwLcDvAUYAGZNwmNR/USgAAAAAElFTkSuQmCC',
        'base64'
      );
      fs.writeFileSync(defaultImagePath, placeholderContent);
      console.log('Created default review image placeholder');
    }
  } catch (err) {
    console.error('Error creating default review image:', err);
  }
}

// Enhanced copy function with validation and case-insensitive matching
function copyFilesInDirectory(sourceDir, destDir, isImage = false) {
  if (!fs.existsSync(sourceDir)) {
    console.log(`Source directory doesn't exist: ${sourceDir}`);
    return;
  }
  
  // For image validation, get a list of the expected files from reviews.json
  let expectedImages = [];
  if (isImage) {
    try {
      const reviewsJsonPath = path.join(sourceDataDir, 'reviews.json');
      if (fs.existsSync(reviewsJsonPath)) {
        const reviewsData = JSON.parse(fs.readFileSync(reviewsJsonPath, 'utf8'));
        expectedImages = reviewsData
          .filter(review => review.image_url)
          .map(review => review.image_url.toLowerCase());
        
        console.log('Expected images from reviews.json:', expectedImages);
      }
    } catch (error) {
      console.error('Error parsing reviews.json:', error);
    }
  }
  
  const files = fs.readdirSync(sourceDir);
  
  // Keep track of copied images for validation
  const copiedImages = [];
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isFile()) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${file} to ${destDir}`);
      
      if (isImage) {
        copiedImages.push(file.toLowerCase());
      }
    } else if (stats.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      copyFilesInDirectory(sourcePath, destPath, isImage);
    }
  });
  
  // If we're processing images, validate that all expected images were copied
  if (isImage && expectedImages.length > 0) {
    const missingImages = expectedImages.filter(image => !copiedImages.includes(image));
    if (missingImages.length > 0) {
      console.warn('Warning: The following images referenced in reviews.json were not found:');
      missingImages.forEach(image => {
        console.warn(`  - ${image}`);
        
        // Try to find files with similar names (case-insensitive)
        const similarFiles = files.filter(file => 
          file.toLowerCase() === image.toLowerCase() || 
          file.toLowerCase().replace(/\.[^/.]+$/, "") === image.toLowerCase().replace(/\.[^/.]+$/, "")
        );
        
        if (similarFiles.length > 0) {
          console.log(`    Found similar files: ${similarFiles.join(', ')}`);
          
          // Auto-correct by copying the first similar file with the expected name
          const correctSourcePath = path.join(sourceDir, similarFiles[0]);
          const correctDestPath = path.join(destDir, image);
          
          try {
            fs.copyFileSync(correctSourcePath, correctDestPath);
            console.log(`    Auto-corrected: Copied ${similarFiles[0]} as ${image}`);
          } catch (err) {
            console.error(`    Failed to auto-correct: ${err.message}`);
          }
        }
      });
    }
  }
}

// Copy review images to public directory with enhanced validation
try {
  copyFilesInDirectory(sourceImagesDir, destinationImagesDir, true);
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
