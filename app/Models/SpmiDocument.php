<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SpmiDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'spmi_category_id',
        'document_number',
        'title',
        'slug',
        'year',
        'file_path',
        'external_url',
        'description',
        'is_public',
        'download_count',
    ];

    protected $casts = [
        'year' => 'integer',
        'is_public' => 'boolean',
        'download_count' => 'integer',
    ];

    protected $appends = [
        'effective_url',
        'share_url',
    ];

    protected static function booted()
    {
        static::creating(function ($doc) {
            if (empty($doc->slug)) {
                $base = Str::slug($doc->title);
                $slug = $base ?: 'dokumen-' . Str::random(6);

                $count = static::where('slug', $slug)->count();
                if ($count > 0) {
                    $slug .= '-' . ($doc->year ?: date('Y')) . '-' . Str::random(4);
                }

                $doc->slug = $slug;
            }
        });

        static::updating(function ($doc) {
            if ($doc->isDirty('title') && !$doc->isDirty('slug')) {
                $base = Str::slug($doc->title);
                $slug = $base ?: 'dokumen-' . Str::random(6);

                $count = static::where('slug', $slug)->where('id', '!=', $doc->id)->count();
                if ($count > 0) {
                    $slug .= '-' . ($doc->year ?: date('Y')) . '-' . Str::random(4);
                }

                $doc->slug = $slug;
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(SpmiCategory::class, 'spmi_category_id');
    }

    public function getEffectiveUrlAttribute(): ?string
    {
        if (!empty($this->external_url)) {
            return $this->external_url;
        }

        if (!empty($this->file_path)) {
            return Storage::url($this->file_path);
        }

        return null;
    }

    public function getShareUrlAttribute(): string
    {
        return route('spmi.documents.open', $this->slug ?: $this->id);
    }
}
