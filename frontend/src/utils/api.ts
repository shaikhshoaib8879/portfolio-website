import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Developer {
  name: string;
  title: string;
  experience_years: number;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  resume_url: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  github_url: string;
  live_url?: string;
  image_url: string;
  featured: boolean;
  created_date: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  duration: string;
  description: string;
  technologies: string[];
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Stats {
  projects_completed: number;
  years_experience: number;
  technologies_used: number;
  github_repos: number;
  coffee_cups: number;
}

// API functions
export const getDeveloperInfo = (): Promise<Developer> =>
  api.get('/api/developer').then(res => res.data);

export const getSkills = (): Promise<Skill[]> =>
  api.get('/api/skills').then(res => res.data);

export const getProjects = (featured?: boolean): Promise<Project[]> =>
  api.get(`/api/projects${featured ? '?featured=true' : ''}`).then(res => res.data);

export const getProject = (id: number): Promise<Project> =>
  api.get(`/api/projects/${id}`).then(res => res.data);

export const getExperience = (): Promise<Experience[]> =>
  api.get('/api/experience').then(res => res.data);

export const getStats = (): Promise<Stats> =>
  api.get('/api/stats').then(res => res.data);

export const sendContactMessage = (message: ContactMessage): Promise<{ message: string }> =>
  api.post('/api/contact', message).then(res => res.data);
