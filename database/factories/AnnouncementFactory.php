<?php

namespace Database\Factories;

use App\Models\Announcement;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Announcement>
 */
class AnnouncementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'author_id' => User::factory(),
            'title' => fake()->sentence(),
            'slug' => fn (array $attributes) => Str::slug($attributes['title']) . '-' . rand(1000, 9999),
            'content' => fake()->paragraphs(3, true),
            'excerpt' => fake()->sentence(),
            'thumbnail' => null,
            'status' => fake()->randomElement(['draft', 'published']),
            'type' => fake()->randomElement(['regular', 'event']),
            'published_at' => fake()->randomElement([null, now()]),
        ];
    }

    /**
     * Indicate that the announcement is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    /**
     * Indicate that the announcement is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the announcement is an event.
     */
    public function event(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'event',
        ]);
    }
}
