export type AcademicUnitType = 'university' | 'faculty' | 'study_program';

export type AcademicLevel = 'D3' | 'D4' | 'S1' | 'S2' | 'S3' | 'Profesi';

export type AccreditationStatus = 'active' | 'expired' | 'in_process';

export interface AcademicUnit {
    id: number;
    type: AcademicUnitType;
    code: string | null;
    name: string;
    level: AcademicLevel | string | null;
    faculty_name: string | null;
    parent_id: number | null;
    is_active: boolean;
    synced_at?: string | null;
    created_at?: string;
    updated_at?: string;
    parent?: AcademicUnit | null;
    children?: AcademicUnit[];
    accreditations?: Accreditation[];
    accreditations_count?: number;
    latest_accreditation?: Accreditation | null;
}

export interface Accreditation {
    id: number;
    academic_unit_id: number | null;
    unit_type: AcademicUnitType;
    unit_name: string;
    level: string | null;
    faculty_name: string | null;
    accreditation_body: string;
    grade: string;
    sk_number: string;
    sk_date: string | null;
    valid_until: string | null;
    certificate_file: string | null;
    status: AccreditationStatus;
    notes: string | null;
    academic_unit?: AcademicUnit | null;
    history?: Accreditation[];
    created_at: string;
    updated_at: string;
}

export interface AccreditationStats {
    total: number;
    active: number;
    university?: Accreditation | null;
    faculties_count?: number;
    study_programs_count?: number;
}
