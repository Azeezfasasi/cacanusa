# PDF Upload Quick Reference

## Installation ✅ Complete

```bash
npm install react-pdf pdfjs-dist
```

## Modified Files

### 1. Blog Model

**File**: `src/app/server/models/Blog.js`

```javascript
pdfFile: { type: String },  // Added this line
```

### 2. Add Blog Form

**File**: `src/app/dashboard/add-blog/page.js`

**State Added**:

```javascript
pdfFile: null,
pdfFileName: ''
```

**Functions Added**:

- `handlePdfChange(e)` - Validates and stores PDF file
- `removePdf()` - Clears PDF selection

**UI Added**:

- PDF upload section in Media fieldset
- File preview with size display
- Remove button
- Validation messages

### 3. Blog Detail Page

**File**: `src/app/blog/[slug]/page.js`

**Imports Added**:

```javascript
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
```

**State Added**:

```javascript
const [numPages, setNumPages] = useState(null);
const [pageNumber, setPageNumber] = useState(1);
```

**UI Added**:

- PDF Document section with viewer
- Page navigation buttons
- Page counter
- Download button
- Error & loading states

## Features

### Upload

✅ Drag-and-drop interface
✅ File type validation (PDF only)
✅ File size validation (max 100MB)
✅ Cloudinary integration
✅ File preview with size

### Display

✅ Interactive PDF viewer
✅ Page navigation (Previous/Next)
✅ Page counter
✅ Download button
✅ Error handling
✅ Loading states
✅ Responsive design

## File Size

- **Max Upload**: 100MB
- **Perfect for**: 25MB-50MB PDFs
- **Storage**: Cloudinary CDN

## API Integration

Uses existing `/api/blog` endpoint

- `POST /api/blog` - Create blog with PDF
- PDF file sent as FormData
- Cloudinary handles upload automatically

## Validation

**Frontend**:

```javascript
// PDF only
if (file.type !== "application/pdf") {
  /* error */
}

// Max 100MB
if (file.size > 100 * 1024 * 1024) {
  /* error */
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

**PDF won't upload?**

- Check file is .pdf format
- File size < 100MB
- Check Cloudinary credentials in .env

**PDF won't display?**

- Check browser console for errors
- Verify Cloudinary URL is correct
- Try different PDF file

**Slow loading?**

- Check internet connection
- Large PDFs may take time
- PDF.js worker loads from CDN

## Code Snippets

### Upload Handler

```javascript
function handlePdfChange(e) {
  const file = e.target.files?.[0] || null;
  if (file) {
    if (file.type !== "application/pdf") {
      setMessage({ type: "error", text: "Must be PDF" });
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setMessage({ type: "error", text: "Max 100MB" });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      pdfFile: file,
      pdfFileName: file.name,
    }));
  }
}
```

### Viewer Component

```javascript
<Document file={blog.pdfFile}
  onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
  <Page pageNumber={pageNumber} />
</Document>

<button onClick={() => setPageNumber(pageNumber - 1)}>
  ← Previous
</button>
<button onClick={() => setPageNumber(pageNumber + 1)}>
  Next →
</button>
```

## Environment Variables Required

Already configured:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Next Steps

1. Test PDF upload with blog
2. Test PDF viewing in blog detail
3. Test with large PDFs (25MB+)
4. Deploy to production
5. Monitor Cloudinary usage

## Support

See `PDF_UPLOAD_IMPLEMENTATION.md` for detailed documentation
