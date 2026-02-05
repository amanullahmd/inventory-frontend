# Sign-In Page - Auto-Fill & Main Branch Credentials Guide

## Overview
The sign-in page now includes:
1. **Main Branch Credential** - Super admin with access to all branches
2. **Auto-Fill Functionality** - Click any credential to auto-populate email and password
3. **Hierarchical Visibility** - Each level can see subordinate branches
4. **Visual Feedback** - Selected credential is highlighted

## Main Branch Credential

**Role**: Main Branch Admin (Super Admin)  
**Branch**: প্রাথমিক শিক্ষা অধিদপ্তর (Main)  
**Email**: `main@dpe.gov.bd`  
**Password**: `main123`  
**Permissions**: 
- Can see all branches (Division, District, Upazila, School)
- Can manage entire system
- Full access to all warehouses and supplies
- Can override any decision

---

## Hierarchical Visibility

### Main Branch Admin
✅ Can see: All divisions, districts, upazilas, schools  
✅ Can manage: Entire system  
✅ Can supply: All levels

### Division Admin
✅ Can see: All districts, upazilas, schools under division  
✅ Can manage: Division-level operations  
✅ Can supply: Districts, upazilas, schools

### District Manager
✅ Can see: All upazilas and schools under district  
✅ Can manage: District-level operations  
✅ Can supply: Upazilas and schools

### Upazila Manager
✅ Can see: All schools under upazila  
✅ Can manage: Upazila-level operations  
✅ Can supply: Schools only

### School Principal
✅ Can see: Own school only  
✅ Can manage: School-level operations  
✅ Can request: Supplies from upazila

---

## Auto-Fill Feature

### How It Works
1. User clicks on any credential in the demo credentials list
2. Email and password fields are automatically populated
3. Selected credential is highlighted with blue background
4. User can click "Sign in" button to login

### Visual Indicators
- **Selected State**: Blue background with darker border
- **Hover State**: Light blue background on unselected credentials
- **Icon Color**: Changes based on selection state
- **Description**: Shows what each role can do

### Credential List Structure
```
Main Branch Admin (Crown Icon)
├─ Division Admin (Shield Icon)
├─ District Manager 1 (Building Icon)
├─ District Manager 2 (Building Icon)
├─ Upazila Manager 1 (MapPin Icon)
├─ Upazila Manager 2 (MapPin Icon)
├─ Upazila Manager 3 (MapPin Icon)
├─ School Principal 1 (School Icon)
├─ School Principal 2 (School Icon)
└─ School Principal 3 (School Icon)
```

---

## Complete Credentials List

| # | Role | Branch | Email | Password | Can See |
|---|------|--------|-------|----------|---------|
| 1 | Main Branch Admin | প্রাথমিক শিক্ষা অধিদপ্তর (Main) | main@dpe.gov.bd | main123 | All branches |
| 2 | Division Admin | ঢাকা বিভাগ | admin@dpe.gov.bd | admin123 | All lower branches |
| 3 | District Manager | ঢাকা জেলা | district.dhaka@dpe.gov.bd | district123 | Upazilas & Schools |
| 4 | District Manager | নারায়ণগঞ্জ জেলা | district.narayanganj@dpe.gov.bd | district123 | Upazilas & Schools |
| 5 | Upazila Manager | ধানমন্ডি উপজেলা | upazila.dhanmondi@dpe.gov.bd | upazila123 | Schools in upazila |
| 6 | Upazila Manager | মোহাম্মদপুর উপজেলা | upazila.mohammadpur@dpe.gov.bd | upazila123 | Schools in upazila |
| 7 | Upazila Manager | সোনারগাঁ উপজেলা | upazila.sonargaon@dpe.gov.bd | upazila123 | Schools in upazila |
| 8 | School Principal | ধানমন্ডি প্রাথমিক বিদ্যালয় | school.dhanmondi@dpe.gov.bd | school123 | Own school only |
| 9 | School Principal | মোহাম্মদপুর প্রাথমিক বিদ্যালয় | school.mohammadpur@dpe.gov.bd | school123 | Own school only |
| 10 | School Principal | সোনারগাঁ প্রাথমিক বিদ্যালয় | school.sonargaon@dpe.gov.bd | school123 | Own school only |

---

## Testing Scenarios

### Scenario 1: Main Branch Access
1. Click on "Main Branch Admin" credential
2. Email and password auto-fill
3. Click "Sign in"
4. Verify you can see all branches and warehouses

### Scenario 2: Hierarchical Visibility
1. Login as Division Admin
2. Verify you can see all districts, upazilas, and schools
3. Logout and login as District Manager
4. Verify you can only see your district's upazilas and schools

### Scenario 3: Supply Chain Flow
1. Login as Main Branch Admin
2. View all warehouses and supplies
3. Logout and login as District Manager
4. Request supplies from division
5. Logout and login as Upazila Manager
6. Request supplies from district

### Scenario 4: Auto-Fill Functionality
1. Click different credentials
2. Verify email and password fields update
3. Verify selected credential is highlighted
4. Verify you can sign in with auto-filled credentials

---

## Key Features

✅ **Main Branch Credential**: Super admin with full system access  
✅ **Auto-Fill on Click**: Credentials populate email/password fields  
✅ **Visual Selection**: Selected credential highlighted in blue  
✅ **Hierarchical Visibility**: Each level sees appropriate branches  
✅ **Scrollable List**: All 10 credentials accessible  
✅ **Descriptions**: Each credential shows what it can do  
✅ **Icons**: Different icons for each role level  
✅ **Responsive Design**: Works on desktop and mobile  

---

## Implementation Details

### LoginForm Component
- Accepts `initialEmail` and `initialPassword` props
- Auto-fills form fields when props are provided
- Maintains existing validation and error handling

### SignIn Page
- Uses React state to track selected credentials
- `handleCredentialClick` function updates state
- Passes state to LoginForm component
- Highlights selected credential with conditional styling

### MockData
- Added Main Branch user with ROLE_SUPER_ADMIN
- All users have password field for authentication
- Hierarchical structure maintained in level and levelId fields

---

## Notes

- Main Branch credential provides system-wide access
- Hierarchical users can only see their subordinate levels
- Auto-fill is client-side only (no data sent to server)
- All credentials are dummy data for testing
- Passwords are simple for easy testing
- Selection state resets on page reload
