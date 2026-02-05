# Sign-In Page - Hierarchical Demo Credentials Guide

## Overview
The sign-in page now displays all 9 dummy credentials organized by hierarchical level. Users can easily test the system at different administrative levels.

## Credential Structure

### Level 1: Division (Main Supply Hub)
**Role**: Division Admin  
**Branch**: ঢাকা বিভাগ (Dhaka Division)  
**Email**: `admin@dpe.gov.bd`  
**Password**: `admin123`  
**Permissions**: Full system access, can supply to all lower levels

---

### Level 2: District (Regional Distribution)

#### District 1 - Dhaka
**Role**: District Manager  
**Branch**: ঢাকা জেলা (Dhaka District)  
**Email**: `district.dhaka@dpe.gov.bd`  
**Password**: `district123`  
**Permissions**: Manage district-level distribution, supply to upazilas

#### District 2 - Narayanganj
**Role**: District Manager  
**Branch**: নারায়ণগঞ্জ জেলা (Narayanganj District)  
**Email**: `district.narayanganj@dpe.gov.bd`  
**Password**: `district123`  
**Permissions**: Manage district-level distribution, supply to upazilas

---

### Level 3: Upazila (Sub-District Distribution)

#### Upazila 1 - Dhanmondi
**Role**: Upazila Manager  
**Branch**: ধানমন্ডি উপজেলা (Dhanmondi Upazila)  
**Email**: `upazila.dhanmondi@dpe.gov.bd`  
**Password**: `upazila123`  
**Permissions**: Manage upazila-level distribution, supply to schools

#### Upazila 2 - Mohammadpur
**Role**: Upazila Manager  
**Branch**: মোহাম্মদপুর উপজেলা (Mohammadpur Upazila)  
**Email**: `upazila.mohammadpur@dpe.gov.bd`  
**Password**: `upazila123`  
**Permissions**: Manage upazila-level distribution, supply to schools

#### Upazila 3 - Sonargaon
**Role**: Upazila Manager  
**Branch**: সোনারগাঁ উপজেলা (Sonargaon Upazila)  
**Email**: `upazila.sonargaon@dpe.gov.bd`  
**Password**: `upazila123`  
**Permissions**: Manage upazila-level distribution, supply to schools

---

### Level 4: School (End-User)

#### School 1 - Dhanmondi Primary School
**Role**: School Principal  
**Branch**: ধানমন্ডি প্রাথমিক বিদ্যালয় (Dhanmondi Primary School)  
**Email**: `school.dhanmondi@dpe.gov.bd`  
**Password**: `school123`  
**Permissions**: Request supplies from upazila warehouse

#### School 2 - Mohammadpur Primary School
**Role**: School Principal  
**Branch**: মোহাম্মদপুর প্রাথমিক বিদ্যালয় (Mohammadpur Primary School)  
**Email**: `school.mohammadpur@dpe.gov.bd`  
**Password**: `school123`  
**Permissions**: Request supplies from upazila warehouse

#### School 3 - Sonargaon Primary School
**Role**: School Principal  
**Branch**: সোনারগাঁ প্রাথমিক বিদ্যালয় (Sonargaon Primary School)  
**Email**: `school.sonargaon@dpe.gov.bd`  
**Password**: `school123`  
**Permissions**: Request supplies from upazila warehouse

---

## Testing Scenarios

### Scenario 1: Full Supply Chain Flow
1. Login as **Division Admin** → View all warehouses and supplies
2. Login as **District Manager (Dhaka)** → View district warehouse
3. Login as **Upazila Manager (Dhanmondi)** → View upazila warehouse
4. Login as **School Principal (Dhanmondi)** → Request supplies

### Scenario 2: Demand Approval Workflow
1. Login as **School Principal** → Create demand for supplies
2. Login as **Upazila Manager** → Approve/reject school demand
3. Login as **District Manager** → Approve upazila demand
4. Login as **Division Admin** → Approve district demand

### Scenario 3: Supply Distribution
1. Login as **Division Admin** → Allocate supplies to districts
2. Login as **District Manager** → Allocate supplies to upazilas
3. Login as **Upazila Manager** → Allocate supplies to schools
4. Login as **School Principal** → View received supplies

---

## Key Features

✅ **Hierarchical Organization**: 4-level structure (Division → District → Upazila → School)  
✅ **Role-Based Access**: Each level has appropriate permissions  
✅ **Supply Control**: Only main division can supply to lower levels  
✅ **Demand Flow**: Demands flow upward through hierarchy  
✅ **Visual Organization**: Credentials grouped by level with icons  
✅ **Scrollable List**: All 9 credentials visible with overflow handling  
✅ **Bengali Support**: All branch names in Bengali  

---

## Sign-In Page Features

- **Hierarchical Display**: Credentials organized by administrative level
- **Visual Icons**: Different icons for each level (Shield, Building, MapPin, School)
- **Level Badges**: Color-coded badges showing branch/level
- **Scrollable Container**: All credentials accessible with smooth scrolling
- **Helpful Hint**: Reminder about hierarchical supply control
- **Responsive Design**: Works on desktop and mobile devices

---

## Notes

- All passwords are simple for testing purposes
- Each level has specific permissions based on role
- Only Division Admin can perform system-wide operations
- District and Upazila managers can only manage their respective levels
- School Principals can only request supplies from their upazila
- All credentials are dummy data for testing only
