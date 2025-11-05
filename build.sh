#!/bin/bash

# GitHub Actions Build Script for sooq-alemarat

echo "Starting build process..."

# Create the dist directory
mkdir -p dist

# Copy all HTML files
cp -f *.html dist/ 2>/dev/null || echo "No HTML files found"

# Copy directories if they exist
for dir in assets css js images data legal pages; do
    if [ -d "$dir" ]; then
        cp -r "$dir" dist/
        echo "Copied $dir directory"
    else
        echo "Directory $dir not found, skipping"
    fi
done

# Copy individual files if they exist
for file in manifest.json robots.txt sitemap.xml CNAME; do
    if [ -f "$file" ]; then
        cp "$file" dist/
        echo "Copied $file"
    else
        echo "File $file not found, skipping"
    fi
done

# Copy Google verification files
cp google*.html dist/ 2>/dev/null || echo "No Google verification files found"

# Ensure index.html exists
if [ ! -f "dist/index.html" ]; then
    echo "Warning: No index.html found in dist directory"
    if [ -f "index.html" ]; then
        cp index.html dist/
        echo "Copied index.html to dist"
    fi
fi

echo "Build completed successfully!"
echo "Contents of dist directory:"
ls -la dist/