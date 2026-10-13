export interface GpsPoint {
  lat: number;
  lng: number;
}

export interface BranchExtra {
  head: string;
  staffCount: number;
  programCount: number;
}

export interface Branch {
  slug: string;
  name: string;
  nameEn: string;
  type: 'main' | 'regional';
  typeLabel: string;
  established: string;
  city: string;
  phone: string;
  email: string;
  address: string;
  gps: GpsPoint;
  isDefault: boolean;
  description: string;
  services: string[];
  featuredPrograms?: string[];
  extra: BranchExtra;
}

export type ProgramType = 'bachelor' | 'diploma' | 'master_academic' | 'master_executive' | 'course';

export interface Program {
  slug: string;
  type: ProgramType;
  typeLabel: string;
  name: string;
  department: string;
  image: string;
  duration: string;
  hours: number;
  mode: string;
  priceText: string;
  target: string;
  vision: string;
  mission: string;
  goals: string[];
  outcomes: string[];
  overview: string;
  requirements: string[];
  applyLink: string;
  status: string;
}

export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  category: string;
  branch: string;
  readingMinutes: number;
  summary: string;
  body: string;
  image: string;
  tags: string[];
}

export interface Announcement {
  code: string;
  title: string;
  date: string;
  type: string;
  branch: string;
  priority: boolean;
  body: string;
}

export interface EventItem {
  title: string;
  date: string;
  time: string;
  location: string;
  branch: string;
  type: string;
  speaker: string;
  registerLink: string;
  description: string;
}

export interface TrainingCourse {
  slug: string;
  code: string;
  title: string;
  category: string;
  image: string;
  duration: string;
  hours: number;
  mode: string;
  target: string;
  priceText: string;
  dates: string[];
  instructor: string;
  summary: string;
  overview: string;
  vision: string;
  mission: string;
  goals: string[];
  outcomes: string[];
  requirements: string[];
}