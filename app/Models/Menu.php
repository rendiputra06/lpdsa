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
