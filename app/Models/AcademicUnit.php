<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademicUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'code',
        'name',
        'level',
        'faculty_name',
        'parent_id',
        'is_active',
        'synced_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'synced_at' => 'datetime',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(AcademicUnit::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(AcademicUnit::class, 'parent_id');
    }

    public function accreditations(): HasMany
    {
        return $this->hasMany(Accreditation::class, 'academic_unit_id');
    }

    public function latestAccreditation()
    {
        return $this->hasOne(Accreditation::class, 'academic_unit_id')->latestOfMany('valid_until');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeUniversities($query)
    {
        return $query->where('type', 'university');
    }

    public function scopeFaculties($query)
    {
        return $query->where('type', 'faculty');
    }

    public function scopeStudyPrograms($query)
    {
        return $query->where('type', 'study_program');
    }
}
