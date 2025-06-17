/**
 * Optimized Asset Copy Script
 * 
 * This script efficiently copies assets from source directories to public directories
 * for use in the website. It includes validation, error handling, and performance optimizations.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  directories: {
    source: {
      images: path.join(__dirname, 'assets', 'reviews'),
      data: path.join(__dirname, 'assets', 'data'),
      badges: path.join(__dirname, 'assets', 'badges'),
      components: path.join(__dirname, 'src', 'components')
    },
    destination: {
      images: path.join(__dirname, 'public', 'reviews'),
      data: path.join(__dirname, 'public', 'data'),
      badges: path.join(__dirname, 'public', 'badges'),
      components: path.join(__dirname, 'public', 'src', 'components')
    }
  },
  defaultImage: {
    path: path.join(__dirname, 'public', 'reviews', 'default-review.jpg'),
    templatePath: path.join(__dirname, 'assets', 'default-review.jpg')
  }
};

/**
 * Ensure a directory exists, creating it if necessary
 * @param {string} dirPath - Path to the directory
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    } catch (error) {
      console.error(`Error creating directory ${dirPath}:`, error);
      throw error;
    }
  }
}

/**
 * Create a default review image if it doesn't exist
 */
function createDefaultReviewImage() {
  if (fs.existsSync(CONFIG.defaultImage.path)) return;
  
  try {
    // If there's a template default image in assets, copy it
    if (fs.existsSync(CONFIG.defaultImage.templatePath)) {
      fs.copyFileSync(CONFIG.defaultImage.templatePath, CONFIG.defaultImage.path);
      console.log('Created default review image from template');
    } else {
      // Otherwise, create a simple placeholder (this is a very basic placeholder)
      const placeholderContent = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUJFRjU1MEIzRDMzMTFFM0E2RUM5QUZEMzlFMTJBOEUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUJFRjU1MEMzRDMzMTFFM0E2RUM5QUZEMzlFMTJBOEUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQkVGNTUwOTNEMzMxMUUzQTZFQzlBRkQzOUUxMkE4RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQkVGNTUwQTNEMzMxMUUzQTZFQzlBRkQzOUUxMkE4RSIvPiA8L3JkZjpEZXNjcmlwdGlvbiA8L3JkZjpSRGY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+cu0ClAAAAYZJREFUeNr42DEOwgAAgGFD2DrA2IkxvARn4hm4Dw/AcnEMJjbEsqUZicgGIrWl/x8IqRJD6riOU9fp8l4BkAAAQAAAAgBAAACAAAABAAAACAAAABAAgAAAAQAgAAAEAIAAAAABABAAgAAAAQAgAAAEAIAAABAAgAAAAQAgAAAEAIAAAEAAAAIAQAAACAAAAQAgAAAEAIAAABAAgAAAAQAgAAAEAIAAABAAgAAAAQD4lz4jj07nlVIaY8Z97enzmWXZtm2llJeXI8lXdO5UKeV/FH3f13W9rmue58MwjGOacZ5TcJxYjX7J3ViWJYTQNE1RFPu+h7FyANTOpUsp8zyPMYYQyrLM83ye5+v3sgUs+j9G3B9ihBi99S7LMk1T27Z1Xe/7PrvdGXiHuEv8W9u2VVUNw+C9vwTx66yfgW+Ii2GapvixQxzH0Rij9hoA3iG+Zlpr6ey/AAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAwLcDvAUYAGZNwmNR/USgAAAAAElFTkSuQmCC',
        'base64'
      );
      fs.writeFileSync(CONFIG.defaultImage.path, placeholderContent);
      console.log('Created default review image placeholder');
    }
  } catch (error) {
    console.error('Error creating default review image:', error);
  }
}

/**
 * Get expected image filenames from reviews.json
 * @returns {Array} Array of expected image filenames
 */
function getExpectedImagesFromReviews() {
  try {
    const reviewsJsonPath = path.join(CONFIG.directories.source.data, 'reviews.json');
    if (!fs.existsSync(reviewsJsonPath)) {
      console.warn('reviews.json not found, skipping image validation');
      return [];
    }
    
    const reviewsData = JSON.parse(fs.readFileSync(reviewsJsonPath, 'utf8'));
    const expectedImages = reviewsData
      .filter(review => review.image_url)
      .map(review => review.image_url.toLowerCase());
    
    console.log(`Found ${expectedImages.length} images referenced in reviews.json`);
    return expectedImages;
  } catch (error) {
    console.error('Error parsing reviews.json:', error);
    return [];
  }
}

/**
 * Copy files from source to destination with validation
 * @param {string} sourceDir - Source directory
 * @param {string} destDir - Destination directory
 * @param {Object} options - Options for copying
 */
function copyFiles(sourceDir, destDir, options = {}) {
  const { isImage = false, expectedFiles = [] } = options;
  
  if (!fs.existsSync(sourceDir)) {
    console.log(`Source directory doesn't exist: ${sourceDir}`);
    return;
  }
  
  // Ensure destination directory exists
  ensureDirectoryExists(destDir);
  
  // Get list of files in source directory
  const files = fs.readdirSync(sourceDir);
  const copiedFiles = [];
  
  // Copy each file
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    try {
      const stats = fs.statSync(sourcePath);
      
      if (stats.isFile()) {
        // Only copy if the file doesn't exist or is newer
        if (!fs.existsSync(destPath) || 
            stats.mtime > fs.statSync(destPath).mtime) {
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Copied: ${file} to ${destDir}`);
        } else {
          console.log(`Skipped: ${file} (already up to date)`);
        }
        
        if (isImage) {
          copiedFiles.push(file.toLowerCase());
        }
      } else if (stats.isDirectory()) {
        // Recursively copy subdirectories
        copyFiles(
          sourcePath, 
          destPath, 
          { isImage, expectedFiles }
        );
      }
    } catch (error) {
      console.error(`Error copying ${file}:`, error);
    }
  });
  
  // Validate that all expected files were copied
  if (isImage && expectedFiles.length > 0) {
    validateCopiedImages(sourceDir, destDir, files, copiedFiles, expectedFiles);
  }
}

/**
 * Validate that all expected images were copied
 * @param {string} sourceDir - Source directory
 * @param {string} destDir - Destination directory
 * @param {Array} files - List of files in source directory
 * @param {Array} copiedFiles - List of copied files
 * @param {Array} expectedFiles - List of expected files
 */
function validateCopiedImages(sourceDir, destDir, files, copiedFiles, expectedFiles) {
  const missingImages = expectedFiles.filter(image => !copiedFiles.includes(image));
  
  if (missingImages.length === 0) {
    console.log('All expected images were copied successfully');
    return;
  }
  
  console.warn(`Warning: ${missingImages.length} images referenced in reviews.json were not found`);
  
  // Try to find and fix missing images
  missingImages.forEach(image => {
    console.warn(`  - Missing: ${image}`);
    
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
      } catch (error) {
        console.error(`    Failed to auto-correct: ${error.message}`);
      }
    }
  });
}

/**
 * Main function to copy all assets
 */
async function copyAllAssets() {
  console.log('Starting asset copy process...');
  const startTime = Date.now();
  
  try {
    // Ensure all destination directories exist
    Object.values(CONFIG.directories.destination).forEach(ensureDirectoryExists);
    
    // Create default review image
    createDefaultReviewImage();
    
    // Get expected images from reviews.json
    const expectedImages = getExpectedImagesFromReviews();
    
    // Copy review images
    console.log('Copying review images...');
    copyFiles(
      CONFIG.directories.source.images, 
      CONFIG.directories.destination.images, 
      { isImage: true, expectedFiles: expectedImages }
    );
    
    // Copy data files
    console.log('Copying data files...');
    copyFiles(
      CONFIG.directories.source.data, 
      CONFIG.directories.destination.data
    );
    
    // Copy badge images
    console.log('Copying badge images...');
    copyFiles(
      CONFIG.directories.source.badges, 
      CONFIG.directories.destination.badges
    );
    
    // Copy component files
    console.log('Copying component files...');
    copyFiles(
      CONFIG.directories.source.components, 
      CONFIG.directories.destination.components
    );
    
    const endTime = Date.now();
    console.log(`Asset copy process completed in ${(endTime - startTime) / 1000} seconds`);
  } catch (error) {
    console.error('Error in asset copy process:', error);
    process.exit(1);
  }
}

// Execute the main function
copyAllAssets();
