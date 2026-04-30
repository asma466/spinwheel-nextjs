export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  // position: string;
  // dateOfBirth: string;
  dob: Date;
  role: string| null;
  password?: string | null; 
  // joinDate: string;
  // phone: string;
  avatar?: string;
}

export interface Gift {
  id: number;
  name: string;
  quantity: number;
  available: boolean;
  imageUrl?: string;
  
}

export interface BirthdayRecord {
  id: number;
  employeeId: number;
  employee: Employee;
  date: string;
  emailSent: boolean;
  emailSentAt?: string;
  spinToken: string;
  tokenExpiresAt: string;
  giftReceived?: Gift;
  giftReceivedAt?: string;
  spinCompleted: boolean;
  year: number;
}

export interface GiftHistory {
  employeeId: number;
  giftId: string;
  year: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}