<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class SpmiCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'cycle_stage',
        'sub_stage',
        'description',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = [
        'public_url',
    ];

    protected static function booted()
    {
        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
            if (empty($category->cycle_stage)) {
                $category->cycle_stage = 'penetapan';
            }
            if (empty($category->sub_stage)) {
                $category->sub_stage = 'kebijakan';
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name') && !$category->isDirty('slug')) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    public function documents(): HasMany
    {
        return $this->hasMany(SpmiDocument::class)->orderByDesc('year')->orderBy('title');
    }

    public function getPublicUrlAttribute(): string
    {
        return "/spmi/{$this->cycle_stage}/{$this->sub_stage}/{$this->slug}";
    }

    public function getPublishedMenuAttribute(): ?Menu
    {
        return Menu::where('url', $this->public_url)->first();
    }
}
