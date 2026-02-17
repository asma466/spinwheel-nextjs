export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  // position: string;
  // dateOfBirth: string;
  dob: string;
  // joinDate: string;
  // phone: string;
  avatar?: string;
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  available: boolean;
  imageUrl?: string;
  category: string;
}

export interface BirthdayRecord {
  id: string;
  employeeId: string;
  employee: Employee;
  date: string;
  emailSent: boolean;
  emailSentAt?: string;
  giftReceived?: Gift;
  giftReceivedAt?: string;
  spinCompleted: boolean;
  year: number;
}

export interface GiftHistory {
  employeeId: string;
  giftId: string;
  year: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'hr';
}