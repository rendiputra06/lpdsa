<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnouncementAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'announcement_id',
        'title',
        'type',
        'path',
    ];

    protected static function booted()
    {
        static::deleted(function ($attachment) {
            if ($attachment->type === 'file' && $attachment->path && \Illuminate\Support\Facades\Storage::disk('public')->exists($attachment->path)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($attachment->path);
            }
        });
    }

    public function announcement()
    {
        return $this->belongsTo(Announcement::class);
    }
}
