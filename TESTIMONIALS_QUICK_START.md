# Testimonials System - Quick Start Guide

## What's Been Created

### Files Created

✅ **Testimonial Model** → `src/app/server/models/Testimonial.js`
✅ **API Routes** → `src/app/api/testimonial/route.js` and `[id]/route.js`
✅ **Admin Dashboard** → `src/app/dashboard/testimonial-content/page.js`
✅ **Seed Script** → `seed-testimonials.js`
✅ **Full Documentation** → `TESTIMONIALS_SYSTEM.md`

### Files Updated

✅ **Frontend Component** → `src/components/home-component/TestimonialsSection.js`

- Now fetches testimonials from API
- Shows loading state
- Falls back to default testimonials if API unavailable
- Displays dynamic star ratings

## Quick Start

### 1. Seed the Database (First Time Only)

```bash
node seed-testimonials.js
```

This adds 3 default testimonials to your database.

### 2. Start Your Dev Server

```bash
npm run dev
```

### 3. Access the Admin Dashboard

Visit: **http://localhost:3000/dashboard/testimonial-content**

### 4. Manage Testimonials

- **Add**: Click "Add Testimonial" button
- **Edit**: Click the pencil icon on any testimonial
- **Delete**: Click the trash icon (with confirmation)
- **Reorder**: Use up/down arrow buttons
- **Toggle**: Check/uncheck "Active" to show/hide on homepage

### 5. View on Homepage

Visit: **http://localhost:3000**
See your testimonials in the "What Our Community Members Say" section

## What the Component Does

### Frontend (TestimonialsSection.js)

1. Loads on page mount
2. Shows "Loading testimonials..." while fetching
3. Fetches from `/api/testimonial` endpoint
4. Displays testimonials in a 3-column responsive grid
5. Shows star ratings (1-5 stars)
6. Falls back to default testimonials if API fails

### Admin Dashboard (testimonial-content/page.js)

1. Lists all testimonials (including inactive ones)
2. Shows name, position, message, rating, order, and status
3. Edit any field and click Save to update
4. Click Add Testimonial to create new ones
5. Reorder using up/down buttons
6. Delete with confirmation dialog
7. Toggle active/inactive status to show/hide from homepage

### API Endpoints

- **GET /api/testimonial** - Get all active testimonials (sorted by order)
- **GET /api/testimonial?includeInactive=true** - Get all including inactive
- **POST /api/testimonial** - Create new testimonial
- **GET /api/testimonial/[id]** - Get single testimonial
- **PUT /api/testimonial/[id]** - Update testimonial
- **DELETE /api/testimonial/[id]** - Delete testimonial

## Form Validation

### Required Fields

- ✅ **Name** (1-100 characters)
- ✅ **Position** (1-150 characters)
- ✅ **Message** (1-500 characters)

### Optional Fields

- Rating (1-5, defaults to 5)
- Image URL and alt text
- Order (for sorting)
- Active status

### Form Rules

- All required fields must be filled
- Message has 500 character limit with counter
- Rating must be 1-5 stars
- Position/title describes author's role

## Database Structure

Each testimonial stored in MongoDB with:

```javascript
{
  _id: ObjectId,
  name: String,           // Required
  position: String,       // Required
  message: String,        // Required
  rating: Number,         // 1-5, default 5
  order: Number,          // Default 0
  isActive: Boolean,      // Default true
  image: {
    url: String,
    alt: String
  },
  createdAt: Date,        // Auto-set
  updatedAt: Date         // Auto-set
}
```

## Troubleshooting

### "Loading testimonials..." shows forever

- Check MongoDB connection in `.env.local`
- Verify API endpoint: `curl http://localhost:3000/api/testimonial`
- Check browser developer tools → Network tab for errors
- Ensure server is running: `npm run dev`

### Admin dashboard won't load

- Verify you're at the correct URL: `http://localhost:3000/dashboard/testimonial-content`
- Check browser console for JavaScript errors
- Ensure you have admin access
- Try refreshing the page

### Can't save testimonial

- Verify all required fields (name, position, message) are filled
- Check message length (max 500 characters)
- Ensure rating is between 1-5
- Check browser console → Network tab for API errors

### Testimonials not appearing on homepage

- Check that testimonials have `isActive: true` in admin dashboard
- Verify API is returning data: `curl http://localhost:3000/api/testimonial`
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check that homepage component is rendering

### Can't reorder testimonials

- Verify database connection
- Ensure you have write permissions
- Try refreshing the admin dashboard page
- Check server logs for errors

## Common Tasks

### Add a New Testimonial

1. Go to `/dashboard/testimonial-content`
2. Click "Add Testimonial"
3. Fill in: Name, Position, Message
4. Set Rating (1-5 stars)
5. Click Save
6. Appears immediately on homepage if active

### Edit a Testimonial

1. Click the ✏️ pencil icon next to testimonial
2. Modify any field
3. Click Save
4. Changes appear immediately

### Hide a Testimonial (Without Deleting)

1. Click the ✏️ pencil icon
2. Uncheck the "Active" checkbox
3. Click Save
4. Testimonial disappears from homepage but stays in database

### Delete a Testimonial

1. Click the 🗑️ trash icon
2. Confirm deletion in dialog
3. Testimonial is permanently removed

### Change Display Order

1. Use ⬆️ and ⬇️ arrow buttons next to each testimonial
2. Changes save automatically
3. Homepage updates immediately

## System Performance

✅ **Fast Queries** - Database indexes optimize lookups
✅ **Responsive UI** - Admin dashboard responds immediately
✅ **Loading States** - Users see feedback during operations
✅ **Error Handling** - Graceful fallbacks if API unavailable
✅ **Mobile Friendly** - Responsive grid (1-3 columns)

## Next Steps

1. ✅ Run seed script: `node seed-testimonials.js`
2. ✅ Start dev server: `npm run dev`
3. ✅ Add/edit testimonials in admin dashboard
4. ✅ View on homepage
5. ✅ Deploy to production when ready

## System Statistics

- **Model:** Testimonial with 9 fields
- **API Endpoints:** 5 routes (GET, POST, PUT, DELETE)
- **Admin Features:** CRUD + Reorder + Toggle Status
- **Validation Rules:** 3 required fields, length limits
- **Fallback Content:** 3 default testimonials
- **Database Indexes:** 2 (compound + single)
- **Responsive Breakpoints:** Mobile, Tablet, Desktop

---

**All systems operational and ready to use!** ✅
