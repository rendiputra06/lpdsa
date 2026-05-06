<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Announcement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'author_id',
        'title',
        'slug',
        'content',
        'excerpt',
        'thumbnail',
        'status',
        'type',
        'is_featured',
        'published_at',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function ($announcement) {
            if (empty($announcement->slug)) {
                $announcement->slug = Str::slug($announcement->title);
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function attachments()
    {
        return $this->hasMany(AnnouncementAttachment::class);
    }

    public function eventDetail()
    {
        return $this->hasOne(EventDetail::class, 'announcement_id', 'id');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, fn ($q, $search) =>
            $q->where('title', 'like', "%{$search}%")
        );

        $query->when(
            ($filters['category_id'] ?? null) && $filters['category_id'] !== 'all',
            fn ($q, $category_id) => $q->where('category_id', $category_id)
        );

        $query->when(
            ($filters['status'] ?? null) && $filters['status'] !== 'all',
            fn ($q, $status) => $q->where('status', $status)
        );

        $query->when(
            ($filters['type'] ?? null) && $filters['type'] !== 'all',
            fn ($q, $type) => $q->where('type', $type)
        );

        $query->when($filters['date_from'] ?? null, fn ($q, $date_from) =>
            $q->whereDate('created_at', '>=', $date_from)
        );

        $query->when($filters['date_to'] ?? null, fn ($q, $date_to) =>
            $q->whereDate('created_at', '<=', $date_to)
        );
    }
}
