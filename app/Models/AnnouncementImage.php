<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class AnnouncementImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'announcement_id',
        'image_path',
        'caption',
        'is_cover',
        'sort_order',
    ];

    protected $casts = [
        'is_cover' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = ['url'];

    protected static function booted()
    {
        static::deleted(function ($image) {
            if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
        });
    }

    public function announcement()
    {
        return $this->belongsTo(Announcement::class);
    }

    public function getUrlAttribute(): string
    {
        return $this->image_path ? asset('storage/' . $this->image_path) : '';
    }
}
