# Cloudinary Image Upload Integration - Team Management

## Overview

The Team Management dashboard now supports direct image uploads to Cloudinary, eliminating the need to manually enter image URLs.

## What Changed

### 1. Updated Admin Dashboard

**File:** `src/app/dashboard/team-content/page.js`

**New Features:**

- **File Upload Input:** Drag-and-drop or click to upload images
- **Upload Feedback:** Real-time uploading state and success/error messages
- **Photo Preview:** Image displays immediately after upload
- **Dual Input:** Users can either upload or paste a URL manually
- **File Validation:** Only accepts image files, max 5MB

**Key Changes:**

```javascript
// Added uploading state
const [uploading, setUploading] = useState(false);

// New upload handler function
const handleImageUpload = async (e) => {
  // Handles file upload to /api/upload endpoint
  // Automatically populates photo.url with secure_url from Cloudinary
};
```

### 2. New Upload API Route

**File:** `src/app/api/upload/route.js`

**Functionality:**

- Accepts POST requests with FormData containing image file
- Validates file type (must be image/\*)
- Validates file size (max 5MB)
- Uploads to Cloudinary in specified folder
- Returns secure URL from Cloudinary

**Request Format:**

```javascript
const formData = new FormData();
formData.append("file", imageFile);
formData.append("folder", "rayob/team"); // Optional, defaults to rayob/uploads

fetch("/api/upload", {
  method: "POST",
  body: formData,
});
```

**Response Format:**

```json
{
  "success": true,
  "secure_url": "https://res.cloudinary.com/...",
  "message": "Image uploaded successfully"
}
```

### 3. Leverages Existing Cloudinary Setup

- Uses `uploadToCloudinary()` utility from `src/app/server/utils/cloudinary.js`
- Requires environment variables:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

## Usage

### For Admin Users:

1. Go to Dashboard → About Page Contents → Team
2. Click "Add Team Member" or "Edit" existing member
3. Either:
   - **Click the upload box** and select an image file
   - **OR** paste a direct URL in the "Or Enter Photo URL" field
4. Photo preview appears immediately after upload
5. Complete other fields and save

### Upload Box Features:

- Shows "Click to upload" or "Uploading..." status
- Accepts PNG, JPG, GIF files
- File size limit: 5MB
- Automatic upload to Cloudinary folder `rayob/team`
- Secure URL automatically populated

## File Size & Type Constraints

- **Max Size:** 5MB
- **Accepted Formats:** PNG, JPG, GIF (any image/\* MIME type)
- **Cloudinary Folder:** `rayob/team` (organized in Cloudinary)

## Error Handling

Users receive clear error messages for:

- Missing file
- Invalid file type (not an image)
- File too large (over 5MB)
- Upload failures

## Technical Flow

```
User selects image
    ↓
handleImageUpload() function triggered
    ↓
Creates FormData with file + folder
    ↓
POST to /api/upload
    ↓
/api/upload validates file
    ↓
uploadToCloudinary() sends to Cloudinary
    ↓
Cloudinary returns secure_url
    ↓
photo.url state updated automatically
    ↓
Preview displays, user can save
```

## API Endpoint Details

**Endpoint:** `POST /api/upload`

**Parameters:**

- `file` (FormData) - Image file to upload
- `folder` (FormData, optional) - Cloudinary folder path, defaults to 'rayob/uploads'

**Returns:**

- 200 OK: `{ success: true, secure_url: "...", message: "..." }`
- 400 Bad Request: Missing file or invalid file type/size
- 500 Internal Server Error: Cloudinary upload failure

## Integration with Existing Flow

- Photo uploads are stored in Cloudinary folder: `rayob/team`
- Returned URLs are stored in MongoDB as `photo.url`
- Frontend component displays images from returned URLs
- Works seamlessly with edit, delete, and reorder operations

## Future Enhancements (Optional)

- Crop/resize images before upload
- Multiple image uploads (gallery)
- Drag-and-drop support (already works)
- Image optimization presets from Cloudinary
