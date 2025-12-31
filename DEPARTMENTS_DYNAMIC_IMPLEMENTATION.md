# Dynamic Departments Implementation

## Overview

The leadership management system has been updated to support dynamic departments. Instead of hardcoded department values, administrators can now create, update, and delete departments through a dedicated management interface.

## What Changed

### Database

- **New Model**: `Department` model created at `src/app/server/models/Department.js`

  - Fields: name, slug, description, displayOrder, isActive, createdBy, timestamps
  - Name and slug are unique to prevent duplicates

- **Updated Model**: `Leadership` model updated to reference Department
  - Changed `department` field from enum string to ObjectId reference
  - Removed hardcoded department values

### API Endpoints

#### GET `/api/departments`

- Fetch all active departments by default
- Query parameter `active=false` to include inactive departments
- Returns: `{ departments: [...] }`

#### POST `/api/departments`

- Create a new department
- Required role: admin or committee
- Request body: `{ name, description?, displayOrder? }`
- Returns: Created department object

#### GET `/api/departments/[id]`

- Fetch a single department by ID
- Returns: Department object

#### PUT `/api/departments/[id]`

- Update department
- Required role: admin or committee
- Request body: `{ name?, description?, displayOrder?, isActive? }`
- Returns: Updated department object

#### DELETE `/api/departments/[id]`

- Delete department
- Required role: admin only
- Prevents deletion if leadership members are assigned
- Returns: Success message

### Frontend Pages

#### 1. Dashboard - Manage Departments

**Route**: `/dashboard/manage-departments`

- List all departments (including inactive)
- Create new departments
- Edit existing departments
- Delete departments
- Admin/Committee only access

#### 2. Dashboard - Manage Leadership

**Route**: `/dashboard/manage-leadership`

- Department select now fetches from database
- Shows department name instead of slug
- Filter by dynamic departments

#### 3. Public Leadership Page

**Route**: `/leadership`

- Displays leadership members grouped by dynamic departments
- Filter buttons populated from database
- Shows department names

### Utilities

#### New API Client: `src/app/utils/departmentApi.js`

- `fetchDepartments()` - Get active departments
- `fetchAllDepartments()` - Get all departments
- `fetchDepartment(id)` - Get single department
- `createDepartment(data)` - Create department
- `updateDepartment(id, data)` - Update department
- `deleteDepartment(id)` - Delete department

### Seed Script

**File**: `seed-departments.js`

- Creates default departments based on the original hardcoded values
- Safe to run multiple times (skips if departments exist)
- Run with: `node seed-departments.js`

## Database Migration

To migrate existing leadership data from string-based departments to ObjectId references:

1. First, seed the default departments:

   ```bash
   node seed-departments.js
   ```

2. Then run a migration script to map existing leadership records to department IDs

## Usage

### For Admins/Committee Members

1. **Create a Department**:

   - Go to `/dashboard/manage-departments`
   - Click "Add Department"
   - Fill in name, description, and display order
   - Click "Create"

2. **Edit a Department**:

   - Click "Edit" on any department
   - Update fields as needed
   - Click "Update"

3. **Delete a Department**:
   - Click "Delete" on a department
   - Confirm deletion
   - Note: Cannot delete if leadership members are assigned

### For Users Adding Leadership Members

1. The department field now shows a dropdown of available departments
2. Select from the dynamic list instead of hardcoded values
3. Department information is fetched in real-time

## Key Features

✓ Dynamic department creation and management
✓ Department ordering/sorting support
✓ Active/Inactive status for departments
✓ Prevents deletion of departments with assigned members
✓ Automatic slug generation from department name
✓ Timestamp tracking (createdAt, updatedAt)
✓ Creator tracking (createdBy user reference)
✓ Responsive admin interface
✓ Proper access control and authorization

## Files Modified/Created

### New Files:

- `src/app/server/models/Department.js`
- `src/app/api/departments/route.js`
- `src/app/api/departments/[id]/route.js`
- `src/app/utils/departmentApi.js`
- `src/app/dashboard/manage-departments/page.js`
- `seed-departments.js`

### Modified Files:

- `src/app/server/models/Leadership.js` - Changed department field
- `src/app/api/leadership/route.js` - Added populate for department
- `src/app/dashboard/manage-leadership/page.js` - Fetch and use dynamic departments
- `src/app/leadership/page.js` - Fetch and use dynamic departments

## Next Steps

1. Run the seed script to create default departments
2. Test department management in `/dashboard/manage-departments`
3. Test creating/editing leadership members with new department system
4. Migrate any existing leadership data if needed
