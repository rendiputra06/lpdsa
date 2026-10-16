<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Accreditation extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_unit_id',
        'unit_type',
        'unit_name',
        'level',
        'faculty_name',
        'accreditation_body',
        'grade',
        'sk_number',
        'sk_date',
        'valid_until',
        'certificate_file',
        'status',
        'notes',
    ];

    protected $casts = [
        'sk_date' => 'date',
        'valid_until' => 'date',
    ];

    protected static function booted(): void
    {
        static::deleting(function (Accreditation $accreditation) {
            if ($accreditation->certificate_file && Storage::disk('public')->exists($accreditation->certificate_file)) {
                Storage::disk('public')->delete($accreditation->certificate_file);
            }
        });
    }

    public function academicUnit(): BelongsTo
    {
        return $this->belongsTo(AcademicUnit::class, 'academic_unit_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeUniversity($query)
    {
        return $query->where('unit_type', 'university');
    }

    public function scopeFaculty($query)
    {
        return $query->where('unit_type', 'faculty');
    }

    public function scopeStudyProgram($query)
    {
        return $query->where('unit_type', 'study_program');
    }

    /**
     * Check if accreditation is expiring soon (within 180 days / 6 months)
     */
    public function getIsExpiringSoonAttribute(): bool
    {
        if (!$this->valid_until) {
            return false;
        }

        return $this->valid_until->isFuture() && $this->valid_until->diffInDays(now()) <= 180;
    }
}
