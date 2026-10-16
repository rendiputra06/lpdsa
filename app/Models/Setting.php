<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Retrieve a setting value by key with optional fallback.
     */
    public static function getValue(string $key, ?string $default = null): ?string
    {
        $value = static::where('key', $key)->value('value');

        return ($value !== null && $value !== '') ? (string) $value : $default;
    }
}
