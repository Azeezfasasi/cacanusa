# Testimonials System - Development & Deployment Guide

## 🚀 Development Setup

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Next.js 15.5.7 (already in your project)
- `.env.local` file with `MONGODB_URI`

### Initial Setup (First Time)

```bash
# 1. Ensure dependencies are installed
npm install

# 2. Verify .env.local has MongoDB URI
# File: .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# 3. Seed database with initial testimonials
node seed-testimonials.js

# 4. Start development server
npm run dev

# 5. Test in browser
# Homepage: http://localhost:3000
# Admin: http://localhost:3000/dashboard/testimonial-content
# API: http://localhost:3000/api/testimonial
```

### Verify Installation

```bash
# Check API endpoint
curl http://localhost:3000/api/testimonial

# Expected response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Chisom Obi",
      "position": "Community Member & Youth Leader",
      "message": "...",
      "rating": 5,
      "order": 0,
      "isActive": true
    }
  ],
  "count": 3
}

# Check admin dashboard loads
# Visit http://localhost:3000/dashboard/testimonial-content
# Should see testimonials list with edit/delete buttons
```

---

## 📝 Development Workflow

### Adding a New Feature

#### Example: Add Image Support to Testimonials

1. **Update Model**

   ```javascript
   // In src/app/server/models/Testimonial.js
   image: {
     url: { type: String, default: null },
     alt: { type: String, default: null }
   }
   ```

2. **Update Admin Dashboard**

   ```javascript
   // In src/app/dashboard/testimonial-content/page.js
   // Add image input fields in form
   <input
     type="text"
     placeholder="Image URL"
     value={editingItem.image?.url || ""}
     onChange={(e) =>
       setEditingItem({
         ...editingItem,
         image: { ...editingItem.image, url: e.target.value },
       })
     }
   />
   ```

3. **Update Frontend Component**

   ```javascript
   // In src/components/home-component/TestimonialsSection.js
   // Add image rendering
   {
     testimonial.image?.url && (
       <img src={testimonial.image.url} alt={testimonial.image.alt} />
     );
   }
   ```

4. **Test**
   - Add testimonial with image URL via admin
   - Verify image displays on homepage
   - Test with missing image gracefully

### Modifying Validation Rules

#### Example: Increase Message Limit to 1000 Characters

1. **Update Model**

   ```javascript
   // In src/app/server/models/Testimonial.js
   message: {
     type: String,
     required: [true, 'Please add a testimonial message'],
     trim: true,
     maxlength: [1000, 'Message cannot exceed 1000 characters']  // Changed
   }
   ```

2. **Update Admin Dashboard**

   ```javascript
   // Update character counter max value
   maxlength={1000}  // Changed from 500
   // And update validation message
   ```

3. **Test**
   - Try saving message with >500 characters
   - Should succeed now (previously would fail)
   - Character counter should show up to 1000

---

## 🧪 Testing Guide

### Manual Testing Checklist

#### API Tests

```bash
# 1. Test GET all testimonials
curl http://localhost:3000/api/testimonial

# 2. Test GET with includeInactive
curl http://localhost:3000/api/testimonial?includeInactive=true

# 3. Test POST (create)
curl -X POST http://localhost:3000/api/testimonial \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "position": "Team Lead",
    "message": "Great experience with CANAN USA",
    "rating": 5
  }'

# 4. Test PUT (update) - replace ID with actual ID
curl -X PUT http://localhost:3000/api/testimonial/65abc123def456 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "position": "Project Manager",
    "message": "Updated testimonial text",
    "rating": 4
  }'

# 5. Test DELETE - replace ID with actual ID
curl -X DELETE http://localhost:3000/api/testimonial/65abc123def456

# 6. Test 404 error
curl http://localhost:3000/api/testimonial/invalid-id

# 7. Test validation error (missing required field)
curl -X POST http://localhost:3000/api/testimonial \
  -H "Content-Type: application/json" \
  -d '{ "name": "Only Name" }'
```

#### UI Tests

1. **Homepage**

   - [ ] Testimonials display in 3-column grid
   - [ ] Loading state shows briefly
   - [ ] Star ratings display correctly
   - [ ] Responsive on mobile (1 column)
   - [ ] Responsive on tablet (2 columns)

2. **Admin Dashboard**

   - [ ] Page loads with all testimonials
   - [ ] Can edit testimonial name
   - [ ] Can edit testimonial position
   - [ ] Can edit testimonial message
   - [ ] Can change rating (1-5)
   - [ ] Can toggle active/inactive
   - [ ] Can reorder up/down
   - [ ] Can delete with confirmation
   - [ ] Can add new testimonial
   - [ ] Form validation works
   - [ ] Error messages display
   - [ ] Success messages display

3. **Form Validation**

   - [ ] Can't save without name
   - [ ] Can't save without position
   - [ ] Can't save without message
   - [ ] Message length limited to 500
   - [ ] Name limited to 100 chars
   - [ ] Position limited to 150 chars

4. **Error Handling**
   - [ ] API error shows message
   - [ ] DB error shows gracefully
   - [ ] Network error shows fallback
   - [ ] 404 handled properly

### Automated Testing (Optional)

```javascript
// Example Jest test for API endpoint
// File: src/app/api/testimonial/__tests__/route.test.js

import { GET, POST } from "../route";

describe("/api/testimonial", () => {
  test("GET returns testimonials", async () => {
    const request = new Request("http://localhost:3000/api/testimonial");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  test("POST validates required fields", async () => {
    const request = new Request("http://localhost:3000/api/testimonial", {
      method: "POST",
      body: JSON.stringify({ name: "Test" }), // Missing fields
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
```

---

## 🔧 Troubleshooting During Development

### Issue: API Returns 404

**Symptoms:** API endpoint not found when visiting `/api/testimonial`

**Solutions:**

1. Check file path is correct: `src/app/api/testimonial/route.js`
2. Verify Next.js server is running: `npm run dev`
3. Restart server: Ctrl+C and `npm run dev`
4. Check port 3000 is available
5. Clear `.next` cache: `rm -rf .next && npm run dev`

### Issue: Testimonials Don't Save

**Symptoms:** Click Save but nothing happens, no error message

**Solutions:**

1. Check browser console for JavaScript errors
2. Check Network tab for API response status
3. Verify form validation isn't blocking (fill all fields)
4. Verify MongoDB connection: check `.env.local`
5. Check MongoDB has write permissions
6. Restart server and try again

### Issue: Loading Forever

**Symptoms:** "Loading testimonials..." shows on homepage indefinitely

**Solutions:**

1. Check `/api/testimonial` directly: `curl http://localhost:3000/api/testimonial`
2. Verify MongoDB is running and accessible
3. Verify `.env.local` has correct MONGODB_URI
4. Check server logs for database errors
5. Run seed script again: `node seed-testimonials.js`

### Issue: Component Won't Render

**Symptoms:** Blank page or error on homepage

**Solutions:**

1. Check browser console for JavaScript errors
2. Verify TestimonialsSection component exists
3. Verify component is imported in page.js
4. Check that component has `'use client'` directive
5. Verify React imports are correct
6. Hard refresh: Ctrl+Shift+R

### Issue: Admin Dashboard Won't Load

**Symptoms:** Dashboard page shows error or blank

**Solutions:**

1. Verify URL: `http://localhost:3000/dashboard/testimonial-content`
2. Check page file exists: `src/app/dashboard/testimonial-content/page.js`
3. Verify page has `'use client'` directive
4. Check browser console for errors
5. Verify database connection works
6. Try refreshing the page

---

## 📦 Building for Production

### Pre-Build Checklist

- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] .env.local configured for production
- [ ] Database backups created
- [ ] Seed data prepared for production

### Build Command

```bash
# Build Next.js application
npm run build

# If build fails, check:
# 1. All imports are correct
# 2. No TypeScript errors
# 3. All environment variables set
# 4. Database connection works
```

### Production Environment Variables

```bash
# .env.production
MONGODB_URI=mongodb+srv://prod-user:prod-pass@prod-cluster.mongodb.net/prod-db
NODE_ENV=production
```

### Deployment Steps

#### Option 1: Vercel (Recommended)

```bash
# 1. Push code to GitHub
git add .
git commit -m "Add testimonials system"
git push

# 2. Connect repo to Vercel
# Visit: vercel.com
# Click: Import Project
# Select: Your repository
# Click: Deploy

# 3. Set environment variables in Vercel dashboard
# MONGODB_URI=your-production-uri

# 4. Seed production database (one time)
# Run in Vercel CLI or MongoDB Atlas directly
```

#### Option 2: Self-Hosted (Linux/Ubuntu)

```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Clone repository
git clone your-repo-url
cd your-project

# 3. Install dependencies
npm install

# 4. Set production variables
echo "MONGODB_URI=your-production-uri" > .env.production

# 5. Build application
npm run build

# 6. Seed database (one time)
node seed-testimonials.js

# 7. Start production server (use PM2)
npm install -g pm2
pm2 start npm --name "cananusa" -- start
pm2 save

# 8. Setup nginx reverse proxy (optional)
# Configure nginx to forward port 80/443 to port 3000
```

#### Option 3: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t cananusa-app .
docker run -e MONGODB_URI="..." -p 3000:3000 cananusa-app
```

---

## 📊 Monitoring & Maintenance

### Log Monitoring

```bash
# View application logs (Vercel)
vercel logs

# View application logs (PM2)
pm2 logs cananusa

# View MongoDB Atlas logs
# https://cloud.mongodb.com → Logs
```

### Database Maintenance

```javascript
// Clean up test testimonials (monthly)
// In MongoDB Atlas or mongosh terminal
db.testimonials.deleteMany({ name: "Test" });

// View collection stats
db.testimonials.stats();

// Check index performance
db.testimonials.aggregate([{ $indexStats: {} }]);
```

### Performance Monitoring

```javascript
// Add to API routes to log slow queries
console.time('API_QUERY');
const testimonials = await Testimonial.find(...);
console.timeEnd('API_QUERY');
```

---

## 🎓 Code Standards

### Naming Conventions

- Models: PascalCase (Testimonial)
- Collections: lowercase (testimonials)
- Functions: camelCase (fetchTestimonials)
- Constants: UPPER_SNAKE_CASE (API_TIMEOUT)
- Files: kebab-case (testimonial-content)

### Code Style

- Use 2-space indentation
- Async/await over .then()
- Arrow functions for callbacks
- Const over let over var
- Template literals for strings

### Error Handling

- Always catch async errors
- Return proper HTTP status codes
- Log errors for debugging
- Show user-friendly messages

---

## 🚀 Performance Optimization Tips

### Database Optimization

```javascript
// Good: Use lean() for read-only queries
const testimonials = await Testimonial.find({}).lean();

// Good: Use indexes for common queries
db.testimonials.createIndex({ order: 1, isActive: 1 });

// Avoid: Full document metadata when not needed
const testimonials = await Testimonial.find({}); // Slower
```

### API Optimization

```javascript
// Good: Pagination for large datasets
const page = req.query.page || 1;
const limit = 10;
const skip = (page - 1) * limit;
const testimonials = await Testimonial.find({}).skip(skip).limit(limit);

// Good: Caching for frequently accessed data
const cache = new Map();
const getCachedTestimonials = async () => {
  if (cache.has("testimonials")) {
    return cache.get("testimonials");
  }
  const data = await Testimonial.find({}).lean();
  cache.set("testimonials", data);
  return data;
};
```

### Component Optimization

```javascript
// Good: Use React.memo for testimonial cards
const TestimonialCard = React.memo(({ testimonial }) => {
  return (
    // Card JSX
  );
});

// Good: Lazy load images
<img loading="lazy" src={url} alt="author" />

// Good: Debounce search
const [search, setSearch] = useState('');
const debounceSearch = useMemo(
  () => debounce((value) => {...}, 300),
  []
);
```

---

## 📚 Additional Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [MongoDB Mongoose Documentation](https://mongoosejs.com)
- [React Hooks Guide](https://react.dev/reference/react)
- [REST API Best Practices](https://restfulapi.net)

---

## ✅ Final Checklist

Before considering the project complete:

- [ ] All files created successfully
- [ ] No compilation errors
- [ ] Database seeding works
- [ ] API endpoints functional
- [ ] Admin dashboard CRUD works
- [ ] Homepage displays testimonials
- [ ] Form validation working
- [ ] Error handling working
- [ ] Documentation complete
- [ ] Development workflow tested
- [ ] Production build passes
- [ ] Performance optimized

---

**Development Guide Complete** ✅

Now ready for development, testing, and production deployment!
