export type AnnouncementCategory = {
    id: number;
    name: string;
    slug: string;
    description?: string;
};

export type AnnouncementEventDetail = {
    id?: number;
    announcement_id?: number;
    start_at: string;
    end_at: string;
    location: string;
    speaker?: string | null;
    quota?: string | null;
    registration_link?: string | null;
};

export type AnnouncementDetail = {
    id: number;
    category_id: number;
    author_id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    thumbnail?: string;
    status: 'draft' | 'published';
    type: 'regular' | 'event';
    published_at: string | null;
    created_at: string;
    updated_at: string;
    category?: AnnouncementCategory;
    author?: {
        id: number;
        name: string;
    };
    event_detail?: AnnouncementEventDetail;
    attachments?: AttachmentItem[];
};

export type AttachmentItem = {
    id?: number;
    title: string;
    type: 'link' | 'file';
    file?: File | null;
    path?: string;
};

export type AnnouncementFormData = {
    title: string;
    category_id: string;
    content: string;
    status: 'draft' | 'published';
    type: 'regular' | 'event';
    published_at: string;
    is_featured: boolean;
    meta_title: string;
    meta_description: string;
    thumbnail: File | null;
    event_detail: {
        start_at: string;
        end_at: string;
        location: string;
        speaker: string;
        quota: string;
        registration_link: string;
    };
    attachments: AttachmentItem[];
    attachments_deleted: number[];
};

export type AnnouncementFilters = {
    search?: string;
    category_id?: string;
    status?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
};

export type PaginatedAnnouncements = {
    data: AnnouncementDetail[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};
