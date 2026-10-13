import type { Branch } from './types';

import config from '../data/siteConfig.json';
import navigation from '../data/navigation.json';
import branchesData from '../data/branches.json';
import collegesData from '../data/colleges.json';
import departmentsData from '../data/departments.json';
import programsData from '../data/programs.json';
import facultyData from '../data/faculty.json';
import newsData from '../data/news.json';
import announcementsData from '../data/announcements.json';
import eventsData from '../data/events.json';
import trainingData from '../data/training.json';
import researchData from '../data/research.json';
import galleryData from '../data/gallery.json';
import partnersData from '../data/partners.json';
import testimonialsData from '../data/testimonials.json';
import eServicesData from '../data/eServices.json';
import centersData from '../data/centers.json';

export const siteConfig = config;
export const navigationItems = navigation;
export const branches = branchesData as Branch[];
export const colleges = collegesData;
export const departments = departmentsData;
export const programs = programsData;
export const faculty = facultyData;
export const newsItems = newsData;
export const announcements = announcementsData;
export const events = eventsData;
export const trainingCourses = trainingData;
export const researchPapers = researchData;
export const galleryAlbums = galleryData;
export const partners = partnersData;
export const testimonials = testimonialsData;
export const eServices = eServicesData;
export const centers = centersData;

export const instituteLogo = '/logo.png';

export function mediaOf(image: string): string {
  return image || instituteLogo;
}

export function getBranch(slug: string): Branch | undefined {
  return branches.find((b) => b.slug === slug);
}

export function getDefaultBranch(): Branch {
  const main = branches.find((b) => b.isDefault);
  return main ?? branches[0];
}

export function getCollege(slug: string) {
  return colleges.find((c) => c.slug === slug);
}

export function getDepartment(slug: string) {
  return departments.find((d) => d.slug === slug);
}

export function getDepartmentPrograms(departmentSlug: string) {
  return programs.filter((p) => p.department === departmentSlug);
}

export function getDepartmentFaculty(departmentSlug: string) {
  return faculty.filter((f) => f.department === departmentSlug);
}

export function getProgramsByCollege(college: (typeof colleges)[number]) {
  return programs.filter((p) => college.departments.includes(p.department));
}

export function getGenerator(kind: 'news' | 'research' | 'training') {
  return kind === 'news' ? newsItems : kind === 'research' ? researchPapers : trainingCourses;
}

export function getLatest<T extends { date?: string }>(items: T[], count = 4): T[] {
  return [...items].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).slice(0, count);
}

export function getPriorityAnnouncements() {
  return announcements.filter((a) => a.priority);
}

export function getUpcomingEvents() {
  const today = new Date().toISOString().slice(0, 10);
  return events
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function searchAllPrograms(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return programs.filter((p) =>
    [p.name, p.typeLabel, p.overview, p.target]
      .join(' ')
      .toLowerCase()
      .includes(q),
  );
}

export { defaultBranchSlug } from './branchStatic';