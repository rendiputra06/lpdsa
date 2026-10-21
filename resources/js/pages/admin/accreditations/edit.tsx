import { Head } from '@inertiajs/react';
import React from 'react';
import AccreditationForm from '@/components/accreditation-form';
import type { AcademicUnit, Accreditation } from '@/types/accreditation';

interface EditProps {
    accreditation: Accreditation;
    academicUnits: AcademicUnit[];
    history: Accreditation[];
}

export default function Edit({ accreditation, academicUnits, history = [] }: EditProps) {
    return (
        <div className="space-y-6">
            <Head title={`Edit Akreditasi - ${accreditation.unit_name}`} />

            <AccreditationForm
                academicUnits={academicUnits}
                initialData={accreditation}
                history={history}
                submitUrl={`/admin/accreditations/${accreditation.id}`}
                method="put"
                submitLabel="Simpan Perubahan Akreditasi"
                pageTitle="Edit Data Akreditasi"
                pageSubtitle={`Memperbarui sertifikat & rincian SK untuk ${accreditation.unit_name}`}
            />
        </div>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Akreditasi', href: '/admin/accreditations' },
        { title: 'Edit Akreditasi', href: '/admin/accreditations' },
    ],
};
