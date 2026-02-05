# DPE Hierarchical Supply Chain Network Structure

## Overview
The system implements a 4-level hierarchical supply chain network with centralized supply from the main division warehouse flowing down through districts, upazilas, and schools. Only the main division warehouse can supply to lower levels.

## Hierarchical Levels

### Level 1: Division (Main Supply Hub)
- **Branch**: ঢাকা বিভাগ (Dhaka Division)
- **Warehouse**: প্রধান গুদাম - ঢাকা বিভাগ (Main Warehouse - Dhaka Division)
- **Warehouse ID**: 1
- **Can Supply**: ✅ YES (Main supplier to all lower levels)
- **User**: 
  - Email: `admin@dpe.gov.bd`
  - Password: `admin123`
  - Role: ROLE_ADMIN
  - Position: মহাপরিচালক (Director General)
  - Grade: G1

### Level 2: District (Regional Distribution)
- **Branch 1**: ঢাকা জেলা (Dhaka District)
  - Warehouse ID: 2
  - Can Supply: ✅ YES (to upazilas within district)
  - User:
    - Email: `district.dhaka@dpe.gov.bd`
    - Password: `district123`
    - Role: ROLE_DISTRICT_MANAGER
    - Position: জেলা পরিচালক (District Director)
    - Grade: G4

- **Branch 2**: নারায়ণগঞ্জ জেলা (Narayanganj District)
  - Warehouse ID: 3
  - Can Supply: ✅ YES (to upazilas within district)
  - User:
    - Email: `district.narayanganj@dpe.gov.bd`
    - Password: `district123`
    - Role: ROLE_DISTRICT_MANAGER
    - Position: জেলা পরিচালক (District Director)
    - Grade: G4

### Level 3: Upazila (Sub-District Distribution)
- **Branch 1**: ধানমন্ডি উপজেলা (Dhanmondi Upazila)
  - Warehouse ID: 4
  - Can Supply: ❌ NO (receives from district)
  - User:
    - Email: `upazila.dhanmondi@dpe.gov.bd`
    - Password: `upazila123`
    - Role: ROLE_UPAZILA_MANAGER
    - Position: উপজেলা পরিচালক (Upazila Director)
    - Grade: G7

- **Branch 2**: মোহাম্মদপুর উপজেলা (Mohammadpur Upazila)
  - Warehouse ID: 5
  - Can Supply: ❌ NO (receives from district)
  - User:
    - Email: `upazila.mohammadpur@dpe.gov.bd`
    - Password: `upazila123`
    - Role: ROLE_UPAZILA_MANAGER
    - Position: উপজেলা পরিচালক (Upazila Director)
    - Grade: G7

- **Branch 3**: সোনারগাঁ উপজেলা (Sonargaon Upazila)
  - Warehouse ID: 6
  - Can Supply: ❌ NO (receives from district)
  - User:
    - Email: `upazila.sonargaon@dpe.gov.bd`
    - Password: `upazila123`
    - Role: ROLE_UPAZILA_MANAGER
    - Position: উপজেলা পরিচালক (Upazila Director)
    - Grade: G7

### Level 4: School (End-User)
- **Branch 1**: ধানমন্ডি প্রাথমিক বিদ্যালয় (Dhanmondi Primary School)
  - Warehouse ID: 7
  - Can Supply: ❌ NO (receives from upazila)
  - User:
    - Email: `school.dhanmondi@dpe.gov.bd`
    - Password: `school123`
    - Role: ROLE_SCHOOL_PRINCIPAL
    - Position: প্রধানশিক্ষক (School Principal)
    - Grade: G8

- **Branch 2**: মোহাম্মদপুর প্রাথমিক বিদ্যালয় (Mohammadpur Primary School)
  - Warehouse ID: 8
  - Can Supply: ❌ NO (receives from upazila)
  - User:
    - Email: `school.mohammadpur@dpe.gov.bd`
    - Password: `school123`
    - Role: ROLE_SCHOOL_PRINCIPAL
    - Position: প্রধানশিক্ষক (School Principal)
    - Grade: G8

- **Branch 3**: সোনারগাঁ প্রাথমিক বিদ্যালয় (Sonargaon Primary School)
  - Warehouse ID: 9
  - Can Supply: ❌ NO (receives from upazila)
  - User:
    - Email: `school.sonargaon@dpe.gov.bd`
    - Password: `school123`
    - Role: ROLE_SCHOOL_PRINCIPAL
    - Position: প্রধানশিক্ষক (School Principal)
    - Grade: G8

## Supply Chain Flow

```
Division (Main Warehouse - WH-001)
    ↓ Supplies to
    ├─ District 1 (WH-002)
    │   ↓ Supplies to
    │   ├─ Upazila 1 (WH-004)
    │   │   ↓ Supplies to
    │   │   └─ School 1 (WH-007)
    │   └─ Upazila 2 (WH-005)
    │       ↓ Supplies to
    │       └─ School 2 (WH-008)
    └─ District 2 (WH-003)
        ↓ Supplies to
        └─ Upazila 3 (WH-006)
            ↓ Supplies to
            └─ School 3 (WH-009)
```

## Demand Flow (Hierarchical)

Demands flow upward through the hierarchy:

1. **School Level Demands** → Upazila Warehouse
   - Schools request items from their upazila warehouse
   - Example: School 1 demands A4 Paper from Upazila 1

2. **Upazila Level Demands** → District Warehouse
   - Upazilas request items from their district warehouse
   - Example: Upazila 1 demands Printers from District 1

3. **District Level Demands** → Division Warehouse
   - Districts request items from the main division warehouse
   - Example: District 1 demands bulk supplies from Division

## Dummy Credentials Summary

| Level | Branch | Email | Password | Role |
|-------|--------|-------|----------|------|
| Division | ঢাকা বিভাগ | admin@dpe.gov.bd | admin123 | ROLE_ADMIN |
| District | ঢাকা জেলা | district.dhaka@dpe.gov.bd | district123 | ROLE_DISTRICT_MANAGER |
| District | নারায়ণগঞ্জ জেলা | district.narayanganj@dpe.gov.bd | district123 | ROLE_DISTRICT_MANAGER |
| Upazila | ধানমন্ডি উপজেলা | upazila.dhanmondi@dpe.gov.bd | upazila123 | ROLE_UPAZILA_MANAGER |
| Upazila | মোহাম্মদপুর উপজেলা | upazila.mohammadpur@dpe.gov.bd | upazila123 | ROLE_UPAZILA_MANAGER |
| Upazila | সোনারগাঁ উপজেলা | upazila.sonargaon@dpe.gov.bd | upazila123 | ROLE_UPAZILA_MANAGER |
| School | ধানমন্ডি প্রাথমিক বিদ্যালয় | school.dhanmondi@dpe.gov.bd | school123 | ROLE_SCHOOL_PRINCIPAL |
| School | মোহাম্মদপুর প্রাথমিক বিদ্যালয় | school.mohammadpur@dpe.gov.bd | school123 | ROLE_SCHOOL_PRINCIPAL |
| School | সোনারগাঁ প্রাথমিক বিদ্যালয় | school.sonargaon@dpe.gov.bd | school123 | ROLE_SCHOOL_PRINCIPAL |

## Key Features

✅ **Hierarchical Supply Control**: Only main division warehouse can supply to lower levels
✅ **Demand-Based Allocation**: Demands flow upward through hierarchy
✅ **Role-Based Access**: Each level has appropriate permissions
✅ **Government Grade Integration**: Positions mapped to G1-G16 grades
✅ **Complete Audit Trail**: All supply movements tracked
✅ **Multi-Level Warehouses**: Separate storage at each administrative level

## Testing the Structure

1. Login as Division Admin to manage all supplies
2. Login as District Manager to manage district-level distribution
3. Login as Upazila Manager to manage upazila-level distribution
4. Login as School Principal to request supplies from upazila
5. View demand flow through the hierarchy
