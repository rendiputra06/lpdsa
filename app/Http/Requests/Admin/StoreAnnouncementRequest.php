<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('event_detail')) {
            $eventDetail = $this->input('event_detail', []);

            // Convert empty strings to null for quota
            if (isset($eventDetail['quota']) && $eventDetail['quota'] === '') {
                $eventDetail['quota'] = null;
            }

            // Remove announcement_id if present (security measure)
            unset($eventDetail['announcement_id']);

            $this->merge(['event_detail' => $eventDetail]);
        }
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'type' => 'required|in:regular,event',
            'thumbnail' => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
            'event_detail' => 'nullable|array|required_if:type,event',
            'event_detail.start_at' => 'required_if:type,event|nullable|date',
            'event_detail.end_at' => 'required_if:type,event|nullable|date|after_or_equal:event_detail.start_at',
            'event_detail.location' => 'required_if:type,event|nullable|string|max:255',
            'event_detail.speaker' => 'nullable|string|max:255',
            'event_detail.quota' => 'nullable|integer|min:1',
            'event_detail.announcement_id' => 'nullable|integer|exists:announcements,id',
            'event_detail.registration_link' => 'nullable|url|max:255',
            'is_featured' => 'nullable|boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:1000',
            'attachments' => 'nullable|array',
            'attachments.*.id' => 'nullable|integer|exists:announcement_attachments,id',
            'attachments.*.title' => 'required_with:attachments|string|max:255',
            'attachments.*.type' => 'required_with:attachments|in:link,file',
            'attachments.*.file' => 'nullable|file|max:20480',
            'attachments.*.path' => 'nullable|string|max:1000',
            'attachments_deleted' => 'nullable|array',
            'attachments_deleted.*' => 'integer|exists:announcement_attachments,id',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists' => 'Kategori tidak valid.',
            'title.required' => 'Judul pengumuman wajib diisi.',
            'title.max' => 'Judul maksimal 255 karakter.',
            'content.required' => 'Konten pengumuman wajib diisi.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status tidak valid.',
            'type.required' => 'Tipe pengumuman wajib dipilih.',
            'type.in' => 'Tipe pengumuman tidak valid.',
            'thumbnail.image' => 'File harus berupa gambar.',
            'thumbnail.max' => 'Ukuran gambar maksimal 2MB.',
            'event_detail.required_if' => 'Detail event wajib diisi untuk tipe event.',
            'event_detail.start_at.required_if' => 'Waktu mulai wajib diisi.',
            'event_detail.start_at.date' => 'Waktu mulai harus berupa tanggal yang valid.',
            'event_detail.end_at.required_if' => 'Waktu selesai wajib diisi.',
            'event_detail.end_at.date' => 'Waktu selesai harus berupa tanggal yang valid.',
            'event_detail.end_at.after_or_equal' => 'Waktu selesai harus setelah atau sama dengan waktu mulai.',
            'event_detail.location.required_if' => 'Lokasi wajib diisi.',
            'event_detail.location.max' => 'Lokasi maksimal 255 karakter.',
            'event_detail.speaker.max' => 'Nama speaker maksimal 255 karakter.',
            'event_detail.quota.integer' => 'Kuota harus berupa angka.',
            'event_detail.quota.min' => 'Kuota minimal 1 peserta.',
            'event_detail.registration_link.url' => 'Link pendaftaran harus berupa URL yang valid.',
            'event_detail.registration_link.max' => 'Link pendaftaran maksimal 255 karakter.',
        ];
    }
}
