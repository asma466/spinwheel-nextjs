import { Employee, Gift, BirthdayRecord, GiftHistory } from '@/src/types';

export const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    department: 'Engineering',
    dob: '1990-01-29',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    department: 'Marketing',
    dob: '1988-01-29',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    department: 'Design',
    dob: '1992-02-14',
  },
  {
    id: 4,
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    department: 'HR',
    dob: '1985-03-22',
  },
  {
    id: 5,
    name: 'Amanda Foster',
    email: 'amanda.foster@company.com',
    department: 'Finance',
    dob: '1991-04-05',
  },
  {
    id: 6,
    name: 'David Kim',
    email: 'david.kim@company.com',
    department: 'Engineering',
    dob: '1993-05-18',
  },
  {
    id: 7,
    name: 'Lisa Thompson',
    email: 'lisa.thompson@company.com',
    department: 'Sales',
    dob: '1989-06-30',
  },
  {
    id: 8,
    name: 'Robert Martinez',
    email: 'robert.martinez@company.com',
    department: 'Operations',
    dob: '1987-07-12',
  },
];

export const mockGifts: Gift[] = [
  {
    id: '1',
    name: 'Amazon Gift Card',
    quantity: 5,
    available: true,
    category: 'Gift Cards',
  },
  {
    id: '2',
    name: 'Spa Day Voucher',
    quantity: 2,
    available: true,
    category: 'Experience',
  },
  {
    id: '3',
    name: 'Premium Headphones',
    quantity: 0,
    available: false,
    category: 'Electronics',
  },
  {
    id: '4',
    name: 'Extra Day Off',
    quantity: 1,
    available: true,
    category: 'Time Off',
  },
  {
    id: '5',
    name: 'Restaurant Voucher',
    quantity: 3,
    available: true,
    category: 'Gift Cards',
  },
  {
    id: '6',
    name: 'Fitness Subscription',
    quantity: 4,
    available: true,
    category: 'Wellness',
  },
  {
    id: '7',
    name: 'Movie Bundle',
    quantity: 6,
    available: true,
    category: 'Entertainment',
  },
  {
    id: '8',
    name: 'Book Bundle',
    quantity: 7,
    available: true,
    category: 'Education',
  },
];

export const mockBirthdayRecords: BirthdayRecord[] = [
  {
    id: '1',
    employeeId: 1,
    employee: mockEmployees[0],
    date: '2026-01-29',
    emailSent: true,
    emailSentAt: '2026-01-29T08:00:00Z',
    giftReceived: mockGifts[0],
    giftReceivedAt: '2026-01-29T10:30:00Z',
    spinCompleted: true,
    year: 2026,
  },
  {
    id: '2',
    employeeId: 2,
    employee: mockEmployees[1],
    date: '2026-01-29',
    emailSent: true,
    emailSentAt: '2026-01-29T08:00:00Z',
    spinCompleted: false,
    year: 2026,
  },
  {
    id: '3',
    employeeId: 3,
    employee: mockEmployees[2],
    date: '2026-02-14',
    emailSent: false,
    spinCompleted: false,
    year: 2026,
  },
];

export const mockGiftHistory: GiftHistory[] = [
  { employeeId: 1, giftId: '2', year: 2025 },
  { employeeId: 1, giftId: '4', year: 2024 },
  { employeeId: 2, giftId: '1', year: 2025 },
  { employeeId: 3, giftId: '5', year: 2025 },
];
