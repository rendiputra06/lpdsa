import type { User } from './auth';

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Announcement {
    id: number;
    title: string;
    slug: string;
    content: string;
    category: Category;
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
}

export interface ActivityLog {
    id: number;
    activity: string;
    user: User | null;
    created_at: string;
}

export interface DashboardStats {
    totalAnnouncements: number;
    totalCategories: number;
    totalUsers: number;
    pendingAnnouncements: number;
}

export interface DashboardProps {
    stats: DashboardStats;
    recentAnnouncements: Announcement[];
    recentLogs: ActivityLog[];
}
