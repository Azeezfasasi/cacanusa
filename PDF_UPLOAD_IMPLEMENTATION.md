# PDF Upload & Display Implementation Guide

## Overview

This document outlines the PDF upload and display functionality that has been integrated into the blog system. Users can now upload PDF files (up to 100MB) to Cloudinary and display them with an interactive PDF viewer.

## Features Implemented

### 1. **PDF File Upload**

- Users can upload PDF files from the "Create New Blog Post" dashboard
- File size limit: 100MB (suitable for large documents like 25MB-50MB PDFs)
- Files are uploaded directly to Cloudinary using the existing Cloudinary infrastructure
- PDF upload is optional - blogs can be created without PDFs

### 2. **PDF Display with React-PDF**

- PDFs are displayed with page-by-page navigation
- Features include:
  - Previous/Next page buttons
  - Page counter showing current page
  - Download button for users to download the PDF
  - Responsive design that works on mobile and desktop
  - Error handling for corrupted or invalid PDFs

### 3. **Database Model Updates**

- `pdfFile` field added to Blog schema to store Cloudinary URL

## Installation

### Libraries Added

```bash
npm install react-pdf pdfjs-dist
```

## File Changes

### 1. Blog Model - `src/app/server/models/Blog.js`

Added new field to store PDF URL:

```javascript
pdfFile: { type: String },
```

### 2. Add Blog Page - `src/app/dashboard/add-blog/page.js`

**State Updates:**

- Added `pdfFile` (File object)
- Added `pdfFileName` (display name)

**New Functions:**

- `handlePdfChange()` - Handles PDF file selection with validation
  - Validates file type (must be PDF)
  - Validates file size (max 100MB)
  - Stores file in state

- `removePdf()` - Removes selected PDF from form

**Form Updates:**

- Added PDF upload section in the Media fieldset
- Includes drag-and-drop UI similar to image uploads
- Shows file size and name when selected
- Remove button to clear selection

### 3. Blog Detail Page - `src/app/blog/[slug]/page.js`

**New Imports:**

```javascript
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
```

**New State:**

- `numPages` - Total number of pages in PDF
- `pageNumber` - Current page being viewed

**PDF Viewer Component:**

- Displays PDF with page navigation
- Shows current page/total pages
- Previous/Next buttons for page navigation
- Download button to download the PDF
- Error handling for failed PDF loads
- Loading state while PDF is being loaded

## How It Works

### Upload Flow

1. User selects PDF file from "Create New Blog Post" form
2. File validation occurs:
   - Must be PDF format
   - Size must be < 100MB
3. File is sent to server via FormData
4. Backend blog controller uploads file to Cloudinary
5. Cloudinary returns secure URL
6. URL is stored in database

### Display Flow

1. Blog detail page loads
2. If `pdfFile` exists, PDF viewer component is rendered
3. PDF is loaded from Cloudinary URL
4. User can navigate pages, view current page, and download

## Usage Example

### Creating a Blog with PDF

1. Go to Dashboard → Create New Blog Post
2. Fill in blog details (title, content, category, etc.)
3. Scroll to Media section
4. Click "Click to upload" or drag-drop a PDF file
5. File info will display with file size
6. Click "Publish Post" to create blog with PDF

### Viewing PDF in Blog Post

1. Navigate to blog post detail page
2. Scroll past featured image
3. "PDF Document" section will appear if PDF exists
4. Use Previous/Next buttons to navigate pages
5. Click "Download" to download PDF

## Technical Details

### File Size Handling

- Maximum upload size: 100MB
- Suitable for documents like:
  - 25MB PDF documents
  - 50MB PDF documents
  - Large reports and ebooks

### Cloudinary Integration

- Uses existing Cloudinary setup
- PDFs stored in `/cananusa/blog/` folder
- Automatic resource_type detection by uploadToCloudinary utility

### Performance Considerations

- PDFs are streamed from Cloudinary CDN
- Page-by-page rendering (not full document)
- Lazy loading via Document component
- Worker file loaded from CDN for performance

## Error Handling

### Frontend Validation

- File type check (must be PDF)
- File size check (max 100MB)
- Error messages displayed to user

### PDF Display

- Error message shown if PDF fails to load
- Loading state while PDF initializes
- Graceful fallback if PDF is corrupted

## Browser Compatibility

Works in modern browsers:

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Accessibility

- PDF viewer includes keyboard navigation
- Page counter clearly displays current position
- Download button for alternative access
- Semantic HTML for screen readers

## Future Enhancements

Potential improvements:

1. PDF zoom controls
2. Search/Find within PDF
3. Annotation tools
4. Print PDF directly
5. PDF thumbnail previews
6. Multiple PDF support per blog
7. PDF preview before upload

## Troubleshooting

### PDF Not Displaying

- Check Cloudinary URL is correct
- Verify PDF is valid (can open locally)
- Check browser console for errors
- Ensure CORS is properly configured

### Large PDF Upload Fails

- Reduce file size
- Maximum is 100MB
- Compress PDF before uploading

### Worker File Not Loading

- Check CDN availability
- Verify internet connection
- Check browser security settings

## API Integration

The existing blog API (`/api/blog`) already handles PDF uploads through the `uploadToCloudinary` helper function in the blog controller. No additional API endpoints needed.

### Form Data Sent

```javascript
FormData containing:
- pdfFile (File object)
- Other blog fields
```

### Response

```javascript
{
  _id: "...",
  pdfFile: "https://res.cloudinary.com/...",
  // other blog fields
}
```
