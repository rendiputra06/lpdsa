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
    publishedAnnouncements?: number;
    pendingAnnouncements: number;
    totalCategories: number;
    totalUsers: number;
    totalAccreditations?: number;
    activeAccreditations?: number;
    expiringAccreditations?: number;
    totalAcademicUnits?: number;
    studyProgramsCount?: number;
    facultiesCount?: number;
    lastSyncedAt?: string | null;
}

export interface DashboardProps {
    stats: DashboardStats;
    univAccreditation?: any;
    recentAnnouncements: Announcement[];
    recentAccreditations?: any[];
    recentLogs: ActivityLog[];
}
