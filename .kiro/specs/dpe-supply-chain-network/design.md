# Design Document: DPE Supply Chain Network

## Overview

The DPE Supply Chain Network is a hierarchical inventory and supply chain management system designed to serve Bangladesh's Primary Education Directorate. The system manages supplies across a 4-level administrative hierarchy (Division → District → Upazila → School) serving 66,000+ schools. The architecture emphasizes real-time visibility, offline capability for remote locations, role-based access control aligned with government position grades, and comprehensive audit trails for accountability.

### Key Design Principles

1. **Hierarchical Autonomy**: Each level operates independently while maintaining parent-child relationships
2. **Offline-First**: Remote schools can operate without connectivity; sync when available
3. **Audit-Centric**: Every action is logged with complete traceability
4. **Role-Aligned**: Access control maps to government position grades (G1-G16)
5. **Real-Time Visibility**: Centralized inventory tracking with sub-2-second query response
6. **Scalability**: Designed to handle 66,000+ schools with millions of transactions

## Architecture

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DPE Supply Chain Network                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Presentation Layer (Multi-Channel)         │   │
│  │  ┌─────────────┬──────────────┬──────────────────┐   │   │
│  │  │  Web UI     │  Mobile App  │  Offline Cache   │   │   │
│  │  │ (Responsive)│ (React Native)│ (IndexedDB/SQLite)│  │   │
│  │  └─────────────┴──────────────┴──────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         API Gateway & Authentication Layer           │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │  JWT Auth | Role-Based Access Control | Logging │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Business Logic Layer (Microservices)         │   │
│  │  ┌──────────────┬──────────────┬──────────────────┐  │   │
│  │  │  Inventory   │ Procurement  │  Demand & Stock  │  │   │
│  │  │  Service     │  Service     │  Movement Service│  │   │
│  │  └──────────────┴──────────────┴──────────────────┘  │   │
│  │  ┌──────────────┬──────────────┬──────────────────┐  │   │
│  │  │  Warehouse   │  Allocation  │  Reporting &     │  │   │
│  │  │  Service     │  Service     │  Analytics Service│ │   │
│  │  └──────────────┴──────────────┴──────────────────┘  │   │
│  │  ┌──────────────┬──────────────┬──────────────────┐  │   │
│  │  │  User & Role │  Notification│  Audit & Sync    │  │   │
│  │  │  Service     │  Service     │  Service         │  │   │
│  │  └──────────────┴──────────────┴──────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Data Access Layer (Repository Pattern)       │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │  Query Optimization | Caching | Transactions   │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Data Layer (PostgreSQL + Redis)             │   │
│  │  ┌──────────────┬──────────────┬──────────────────┐  │   │
│  │  │  Primary DB  │  Cache Layer │  Backup Storage  │  │   │
│  │  │ (PostgreSQL) │   (Redis)    │  (S3/Cloud)      │  │   │
│  │  └──────────────┴──────────────┴──────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Architecture

- **Central Server**: Hosted in cloud (AWS/Azure) with high availability
- **Regional Servers**: Optional regional caches for faster access
- **Mobile Clients**: React Native apps with offline-first SQLite database
- **Web Clients**: Responsive web interface with IndexedDB for offline caching
- **Sync Engine**: Bidirectional sync between clients and server



## Hierarchical Structure Implementation

### Network Hierarchy Model

The system implements a strict 4-level hierarchy with parent-child relationships:

```
Division (Level 1)
├── District (Level 2)
│   ├── Upazila (Level 3)
│   │   └── School (Level 4)
│   └── Upazila (Level 3)
│       └── School (Level 4)
└── District (Level 2)
    └── Upazila (Level 3)
        └── School (Level 4)
```

### Hierarchy Data Model

**Administrative_Unit Table**:
- `id` (UUID): Unique identifier
- `code` (String): Government administrative code
- `name` (String): Unit name (Bengali/English)
- `level` (Enum): DIVISION | DISTRICT | UPAZILA | SCHOOL
- `parent_id` (UUID): Reference to parent unit (null for divisions)
- `warehouse_id` (UUID): Associated warehouse (null for schools)
- `status` (Enum): ACTIVE | INACTIVE | ARCHIVED
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Warehouse Table**:
- `id` (UUID): Unique identifier
- `administrative_unit_id` (UUID): Associated unit
- `name` (String): Warehouse name
- `location` (String): Physical address
- `capacity` (Decimal): Storage capacity in units
- `current_utilization` (Decimal): Current usage
- `manager_id` (UUID): Warehouse manager user
- `status` (Enum): ACTIVE | INACTIVE
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Hierarchy Navigation Rules

1. **Upward Navigation**: Users can view parent and ancestor levels
2. **Downward Navigation**: Users can view child and descendant levels
3. **Sibling Visibility**: Users can view siblings at their own level
4. **Cross-Branch Restriction**: Users cannot view unrelated branches
5. **Warehouse Ownership**: Each warehouse serves its administrative unit and subordinates

### Inventory Aggregation

Inventory is aggregated hierarchically:
- **School Level**: Tracks actual physical stock
- **Upazila Level**: Aggregates school inventory + upazila warehouse stock
- **District Level**: Aggregates upazila inventory + district warehouse stock
- **Division Level**: Aggregates district inventory + divisional warehouse stock



## Data Models and Database Schema

### Core Entity Models

**Item Catalog**:
- `id` (UUID): Unique identifier
- `code` (String): Unique item code
- `name_bn` (String): Bengali name
- `name_en` (String): English name
- `description` (Text): Item description
- `category` (String): Item category (e.g., "Stationery", "Furniture")
- `unit_of_measure` (String): UOM (e.g., "Box", "Piece", "Ream")
- `specifications` (JSON): Technical specifications
- `status` (Enum): ACTIVE | DISCONTINUED
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Inventory**:
- `id` (UUID): Unique identifier
- `item_id` (UUID): Reference to Item
- `warehouse_id` (UUID): Reference to Warehouse
- `quantity` (Decimal): Current stock quantity
- `minimum_threshold` (Decimal): Low stock alert threshold
- `maximum_capacity` (Decimal): Maximum storage capacity
- `unit_price` (Decimal): Current unit price
- `last_updated` (Timestamp): Last inventory update
- `last_updated_by` (UUID): User who last updated
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Stock_Movement**:
- `id` (UUID): Unique identifier
- `item_id` (UUID): Reference to Item
- `movement_type` (Enum): IN | OUT | TRANSFER | ADJUSTMENT
- `source_warehouse_id` (UUID): Source warehouse (null for IN)
- `destination_warehouse_id` (UUID): Destination warehouse (null for OUT)
- `quantity` (Decimal): Quantity moved
- `reference_id` (UUID): Reference to procurement/demand/allocation
- `reference_type` (String): Type of reference (PROCUREMENT, DEMAND, ALLOCATION)
- `notes` (Text): Movement notes
- `recorded_by` (UUID): User who recorded movement
- `recorded_at` (Timestamp)
- `verified_by` (UUID): Verification officer (null if unverified)
- `verified_at` (Timestamp)
- `created_at` (Timestamp)

**Demand**:
- `id` (UUID): Unique identifier
- `requesting_unit_id` (UUID): School/Upazila requesting
- `requested_items` (JSON): Array of {item_id, quantity, justification}
- `priority` (Enum): LOW | MEDIUM | HIGH | URGENT
- `status` (Enum): DRAFT | SUBMITTED | APPROVED | REJECTED | FULFILLED | CANCELLED
- `total_estimated_cost` (Decimal): Calculated cost
- `submitted_by` (UUID): User who submitted
- `submitted_at` (Timestamp)
- `approved_by` (UUID): Approver (null if pending)
- `approved_at` (Timestamp)
- `rejection_reason` (Text): Reason if rejected
- `fulfillment_deadline` (Date): Expected fulfillment date
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Procurement**:
- `id` (UUID): Unique identifier
- `supplier_id` (UUID): Reference to Supplier
- `items` (JSON): Array of {item_id, quantity, unit_price}
- `total_cost` (Decimal): Total procurement cost
- `status` (Enum): DRAFT | SUBMITTED | APPROVED | ORDERED | RECEIVED | COMPLETED | CANCELLED
- `approval_chain` (JSON): Array of approval steps with status
- `created_by` (UUID): Procurement officer
- `created_at` (Timestamp)
- `order_date` (Date): Date order placed
- `expected_delivery_date` (Date): Expected delivery
- `actual_delivery_date` (Date): Actual delivery date
- `received_by` (UUID): Receiving officer
- `received_at` (Timestamp)
- `updated_at` (Timestamp)

**Allocation**:
- `id` (UUID): Unique identifier
- `source_warehouse_id` (UUID): Source warehouse
- `destination_unit_id` (UUID): Destination unit
- `items` (JSON): Array of {item_id, quantity, allocated_quantity}
- `status` (Enum): PENDING | APPROVED | IN_TRANSIT | DELIVERED | CANCELLED
- `created_by` (UUID): Allocation officer
- `created_at` (Timestamp)
- `approved_by` (UUID): Approver
- `approved_at` (Timestamp)
- `delivery_date` (Date): Expected delivery
- `received_by` (UUID): Receiving officer
- `received_at` (Timestamp)
- `updated_at` (Timestamp)

**Supplier**:
- `id` (UUID): Unique identifier
- `name` (String): Supplier name
- `contact_person` (String): Primary contact
- `email` (String): Email address
- `phone` (String): Phone number
- `address` (String): Physical address
- `bank_account` (String): Bank account for payments
- `performance_rating` (Decimal): 0-5 rating
- `total_orders` (Integer): Total orders placed
- `on_time_delivery_rate` (Decimal): Percentage
- `quality_score` (Decimal): 0-100 score
- `status` (Enum): ACTIVE | INACTIVE | BLACKLISTED
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**User**:
- `id` (UUID): Unique identifier
- `username` (String): Unique username
- `email` (String): Email address
- `password_hash` (String): Hashed password
- `full_name_bn` (String): Bengali name
- `full_name_en` (String): English name
- `government_position_grade` (Enum): G1-G16
- `assigned_role` (Enum): ADMIN | DIVISIONAL_DIRECTOR | DISTRICT_MANAGER | UPAZILA_MANAGER | STOCK_OFFICER | SCHOOL_PRINCIPAL | SUPPLIER | AUDITOR
- `assigned_unit_id` (UUID): Administrative unit assignment
- `language_preference` (Enum): BN | EN
- `status` (Enum): ACTIVE | INACTIVE | SUSPENDED
- `last_login` (Timestamp)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Audit_Log**:
- `id` (UUID): Unique identifier
- `user_id` (UUID): User performing action
- `action_type` (String): Type of action (CREATE, UPDATE, DELETE, APPROVE, REJECT, etc.)
- `entity_type` (String): Type of entity affected (DEMAND, PROCUREMENT, INVENTORY, etc.)
- `entity_id` (UUID): ID of affected entity
- `before_values` (JSON): Previous values
- `after_values` (JSON): New values
- `ip_address` (String): User's IP address
- `user_agent` (String): Browser/client info
- `status` (Enum): SUCCESS | FAILURE
- `error_message` (Text): Error details if failed
- `created_at` (Timestamp)

**Budget**:
- `id` (UUID): Unique identifier
- `administrative_unit_id` (UUID): Unit budget applies to
- `fiscal_year` (Integer): Fiscal year
- `allocated_amount` (Decimal): Total allocated budget
- `spent_amount` (Decimal): Amount spent
- `remaining_amount` (Decimal): Remaining budget
- `category_breakdown` (JSON): Budget by category
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Notification**:
- `id` (UUID): Unique identifier
- `user_id` (UUID): Recipient user
- `notification_type` (String): Type (LOW_STOCK, PENDING_APPROVAL, DELAYED_ORDER, etc.)
- `title` (String): Notification title
- `message` (Text): Notification message
- `related_entity_id` (UUID): Related entity
- `related_entity_type` (String): Type of related entity
- `delivery_methods` (Array): EMAIL | SMS | IN_APP
- `status` (Enum): PENDING | SENT | READ | FAILED
- `created_at` (Timestamp)
- `sent_at` (Timestamp)
- `read_at` (Timestamp)



## Role-Based Access Control System

### Role Hierarchy and Permissions

**Role Mapping to Government Positions**:

| Role | Position Grade | Authority Level | Permissions |
|------|-----------------|-----------------|-------------|
| Admin | G1-G2 | National | Full system access, user management, system configuration |
| Divisional Director | G3-G4 | Division | Manage division, approve high-value demands, view all subordinate data |
| District Manager | G5-G6 | District | Manage district, approve medium-value demands, view district/upazila/school data |
| Upazila Manager | G7-G8 | Upazila | Manage upazila, approve low-value demands, view upazila/school data |
| Stock Officer | G9-G11 | Warehouse | Manage inventory, record stock movements, process allocations |
| School Principal | G12-G14 | School | Submit demands, view school inventory, manage school supplies |
| Supplier | External | Supplier | Submit procurement orders, view order status, upload delivery documents |
| Auditor | G15-G16 | National | View all audit logs, generate compliance reports, no modification rights |

### Permission Matrix

**Demand Management**:
- Submit: School Principal, Upazila Manager, District Manager, Divisional Director
- Approve (≤10,000): Upazila Manager
- Approve (10,001-50,000): District Manager
- Approve (>50,000): Divisional Director
- View: All roles (restricted to hierarchy)

**Procurement Management**:
- Create: Stock Officer, District Manager, Divisional Director
- Approve (≤50,000): District Manager
- Approve (>50,000): Divisional Director
- View: All roles (restricted to hierarchy)

**Inventory Management**:
- View: All roles (restricted to hierarchy)
- Record Movement: Stock Officer
- Adjust: Stock Officer (with approval for >10% variance)
- Verify: Warehouse Manager

**Reporting**:
- View Reports: All roles (restricted to hierarchy)
- Export: All roles (restricted to hierarchy)
- Generate Audit Reports: Auditor only

**User Management**:
- Create Users: Admin, Divisional Director (for their division)
- Modify Users: Admin, Divisional Director (for their division)
- Deactivate Users: Admin, Divisional Director (for their division)
- View Users: Admin, Divisional Director (for their division)

### Access Control Implementation

**Hierarchy-Based Visibility**:
```
User at Level N can view:
- Their own level (N)
- All subordinate levels (N+1, N+2, N+3)
- Cannot view sibling branches
- Cannot view parent levels (except aggregated reports)
```

**Data Filtering Rules**:
- All queries automatically filtered by user's assigned unit and subordinates
- Audit logs filtered to show only user's actions and subordinates' actions
- Reports aggregated based on user's hierarchy level



## API Endpoints and Workflows

### Core API Endpoints

**Inventory Management**:
- `GET /api/inventory` - List inventory for user's hierarchy
- `GET /api/inventory/{id}` - Get inventory details
- `POST /api/inventory/movements` - Record stock movement
- `GET /api/inventory/movements` - List stock movements
- `GET /api/inventory/low-stock` - Get low stock alerts
- `POST /api/inventory/adjust` - Adjust inventory (with approval workflow)

**Demand Management**:
- `POST /api/demands` - Create demand
- `GET /api/demands` - List demands
- `GET /api/demands/{id}` - Get demand details
- `PUT /api/demands/{id}` - Update demand (draft only)
- `POST /api/demands/{id}/submit` - Submit demand
- `POST /api/demands/{id}/approve` - Approve demand
- `POST /api/demands/{id}/reject` - Reject demand
- `POST /api/demands/{id}/fulfill` - Fulfill demand

**Procurement Management**:
- `POST /api/procurements` - Create procurement
- `GET /api/procurements` - List procurements
- `GET /api/procurements/{id}` - Get procurement details
- `POST /api/procurements/{id}/submit` - Submit for approval
- `POST /api/procurements/{id}/approve` - Approve procurement
- `POST /api/procurements/{id}/reject` - Reject procurement
- `POST /api/procurements/{id}/receive` - Record goods receipt
- `POST /api/procurements/{id}/complete` - Complete procurement

**Allocation Management**:
- `POST /api/allocations` - Create allocation
- `GET /api/allocations` - List allocations
- `GET /api/allocations/{id}` - Get allocation details
- `POST /api/allocations/{id}/approve` - Approve allocation
- `POST /api/allocations/{id}/deliver` - Record delivery
- `POST /api/allocations/{id}/receive` - Record receipt

**Warehouse Management**:
- `GET /api/warehouses` - List warehouses
- `GET /api/warehouses/{id}` - Get warehouse details
- `GET /api/warehouses/{id}/inventory` - Get warehouse inventory
- `GET /api/warehouses/{id}/capacity` - Get capacity status

**Reporting & Analytics**:
- `GET /api/reports/inventory` - Inventory report
- `GET /api/reports/procurement` - Procurement report
- `GET /api/reports/demand` - Demand report
- `GET /api/reports/stock-movement` - Stock movement report
- `GET /api/reports/supplier-performance` - Supplier performance
- `GET /api/reports/budget-status` - Budget status
- `GET /api/reports/kpi` - Key performance indicators
- `POST /api/reports/export` - Export report (CSV/PDF)

**Audit & Compliance**:
- `GET /api/audit-logs` - List audit logs
- `GET /api/audit-logs/{id}` - Get audit log details
- `GET /api/audit-logs/search` - Search audit logs
- `POST /api/audit-logs/export` - Export audit logs

**User & Role Management**:
- `POST /api/users` - Create user
- `GET /api/users` - List users
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user
- `POST /api/users/{id}/deactivate` - Deactivate user
- `GET /api/roles` - List available roles
- `GET /api/permissions` - Get user permissions

**Supplier Management**:
- `POST /api/suppliers` - Create supplier
- `GET /api/suppliers` - List suppliers
- `GET /api/suppliers/{id}` - Get supplier details
- `PUT /api/suppliers/{id}` - Update supplier
- `GET /api/suppliers/{id}/performance` - Get performance metrics

**Item Catalog**:
- `GET /api/items` - List items
- `GET /api/items/{id}` - Get item details
- `POST /api/items` - Create item (admin only)
- `PUT /api/items/{id}` - Update item (admin only)
- `GET /api/items/search` - Search items

**Notifications**:
- `GET /api/notifications` - List user notifications
- `POST /api/notifications/{id}/read` - Mark as read
- `PUT /api/notifications/preferences` - Update notification preferences

**Sync & Offline**:
- `POST /api/sync/pull` - Pull changes for offline sync
- `POST /api/sync/push` - Push local changes to server
- `GET /api/sync/status` - Get sync status

### Key Workflows

**Demand Fulfillment Workflow**:
```
1. School Principal submits demand
   ↓
2. System calculates cost and checks budget
   ↓
3. If cost ≤ 10,000: Upazila Manager approves
   If cost 10,001-50,000: District Manager approves
   If cost > 50,000: Divisional Director approves
   ↓
4. If approved:
   - Check upazila warehouse inventory
   - If available: Allocate from upazila warehouse
   - If insufficient: Escalate to district warehouse
   - If still insufficient: Escalate to divisional warehouse
   ↓
5. Generate allocation record and update inventory
   ↓
6. Notify school of fulfillment
```

**Procurement Workflow**:
```
1. Stock Officer creates procurement request
   ↓
2. System calculates total cost
   ↓
3. If cost ≤ 50,000: District Manager approves
   If cost > 50,000: Divisional Director approves
   ↓
4. If approved: Create purchase order and send to supplier
   ↓
5. Supplier delivers goods
   ↓
6. Stock Officer receives goods and verifies against PO
   ↓
7. If verified: Update inventory and close procurement
   If discrepancies: Flag for investigation
```

**Stock Movement Recording**:
```
1. User initiates stock movement (IN/OUT/TRANSFER/ADJUSTMENT)
   ↓
2. System validates:
   - Source has sufficient quantity
   - User has permission
   - Budget available (if applicable)
   ↓
3. Record movement with all details
   ↓
4. Update inventory at source and destination
   ↓
5. Create audit log entry
   ↓
6. Trigger notifications if thresholds crossed
```



## Offline Capability and Sync Mechanism

### Offline-First Architecture

**Local Storage Strategy**:
- **Mobile**: SQLite database with full schema replica
- **Web**: IndexedDB with schema replica
- **Sync Queue**: Local queue of pending transactions

**Data Synchronization Model**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Offline Client                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Local Database (SQLite/IndexedDB)                   │   │
│  │  - Full schema replica                               │   │
│  │  - Cached data from last sync                        │   │
│  │  - Sync queue for pending transactions               │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Sync Engine                                         │   │
│  │  - Detects connectivity changes                      │   │
│  │  - Manages sync queue                                │   │
│  │  - Handles conflict resolution                       │   │
│  │  - Tracks sync status                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Offline UI                                          │   │
│  │  - Shows cached data                                 │   │
│  │  - Indicates data freshness                          │   │
│  │  - Queues transactions locally                       │   │
│  │  - Shows sync status                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↕ (When Connected)
┌─────────────────────────────────────────────────────────────┐
│                    Central Server                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Sync API Endpoints                                  │   │
│  │  - /api/sync/pull - Get server changes               │   │
│  │  - /api/sync/push - Send client changes              │   │
│  │  - /api/sync/status - Get sync status                │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Conflict Resolution Engine                          │   │
│  │  - Last-write-wins for most entities                 │   │
│  │  - Custom logic for inventory (sum quantities)       │   │
│  │  - Custom logic for status (state machine)           │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Primary Database (PostgreSQL)                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Sync Protocol

**Pull Sync (Client → Server)**:
1. Client sends last sync timestamp and device ID
2. Server returns all changes since last sync
3. Client applies changes to local database
4. Client updates last sync timestamp

**Push Sync (Client → Server)**:
1. Client sends queued transactions with timestamps
2. Server validates each transaction
3. Server applies transactions in order
4. Server returns confirmation with server timestamps
5. Client removes confirmed transactions from queue

**Conflict Resolution**:
- **Inventory Quantities**: Sum approach (both changes applied)
- **Status Changes**: Last-write-wins with timestamp comparison
- **Demand/Procurement**: Last-write-wins (prevents duplicate approvals)
- **Stock Movements**: Timestamp-based ordering

### Offline Capabilities

**Available Offline**:
- View cached inventory data
- View cached demands and procurements
- Create new demands (queued for sync)
- Record stock movements (queued for sync)
- View cached reports
- Search cached item catalog
- View user profile and permissions

**Not Available Offline**:
- Real-time inventory updates
- Approval workflows (queued for processing)
- Supplier management
- User management
- Real-time reporting

### Sync Status Indicators

**UI Indicators**:
- Green checkmark: Data is current (synced within 5 minutes)
- Yellow clock: Data is stale (synced >5 minutes ago)
- Red X: Offline mode, data may be outdated
- Sync progress bar: Shows sync in progress
- Pending badge: Shows number of pending transactions

**Automatic Sync Triggers**:
- App launch
- Connectivity restored
- Every 5 minutes when online
- Before critical operations (approval, allocation)
- After user-initiated sync request



## Error Handling and Validation

### Input Validation

**Demand Validation**:
- Item IDs must exist in catalog
- Quantities must be positive numbers
- Justification must be non-empty
- Priority must be valid enum value
- Requesting unit must be valid and user must have access

**Procurement Validation**:
- Supplier must be active
- Items must exist and be active
- Quantities must be positive
- Unit prices must be positive
- Total cost must not exceed budget

**Stock Movement Validation**:
- Source warehouse must have sufficient quantity
- Destination warehouse must exist
- Quantity must be positive
- User must have permission for movement type
- Reference entity must exist and be valid

**User Creation Validation**:
- Username must be unique
- Email must be valid and unique
- Password must meet complexity requirements
- Government position grade must be valid
- Assigned unit must exist and user must have access

### Error Handling Strategy

**HTTP Status Codes**:
- 200: Success
- 201: Created
- 204: No content
- 400: Bad request (validation error)
- 401: Unauthorized (authentication failed)
- 403: Forbidden (permission denied)
- 404: Not found
- 409: Conflict (e.g., duplicate entry)
- 422: Unprocessable entity (business logic error)
- 500: Internal server error
- 503: Service unavailable

**Error Response Format**:
```json
{
  "error": {
    "code": "INSUFFICIENT_INVENTORY",
    "message": "Insufficient inventory for item XYZ",
    "details": {
      "requested": 100,
      "available": 50,
      "item_id": "uuid"
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Business Logic Errors**:
- INSUFFICIENT_INVENTORY: Not enough stock
- INSUFFICIENT_BUDGET: Budget exceeded
- INVALID_APPROVAL_CHAIN: User cannot approve
- DUPLICATE_ENTRY: Item already exists
- INVALID_STATE_TRANSITION: Cannot perform action in current state
- HIERARCHY_VIOLATION: User cannot access this level
- CONFLICT_RESOLUTION_FAILED: Sync conflict unresolvable

### Retry Strategy

**Automatic Retries**:
- Network errors: Retry up to 3 times with exponential backoff
- Timeout errors: Retry up to 2 times
- Server errors (5xx): Retry up to 2 times
- Client errors (4xx): No retry

**Exponential Backoff**:
- First retry: 1 second
- Second retry: 2 seconds
- Third retry: 4 seconds

### Logging and Monitoring

**Log Levels**:
- ERROR: System errors, validation failures, permission denials
- WARN: Unusual conditions, retries, conflicts
- INFO: User actions, state changes, approvals
- DEBUG: Detailed operation info, query parameters

**Monitored Metrics**:
- API response times (target: <500ms for 95th percentile)
- Error rates by endpoint
- Sync success rates
- Offline mode usage
- Database query performance
- Cache hit rates

