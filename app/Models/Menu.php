<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'type',
        'url',
        'order',
        'parent_id',
    ];

    public function getUrlAttribute(?string $value): ?string
    {
        if ($this->type === 'internal' && !empty($value) && $value !== '#') {
            $trimmed = trim($value);
            if (!str_starts_with($trimmed, 'http://') && !str_starts_with($trimmed, 'https://') && !str_starts_with($trimmed, 'mailto:') && !str_starts_with($trimmed, 'tel:')) {
                return '/' . ltrim($trimmed, '/');
            }
        }

        return $value;
    }

    public function setUrlAttribute(?string $value): void
    {
        if ($this->type === 'internal' && !empty($value) && $value !== '#') {
            $trimmed = trim($value);
            if (!str_starts_with($trimmed, 'http://') && !str_starts_with($trimmed, 'https://') && !str_starts_with($trimmed, 'mailto:') && !str_starts_with($trimmed, 'tel:')) {
                $value = '/' . ltrim($trimmed, '/');
            }
        }

        $this->attributes['url'] = $value;
    }

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('order');
    }

    public function childrenRecursive()
    {
        return $this->children()->with('childrenRecursive');
    }

    public function scopeTree($query)
    {
        return $query->with([
            'children' => fn ($q) => $q->orderBy('order'),
            'children.children' => fn ($q) => $q->orderBy('order'),
            'children.children.children' => fn ($q) => $q->orderBy('order'),
            'children.children.children.children' => fn ($q) => $q->orderBy('order'),
        ]);
    }

    public function getDepthAttribute(): int
    {
        $depth = 1;
        $parent = $this->parent;
        while ($parent) {
            $depth++;
            $parent = $parent->parent;
        }

        return $depth;
    }
}
