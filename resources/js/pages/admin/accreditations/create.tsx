import { Head } from '@inertiajs/react';
import React from 'react';
import AccreditationForm from '@/components/accreditation-form';
import type { AcademicUnit, Accreditation } from '@/types/accreditation';

interface CreateProps {
    academicUnits: AcademicUnit[];
    selectedUnit?: AcademicUnit | null;
    history?: Accreditation[];
}

export default function Create({ academicUnits, selectedUnit, history = [] }: CreateProps) {
    return (
        <div className="space-y-6">
            <Head title="Tambah Data Akreditasi" />

            <AccreditationForm
                academicUnits={academicUnits}
                preselectedUnitId={selectedUnit?.id}
                initialData={
                    selectedUnit
                        ? {
                              academic_unit_id: selectedUnit.id,
                              unit_type: selectedUnit.type,
                              unit_name: selectedUnit.name,
                              level: selectedUnit.level,
                              faculty_name: selectedUnit.faculty_name,
                          }
                        : undefined
                }
                history={history}
                submitUrl="/admin/accreditations"
                method="post"
                submitLabel="Simpan Data Akreditasi"
                pageTitle="Tambah Akreditasi Baru"
                pageSubtitle={
                    selectedUnit
                        ? `Mendaftarkan periode akreditasi baru untuk ${selectedUnit.name}`
                        : 'Daftarkan sertifikat dan peringkat akreditasi universitas, fakultas, atau program studi'
                }
            />
        </div>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Akreditasi', href: '/admin/accreditations' },
        { title: 'Tambah Akreditasi', href: '/admin/accreditations/create' },
    ],
};
