<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreAccreditationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'academic_unit_id' => 'nullable|exists:academic_units,id',
            'unit_type' => 'required|in:university,faculty,study_program',
            'unit_name' => 'required|string|max:255',
            'level' => 'nullable|string|max:50',
            'faculty_name' => 'nullable|string|max:255',
            'accreditation_body' => 'required|string|max:100',
            'grade' => 'required|string|max:50',
            'sk_number' => 'required|string|max:255',
            'sk_date' => 'nullable|date',
            'valid_until' => 'nullable|date',
            'status' => 'required|in:active,expired,in_process',
            'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp|max:5120',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'unit_type.required' => 'Jenis entitas wajib dipilih.',
            'unit_name.required' => 'Nama entitas wajib diisi.',
            'accreditation_body.required' => 'Lembaga akreditasi wajib diisi.',
            'grade.required' => 'Peringkat akreditasi wajib dipilih.',
            'sk_number.required' => 'Nomor SK wajib diisi.',
            'certificate_file.max' => 'Berkas sertifikat maksimal berukuran 5MB.',
            'certificate_file.mimes' => 'Format berkas sertifikat harus berupa PDF atau gambar (JPG, PNG, WebP).',
        ];
    }
}
