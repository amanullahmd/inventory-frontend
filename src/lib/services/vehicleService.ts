import {
  VehicleRequisition,
  VehicleInfo,
  VehicleCostSummary,
  VehicleMonthlyCost,
  VehicleCategoryCost,
  VehicleRequisitionType,
} from '@/lib/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Demo data — comprehensive across vehicles, types, and months
const DEMO_REQUISITIONS: VehicleRequisition[] = [
  // Toyota Hiace — Microbus
  { id: 'VR-001', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-01-10T10:00:00Z', type: 'Diesel', details: '50 Liters for Toyota Hiace', amount: 5500, status: 'Completed' },
  { id: 'VR-002', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-01-25T14:30:00Z', type: 'Service', details: 'Regular service', amount: 8000, status: 'Completed' },
  { id: 'VR-003', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-02-05T09:15:00Z', type: 'Diesel', details: '60 Liters', amount: 6600, status: 'Completed' },
  { id: 'VR-004', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-02-18T10:00:00Z', type: 'Engine Oil', details: 'Engine oil change', amount: 3200, status: 'Completed' },
  { id: 'VR-005', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-03-01T10:00:00Z', type: 'Diesel', details: '50 Liters', amount: 5500, status: 'Completed' },
  { id: 'VR-006', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-03-15T11:00:00Z', type: 'Other', details: 'Car wash and cleaning', amount: 800, status: 'Completed' },
  { id: 'VR-007', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-04-02T08:00:00Z', type: 'Diesel', details: '55 Liters', amount: 6050, status: 'Completed' },
  { id: 'VR-008', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-04-20T14:00:00Z', type: 'Service', details: 'Brake check', amount: 4500, status: 'Completed' },
  { id: 'VR-009', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-05-10T09:00:00Z', type: 'Diesel', details: '65 Liters', amount: 7150, status: 'Completed' },
  { id: 'VR-010', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-05-28T10:30:00Z', type: 'Engine Oil', details: 'Full oil change', amount: 3800, status: 'Completed' },
  { id: 'VR-011', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-06-15T11:00:00Z', type: 'Diesel', details: '50 Liters', amount: 5500, status: 'Completed' },
  { id: 'VR-012', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-07-01T08:30:00Z', type: 'Service', details: 'AC service', amount: 6000, status: 'Completed' },
  { id: 'VR-013', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-07-20T10:00:00Z', type: 'Diesel', details: '70 Liters', amount: 7700, status: 'Completed' },
  { id: 'VR-014', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2024-08-05T09:00:00Z', type: 'Other', details: 'Tire replacement', amount: 12000, status: 'Completed' },

  // Mitsubishi Pajero — SUV
  { id: 'VR-015', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-01-08T08:00:00Z', type: 'Diesel', details: '40 Liters diesel', amount: 4400, status: 'Completed' },
  { id: 'VR-016', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-01-22T14:00:00Z', type: 'Service', details: 'Monthly service', amount: 10000, status: 'Completed' },
  { id: 'VR-017', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-02-10T09:00:00Z', type: 'Diesel', details: '45 Liters', amount: 4950, status: 'Completed' },
  { id: 'VR-018', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-02-25T11:00:00Z', type: 'Engine Oil', details: 'Engine oil + filter', amount: 5200, status: 'Completed' },
  { id: 'VR-019', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-03-03T14:30:00Z', type: 'Service', details: 'Brake pad replacement', amount: 12000, status: 'Completed' },
  { id: 'VR-020', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-03-18T10:00:00Z', type: 'Diesel', details: '50 Liters', amount: 5500, status: 'Completed' },
  { id: 'VR-021', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-04-08T09:00:00Z', type: 'Diesel', details: '40 Liters', amount: 4400, status: 'Completed' },
  { id: 'VR-022', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-04-25T14:00:00Z', type: 'Other', details: 'Battery replacement', amount: 8500, status: 'Completed' },
  { id: 'VR-023', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-05-12T10:00:00Z', type: 'Diesel', details: '55 Liters', amount: 6050, status: 'Completed' },
  { id: 'VR-024', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-06-01T08:00:00Z', type: 'Service', details: 'Full service', amount: 15000, status: 'Completed' },
  { id: 'VR-025', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-06-20T11:00:00Z', type: 'Engine Oil', details: 'Oil change', amount: 4800, status: 'Completed' },
  { id: 'VR-026', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-07-10T09:30:00Z', type: 'Diesel', details: '45 Liters', amount: 4950, status: 'Completed' },
  { id: 'VR-027', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2024-08-02T10:00:00Z', type: 'Diesel', details: '50 Liters', amount: 5500, status: 'Pending' },

  // Nissan Patrol — SUV
  { id: 'VR-028', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-01-20T10:00:00Z', type: 'Diesel', details: '55 Liters diesel', amount: 6050, status: 'Completed' },
  { id: 'VR-029', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-02-05T09:00:00Z', type: 'Engine Oil', details: 'Engine oil + filter', amount: 5200, status: 'Completed' },
  { id: 'VR-030', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-02-18T11:00:00Z', type: 'Service', details: 'Regular maintenance', amount: 9000, status: 'Completed' },
  { id: 'VR-031', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-03-05T09:15:00Z', type: 'Engine Oil', details: 'Scheduled maintenance', amount: 4500, status: 'Pending' },
  { id: 'VR-032', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-03-22T10:00:00Z', type: 'Diesel', details: '60 Liters', amount: 6600, status: 'Completed' },
  { id: 'VR-033', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-04-10T08:00:00Z', type: 'Diesel', details: '50 Liters', amount: 5500, status: 'Completed' },
  { id: 'VR-034', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-05-01T14:00:00Z', type: 'Service', details: 'Full service', amount: 14000, status: 'Completed' },
  { id: 'VR-035', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-05-20T09:00:00Z', type: 'Diesel', details: '65 Liters', amount: 7150, status: 'Completed' },
  { id: 'VR-036', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-06-08T10:00:00Z', type: 'Engine Oil', details: 'Oil change', amount: 4800, status: 'Completed' },
  { id: 'VR-037', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-06-25T11:00:00Z', type: 'Other', details: 'Body repair', amount: 18000, status: 'Completed' },
  { id: 'VR-038', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-07-15T09:00:00Z', type: 'Diesel', details: '55 Liters', amount: 6050, status: 'Completed' },
  { id: 'VR-039', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2024-08-01T10:00:00Z', type: 'Diesel', details: '60 Liters', amount: 6600, status: 'Approved' },

  // Honda Civic — Sedan
  { id: 'VR-040', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-01-25T11:00:00Z', type: 'Diesel', details: '30 Liters', amount: 3300, status: 'Completed' },
  { id: 'VR-041', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-02-10T10:00:00Z', type: 'Service', details: 'Regular service', amount: 5000, status: 'Completed' },
  { id: 'VR-042', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-02-22T09:00:00Z', type: 'Engine Oil', details: 'Oil change', amount: 2800, status: 'Completed' },
  { id: 'VR-043', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-03-06T11:45:00Z', type: 'Other', details: 'Car wash and cleaning', amount: 800, status: 'Completed' },
  { id: 'VR-044', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-03-20T10:00:00Z', type: 'Diesel', details: '35 Liters', amount: 3850, status: 'Completed' },
  { id: 'VR-045', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-04-12T09:00:00Z', type: 'Diesel', details: '30 Liters', amount: 3300, status: 'Completed' },
  { id: 'VR-046', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-05-05T11:00:00Z', type: 'Service', details: 'AC service', amount: 4000, status: 'Completed' },
  { id: 'VR-047', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-05-25T10:00:00Z', type: 'Diesel', details: '40 Liters', amount: 4400, status: 'Completed' },
  { id: 'VR-048', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-06-10T08:30:00Z', type: 'Engine Oil', details: 'Full oil change', amount: 3200, status: 'Completed' },
  { id: 'VR-049', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-07-01T09:00:00Z', type: 'Diesel', details: '35 Liters', amount: 3850, status: 'Completed' },
  { id: 'VR-050', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2024-07-20T14:00:00Z', type: 'Other', details: 'Parking sensor repair', amount: 3500, status: 'Completed' },

  // Toyota Corolla — Sedan (additional vehicle)
  { id: 'VR-051', carNo: 'DHA-15-1111', carModel: 'Toyota Corolla', vehicleType: 'Sedan', date: '2024-01-15T09:00:00Z', type: 'Diesel', details: '35 Liters', amount: 3850, status: 'Completed' },
  { id: 'VR-052', carNo: 'DHA-15-1111', carModel: 'Toyota Corolla', vehicleType: 'Sedan', date: '2024-02-08T10:00:00Z', type: 'Service', details: 'Regular maintenance', amount: 6000, status: 'Completed' },
  { id: 'VR-053', carNo: 'DHA-15-1111', carModel: 'Toyota Corolla', vehicleType: 'Sedan', date: '2024-03-12T11:00:00Z', type: 'Diesel', details: '40 Liters', amount: 4400, status: 'Completed' },
  { id: 'VR-054', carNo: 'DHA-15-1111', carModel: 'Toyota Corolla', vehicleType: 'Sedan', date: '2024-04-05T09:00:00Z', type: 'Engine Oil', details: 'Oil change', amount: 2500, status: 'Completed' },
  { id: 'VR-055', carNo: 'DHA-15-1111', carModel: 'Toyota Corolla', vehicleType: 'Sedan', date: '2024-05-15T10:00:00Z', type: 'Diesel', details: '35 Liters', amount: 3850, status: 'Completed' },
  { id: 'VR-056', carNo: 'DHA-15-1111', carModel: 'Toyota Corolla', vehicleType: 'Sedan', date: '2024-06-02T08:00:00Z', type: 'Other', details: 'Windshield replacement', amount: 7000, status: 'Completed' },
  { id: 'VR-057', carNo: 'DHA-15-1111', carModel: 'Toyota Corolla', vehicleType: 'Sedan', date: '2024-07-08T09:30:00Z', type: 'Service', details: 'Mid-year service', amount: 8000, status: 'Completed' },
  { id: 'VR-058', carNo: 'DHA-15-1111', carModel: 'Toyota Corolla', vehicleType: 'Sedan', date: '2024-08-01T10:00:00Z', type: 'Diesel', details: '40 Liters', amount: 4400, status: 'Pending' },

  // Ford Ranger — Pickup
  { id: 'VR-059', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2024-01-05T08:00:00Z', type: 'Diesel', details: '60 Liters', amount: 6600, status: 'Completed' },
  { id: 'VR-060', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2024-01-28T10:00:00Z', type: 'Service', details: 'Initial checkup', amount: 7500, status: 'Completed' },
  { id: 'VR-061', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2024-02-15T09:00:00Z', type: 'Diesel', details: '55 Liters', amount: 6050, status: 'Completed' },
  { id: 'VR-062', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2024-03-10T11:00:00Z', type: 'Engine Oil', details: 'Synthetic oil change', amount: 4200, status: 'Completed' },
  { id: 'VR-063', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2024-04-18T08:30:00Z', type: 'Diesel', details: '65 Liters', amount: 7150, status: 'Completed' },
  { id: 'VR-064', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2024-05-02T14:00:00Z', type: 'Other', details: 'Bed liner installation', amount: 15000, status: 'Completed' },
  { id: 'VR-065', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2024-05-25T09:00:00Z', type: 'Diesel', details: '60 Liters', amount: 6600, status: 'Completed' },
  { id: 'VR-066', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2024-06-15T10:00:00Z', type: 'Service', details: 'Full service', amount: 12000, status: 'Completed' },
  { id: 'VR-067', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2024-07-08T08:00:00Z', type: 'Diesel', details: '70 Liters', amount: 7700, status: 'Completed' },
  { id: 'VR-068', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2024-08-12T09:00:00Z', type: 'Engine Oil', details: 'Oil + filter', amount: 4500, status: 'Completed' },

  // Isuzu D-Max — Pickup
  { id: 'VR-069', carNo: 'DHA-17-3333', carModel: 'Isuzu D-Max', vehicleType: 'Pickup', date: '2024-01-12T10:00:00Z', type: 'Diesel', details: '50 Liters', amount: 5500, status: 'Completed' },
  { id: 'VR-070', carNo: 'DHA-17-3333', carModel: 'Isuzu D-Max', vehicleType: 'Pickup', date: '2024-02-03T09:00:00Z', type: 'Service', details: 'Regular service', amount: 6500, status: 'Completed' },
  { id: 'VR-071', carNo: 'DHA-17-3333', carModel: 'Isuzu D-Max', vehicleType: 'Pickup', date: '2024-02-28T11:00:00Z', type: 'Diesel', details: '55 Liters', amount: 6050, status: 'Completed' },
  { id: 'VR-072', carNo: 'DHA-17-3333', carModel: 'Isuzu D-Max', vehicleType: 'Pickup', date: '2024-03-20T10:00:00Z', type: 'Other', details: 'Suspension repair', amount: 9500, status: 'Completed' },
  { id: 'VR-073', carNo: 'DHA-17-3333', carModel: 'Isuzu D-Max', vehicleType: 'Pickup', date: '2024-04-15T08:00:00Z', type: 'Diesel', details: '60 Liters', amount: 6600, status: 'Completed' },
  { id: 'VR-074', carNo: 'DHA-17-3333', carModel: 'Isuzu D-Max', vehicleType: 'Pickup', date: '2024-05-10T14:00:00Z', type: 'Engine Oil', details: 'Full oil change', amount: 3800, status: 'Completed' },
  { id: 'VR-075', carNo: 'DHA-17-3333', carModel: 'Isuzu D-Max', vehicleType: 'Pickup', date: '2024-06-22T09:00:00Z', type: 'Diesel', details: '50 Liters', amount: 5500, status: 'Completed' },
  { id: 'VR-076', carNo: 'DHA-17-3333', carModel: 'Isuzu D-Max', vehicleType: 'Pickup', date: '2024-07-18T10:00:00Z', type: 'Service', details: 'Mid-year service', amount: 8000, status: 'Completed' },

  // Suzuki Swift — Hatchback
  { id: 'VR-077', carNo: 'DHA-18-4444', carModel: 'Suzuki Swift', vehicleType: 'Hatchback', date: '2024-01-20T09:00:00Z', type: 'Diesel', details: '25 Liters', amount: 2750, status: 'Completed' },
  { id: 'VR-078', carNo: 'DHA-18-4444', carModel: 'Suzuki Swift', vehicleType: 'Hatchback', date: '2024-02-14T10:00:00Z', type: 'Service', details: 'Regular service', amount: 4000, status: 'Completed' },
  { id: 'VR-079', carNo: 'DHA-18-4444', carModel: 'Suzuki Swift', vehicleType: 'Hatchback', date: '2024-03-08T08:30:00Z', type: 'Diesel', details: '30 Liters', amount: 3300, status: 'Completed' },
  { id: 'VR-080', carNo: 'DHA-18-4444', carModel: 'Suzuki Swift', vehicleType: 'Hatchback', date: '2024-04-22T11:00:00Z', type: 'Engine Oil', details: 'Oil change', amount: 2200, status: 'Completed' },
  { id: 'VR-081', carNo: 'DHA-18-4444', carModel: 'Suzuki Swift', vehicleType: 'Hatchback', date: '2024-05-18T09:00:00Z', type: 'Diesel', details: '25 Liters', amount: 2750, status: 'Completed' },
  { id: 'VR-082', carNo: 'DHA-18-4444', carModel: 'Suzuki Swift', vehicleType: 'Hatchback', date: '2024-06-10T10:00:00Z', type: 'Other', details: 'Car wash + detailing', amount: 1500, status: 'Completed' },
  { id: 'VR-083', carNo: 'DHA-18-4444', carModel: 'Suzuki Swift', vehicleType: 'Hatchback', date: '2024-07-05T08:00:00Z', type: 'Diesel', details: '28 Liters', amount: 3080, status: 'Completed' },

  // ===== 2025 DATA =====

  // Toyota Hiace — 2025
  { id: 'VR-084', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2025-01-08T10:00:00Z', type: 'Diesel', details: '55 Liters', amount: 6050, status: 'Completed' },
  { id: 'VR-085', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2025-01-22T14:00:00Z', type: 'Service', details: 'Annual service', amount: 12000, status: 'Completed' },
  { id: 'VR-086', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2025-02-10T09:00:00Z', type: 'Diesel', details: '60 Liters', amount: 6900, status: 'Completed' },
  { id: 'VR-087', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2025-02-25T11:00:00Z', type: 'Engine Oil', details: 'Engine oil change', amount: 3500, status: 'Completed' },
  { id: 'VR-088', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2025-03-15T10:00:00Z', type: 'Diesel', details: '50 Liters', amount: 5750, status: 'Completed' },
  { id: 'VR-089', carNo: 'DHA-11-2034', carModel: 'Toyota Hiace', vehicleType: 'Microbus', date: '2025-03-28T08:00:00Z', type: 'Other', details: 'Tire rotation', amount: 2000, status: 'Completed' },

  // Mitsubishi Pajero — 2025
  { id: 'VR-090', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2025-01-10T09:00:00Z', type: 'Diesel', details: '45 Liters', amount: 5175, status: 'Completed' },
  { id: 'VR-091', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2025-01-30T14:00:00Z', type: 'Service', details: 'Full service', amount: 16000, status: 'Completed' },
  { id: 'VR-092', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2025-02-18T10:00:00Z', type: 'Diesel', details: '50 Liters', amount: 5750, status: 'Completed' },
  { id: 'VR-093', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2025-03-05T11:00:00Z', type: 'Engine Oil', details: 'Synthetic oil', amount: 5800, status: 'Completed' },
  { id: 'VR-094', carNo: 'DHA-12-3456', carModel: 'Mitsubishi Pajero', vehicleType: 'SUV', date: '2025-03-22T09:00:00Z', type: 'Diesel', details: '55 Liters', amount: 6325, status: 'Pending' },

  // Nissan Patrol — 2025
  { id: 'VR-095', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2025-01-15T10:00:00Z', type: 'Diesel', details: '60 Liters', amount: 6900, status: 'Completed' },
  { id: 'VR-096', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2025-02-02T09:00:00Z', type: 'Service', details: 'Full service', amount: 15000, status: 'Completed' },
  { id: 'VR-097', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2025-02-20T11:00:00Z', type: 'Diesel', details: '55 Liters', amount: 6325, status: 'Completed' },
  { id: 'VR-098', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2025-03-10T08:00:00Z', type: 'Other', details: 'Headlight replacement', amount: 8500, status: 'Completed' },
  { id: 'VR-099', carNo: 'DHA-13-5678', carModel: 'Nissan Patrol', vehicleType: 'SUV', date: '2025-03-25T10:00:00Z', type: 'Diesel', details: '65 Liters', amount: 7475, status: 'Approved' },

  // Honda Civic — 2025
  { id: 'VR-100', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2025-01-08T11:00:00Z', type: 'Diesel', details: '30 Liters', amount: 3450, status: 'Completed' },
  { id: 'VR-101', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2025-02-12T10:00:00Z', type: 'Service', details: 'Annual service', amount: 5500, status: 'Completed' },
  { id: 'VR-102', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2025-03-01T09:00:00Z', type: 'Diesel', details: '35 Liters', amount: 4025, status: 'Completed' },
  { id: 'VR-103', carNo: 'DHA-14-9012', carModel: 'Honda Civic', vehicleType: 'Sedan', date: '2025-03-20T14:00:00Z', type: 'Engine Oil', details: 'Oil change', amount: 3000, status: 'Pending' },

  // Toyota Corolla — 2025
  { id: 'VR-104', carNo: 'DHA-15-1111', carModel: 'Toyota Corolla', vehicleType: 'Sedan', date: '2025-01-12T09:00:00Z', type: 'Diesel', details: '35 Liters', amount: 4025, status: 'Completed' },
  { id: 'VR-105', carNo: 'DHA-15-1111', carModel: 'Toyota Corolla', vehicleType: 'Sedan', date: '2025-02-05T10:00:00Z', type: 'Service', details: 'Regular maintenance', amount: 6500, status: 'Completed' },
  { id: 'VR-106', carNo: 'DHA-15-1111', carModel: 'Toyota Corolla', vehicleType: 'Sedan', date: '2025-03-08T11:00:00Z', type: 'Diesel', details: '40 Liters', amount: 4600, status: 'Completed' },
  { id: 'VR-107', carNo: 'DHA-15-1111', carModel: 'Toyota Corolla', vehicleType: 'Sedan', date: '2025-03-28T09:00:00Z', type: 'Other', details: 'Wiper replacement', amount: 1200, status: 'Completed' },

  // Ford Ranger — 2025
  { id: 'VR-108', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2025-01-06T08:00:00Z', type: 'Diesel', details: '65 Liters', amount: 7475, status: 'Completed' },
  { id: 'VR-109', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2025-01-25T10:00:00Z', type: 'Service', details: 'Full service', amount: 13000, status: 'Completed' },
  { id: 'VR-110', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2025-02-15T09:00:00Z', type: 'Diesel', details: '60 Liters', amount: 6900, status: 'Completed' },
  { id: 'VR-111', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2025-03-10T11:00:00Z', type: 'Engine Oil', details: 'Full synthetic', amount: 4800, status: 'Completed' },
  { id: 'VR-112', carNo: 'DHA-16-2222', carModel: 'Ford Ranger', vehicleType: 'Pickup', date: '2025-03-30T08:00:00Z', type: 'Diesel', details: '70 Liters', amount: 8050, status: 'Pending' },

  // Isuzu D-Max — 2025
  { id: 'VR-113', carNo: 'DHA-17-3333', carModel: 'Isuzu D-Max', vehicleType: 'Pickup', date: '2025-01-18T10:00:00Z', type: 'Diesel', details: '55 Liters', amount: 6325, status: 'Completed' },
  { id: 'VR-114', carNo: 'DHA-17-3333', carModel: 'Isuzu D-Max', vehicleType: 'Pickup', date: '2025-02-08T09:00:00Z', type: 'Service', details: 'Annual service', amount: 9000, status: 'Completed' },
  { id: 'VR-115', carNo: 'DHA-17-3333', carModel: 'Isuzu D-Max', vehicleType: 'Pickup', date: '2025-03-05T11:00:00Z', type: 'Diesel', details: '50 Liters', amount: 5750, status: 'Completed' },
  { id: 'VR-116', carNo: 'DHA-17-3333', carModel: 'Isuzu D-Max', vehicleType: 'Pickup', date: '2025-03-22T08:00:00Z', type: 'Other', details: 'Bumper repair', amount: 6000, status: 'Approved' },

  // Suzuki Swift — 2025
  { id: 'VR-117', carNo: 'DHA-18-4444', carModel: 'Suzuki Swift', vehicleType: 'Hatchback', date: '2025-01-10T09:00:00Z', type: 'Diesel', details: '25 Liters', amount: 2875, status: 'Completed' },
  { id: 'VR-118', carNo: 'DHA-18-4444', carModel: 'Suzuki Swift', vehicleType: 'Hatchback', date: '2025-02-20T10:00:00Z', type: 'Service', details: 'Regular service', amount: 4500, status: 'Completed' },
  { id: 'VR-119', carNo: 'DHA-18-4444', carModel: 'Suzuki Swift', vehicleType: 'Hatchback', date: '2025-03-15T08:30:00Z', type: 'Diesel', details: '28 Liters', amount: 3220, status: 'Completed' },
  { id: 'VR-120', carNo: 'DHA-18-4444', carModel: 'Suzuki Swift', vehicleType: 'Hatchback', date: '2025-03-30T11:00:00Z', type: 'Engine Oil', details: 'Oil change', amount: 2400, status: 'Pending' },
];

export class VehicleService {
  /**
   * Get all vehicle requisitions (demo data)
   */
  static getRequisitions(): VehicleRequisition[] {
    return [...DEMO_REQUISITIONS];
  }

  /**
   * Get requisitions filtered by car model
   */
  static getRequisitionsByModel(carModel: string): VehicleRequisition[] {
    return DEMO_REQUISITIONS.filter(r => r.carModel === carModel);
  }

  /**
   * Get requisitions filtered by year
   */
  static getRequisitionsByYear(year: number): VehicleRequisition[] {
    return DEMO_REQUISITIONS.filter(r => {
      const d = new Date(r.date);
      return d.getFullYear() === year;
    });
  }

  /**
   * Get unique vehicle info
   */
  static getVehicleInfoList(): VehicleInfo[] {
    const map = new Map<string, VehicleInfo>();
    DEMO_REQUISITIONS.forEach(r => {
      if (!map.has(r.carModel)) {
        map.set(r.carModel, {
          carModel: r.carModel,
          carNo: r.carNo,
          vehicleType: r.vehicleType,
        });
      }
    });
    return Array.from(map.values());
  }

  /**
   * Get unique car models
   */
  static getCarModels(): string[] {
    return Array.from(new Set(DEMO_REQUISITIONS.map(r => r.carModel)));
  }

  /**
   * Get cost summary per vehicle (aggregated across all months/year)
   */
  static getCostSummaries(year?: number): VehicleCostSummary[] {
    const requisitions = year
      ? DEMO_REQUISITIONS.filter(r => new Date(r.date).getFullYear() === year)
      : DEMO_REQUISITIONS;

    const map = new Map<string, VehicleCostSummary>();

    requisitions.forEach(r => {
      if (!map.has(r.carModel)) {
        map.set(r.carModel, {
          carModel: r.carModel,
          carNo: r.carNo,
          vehicleType: r.vehicleType,
          dieselCost: 0,
          serviceCost: 0,
          engineOilCost: 0,
          otherCost: 0,
          totalCost: 0,
          recordCount: 0,
        });
      }
      const summary = map.get(r.carModel)!;
      summary.recordCount++;
      summary.totalCost += r.amount;

      switch (r.type) {
        case 'Diesel':
          summary.dieselCost += r.amount;
          break;
        case 'Service':
          summary.serviceCost += r.amount;
          break;
        case 'Engine Oil':
        case 'Oil':
          summary.engineOilCost += r.amount;
          break;
        case 'Other':
          summary.otherCost += r.amount;
          break;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalCost - a.totalCost);
  }

  /**
   * Get monthly cost breakdown for a specific vehicle
   */
  static getMonthlyCosts(carModel: string, year: number): VehicleMonthlyCost[] {
    const requisitions = DEMO_REQUISITIONS.filter(
      r => r.carModel === carModel && new Date(r.date).getFullYear() === year
    );

    return MONTHS.map((month, idx) => {
      const monthRecords = requisitions.filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === idx;
      });

      let dieselCost = 0, serviceCost = 0, engineOilCost = 0, otherCost = 0;

      monthRecords.forEach(r => {
        switch (r.type) {
          case 'Diesel': dieselCost += r.amount; break;
          case 'Service': serviceCost += r.amount; break;
          case 'Engine Oil':
          case 'Oil': engineOilCost += r.amount; break;
          case 'Other': otherCost += r.amount; break;
        }
      });

      return {
        month,
        monthIndex: idx,
        year,
        dieselCost,
        serviceCost,
        engineOilCost,
        otherCost,
        totalCost: dieselCost + serviceCost + engineOilCost + otherCost,
        recordCount: monthRecords.length,
      };
    });
  }

  /**
   * Get category-wise costs for all vehicles (for dashboard charts)
   */
  static getCategoryCostsByVehicle(year?: number): {
    vehicle: string;
    diesel: number;
    service: number;
    engineOil: number;
    other: number;
    total: number;
  }[] {
    const requisitions = year
      ? DEMO_REQUISITIONS.filter(r => new Date(r.date).getFullYear() === year)
      : DEMO_REQUISITIONS;

    const map = new Map<string, { vehicle: string; diesel: number; service: number; engineOil: number; other: number; total: number }>();

    requisitions.forEach(r => {
      if (!map.has(r.carModel)) {
        map.set(r.carModel, { vehicle: r.carModel, diesel: 0, service: 0, engineOil: 0, other: 0, total: 0 });
      }
      const entry = map.get(r.carModel)!;
      entry.total += r.amount;
      switch (r.type) {
        case 'Diesel': entry.diesel += r.amount; break;
        case 'Service': entry.service += r.amount; break;
        case 'Engine Oil':
        case 'Oil': entry.engineOil += r.amount; break;
        case 'Other': entry.other += r.amount; break;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }

  /**
   * Get overall category cost distribution (pie chart data)
   */
  static getOverallCategoryDistribution(year?: number): VehicleCategoryCost[] {
    const requisitions = year
      ? DEMO_REQUISITIONS.filter(r => new Date(r.date).getFullYear() === year)
      : DEMO_REQUISITIONS;

    let diesel = 0, service = 0, engineOil = 0, other = 0;
    let dieselCount = 0, serviceCount = 0, engineOilCount = 0, otherCount = 0;

    requisitions.forEach(r => {
      switch (r.type) {
        case 'Diesel': diesel += r.amount; dieselCount++; break;
        case 'Service': service += r.amount; serviceCount++; break;
        case 'Engine Oil':
        case 'Oil': engineOil += r.amount; engineOilCount++; break;
        case 'Other': other += r.amount; otherCount++; break;
      }
    });

    const grandTotal = diesel + service + engineOil + other;

    return [
      { category: 'Diesel', totalCost: diesel, percentage: grandTotal > 0 ? (diesel / grandTotal) * 100 : 0, recordCount: dieselCount },
      { category: 'Service', totalCost: service, percentage: grandTotal > 0 ? (service / grandTotal) * 100 : 0, recordCount: serviceCount },
      { category: 'Engine Oil', totalCost: engineOil, percentage: grandTotal > 0 ? (engineOil / grandTotal) * 100 : 0, recordCount: engineOilCount },
      { category: 'Other', totalCost: other, percentage: grandTotal > 0 ? (other / grandTotal) * 100 : 0, recordCount: otherCount },
    ];
  }

  /**
   * Get monthly total costs across all vehicles (for dashboard trend chart)
   */
  static getMonthlyTotalCosts(year: number): { month: string; diesel: number; service: number; engineOil: number; other: number; total: number }[] {
    const requisitions = DEMO_REQUISITIONS.filter(r => new Date(r.date).getFullYear() === year);

    return MONTHS.map((month, idx) => {
      const monthRecords = requisitions.filter(r => new Date(r.date).getMonth() === idx);
      let diesel = 0, service = 0, engineOil = 0, other = 0;
      monthRecords.forEach(r => {
        switch (r.type) {
          case 'Diesel': diesel += r.amount; break;
          case 'Service': service += r.amount; break;
          case 'Engine Oil':
          case 'Oil': engineOil += r.amount; break;
          case 'Other': other += r.amount; break;
        }
      });
      return { month, diesel, service, engineOil, other, total: diesel + service + engineOil + other };
    });
  }

  /**
   * Get available years from data
   */
  static getAvailableYears(): number[] {
    const years = new Set(DEMO_REQUISITIONS.map(r => new Date(r.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }

  /**
   * Add a new requisition (local-only, demo)
   */
  static addRequisition(requisition: Omit<VehicleRequisition, 'id'>): VehicleRequisition {
    const id = `VR-${String(DEMO_REQUISITIONS.length + 1).padStart(3, '0')}`;
    const newRequisition = { ...requisition, id };
    DEMO_REQUISITIONS.push(newRequisition);
    return newRequisition;
  }

  /**
   * Get totals for dashboard summary cards
   */
  static getDashboardTotals(year?: number): {
    totalVehicles: number;
    totalCost: number;
    highestCostVehicle: string;
    highestCostAmount: number;
    mostActiveCategory: VehicleRequisitionType;
    mostActiveCategoryAmount: number;
  } {
    const requisitions = year
      ? DEMO_REQUISITIONS.filter(r => new Date(r.date).getFullYear() === year)
      : DEMO_REQUISITIONS;

    const uniqueVehicles = new Set(requisitions.map(r => r.carModel));

    let diesel = 0, service = 0, engineOil = 0, other = 0;
    requisitions.forEach(r => {
      switch (r.type) {
        case 'Diesel': diesel += r.amount; break;
        case 'Service': service += r.amount; break;
        case 'Engine Oil':
        case 'Oil': engineOil += r.amount; break;
        case 'Other': other += r.amount; break;
      }
    });

    const totalCost = diesel + service + engineOil + other;

    // Highest cost vehicle
    const vehicleCosts = new Map<string, number>();
    requisitions.forEach(r => {
      vehicleCosts.set(r.carModel, (vehicleCosts.get(r.carModel) || 0) + r.amount);
    });

    let highestCostVehicle = '';
    let highestCostAmount = 0;
    vehicleCosts.forEach((cost, model) => {
      if (cost > highestCostAmount) {
        highestCostAmount = cost;
        highestCostVehicle = model;
      }
    });

    // Most active category
    const categories = [
      { type: 'Diesel' as VehicleRequisitionType, amount: diesel },
      { type: 'Service' as VehicleRequisitionType, amount: service },
      { type: 'Engine Oil' as VehicleRequisitionType, amount: engineOil },
      { type: 'Other' as VehicleRequisitionType, amount: other },
    ];
    const mostActive = categories.reduce((max, c) => c.amount > max.amount ? c : max, categories[0]);

    return {
      totalVehicles: uniqueVehicles.size,
      totalCost,
      highestCostVehicle,
      highestCostAmount,
      mostActiveCategory: mostActive.type,
      mostActiveCategoryAmount: mostActive.amount,
    };
  }
}

export const VEHICLE_REQUISITION_TYPES: VehicleRequisitionType[] = ['Diesel', 'Service', 'Engine Oil', 'Oil', 'Other'];
export const VEHICLE_STATUS_COLORS: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};
