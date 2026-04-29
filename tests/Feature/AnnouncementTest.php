<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as AssertableInertia;
use Tests\TestCase;

class AnnouncementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    public function test_guests_cannot_access_announcement_index()
    {
        $response = $this->get(route('admin.announcements.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_admin_users_can_access_announcement_index()
    {
        $this->actingAs($this->admin);

        $response = $this->get(route('admin.announcements.index'));
        $response->assertOk();
    }

    public function test_announcement_index_displays_announcements()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();
        Announcement::factory()->count(5)->create(['category_id' => $category->id]);

        $response = $this->get(route('admin.announcements.index'));
        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page->has('announcements'));
    }

    public function test_announcement_index_can_search()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();
        Announcement::factory()->create([
            'category_id' => $category->id,
            'title' => 'Test Announcement',
        ]);
        Announcement::factory()->create([
            'category_id' => $category->id,
            'title' => 'Other Announcement',
        ]);

        $response = $this->get(route('admin.announcements.index', ['search' => 'Test']));
        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->has('announcements')
            ->where('announcements.data', fn ($data) => count($data) === 1)
        );
    }

    public function test_admin_users_can_access_create_page()
    {
        $this->actingAs($this->admin);

        $response = $this->get(route('admin.announcements.create'));
        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page->has('categories'));
    }

    public function test_admin_users_can_create_announcement()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();

        $response = $this->post(route('admin.announcements.store'), [
            'category_id' => $category->id,
            'title' => 'Test Announcement',
            'content' => 'This is test content',
            'status' => 'draft',
            'type' => 'regular',
        ]);

        $response->assertRedirect(route('admin.announcements.index'));
        $this->assertDatabaseHas('announcements', [
            'title' => 'Test Announcement',
            'content' => 'This is test content',
        ]);
    }

    public function test_announcement_requires_required_fields()
    {
        $this->actingAs($this->admin);

        $response = $this->post(route('admin.announcements.store'), []);

        $response->assertSessionHasErrors(['category_id', 'title', 'content', 'status', 'type']);
    }

    public function test_announcement_title_must_not_exceed_255_characters()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();

        $response = $this->post(route('admin.announcements.store'), [
            'category_id' => $category->id,
            'title' => str_repeat('a', 256),
            'content' => 'Test content',
            'status' => 'draft',
            'type' => 'regular',
        ]);

        $response->assertSessionHasErrors(['title']);
    }

    public function test_announcement_status_must_be_valid()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();

        $response = $this->post(route('admin.announcements.store'), [
            'category_id' => $category->id,
            'title' => 'Test Announcement',
            'content' => 'Test content',
            'status' => 'invalid',
            'type' => 'regular',
        ]);

        $response->assertSessionHasErrors(['status']);
    }

    public function test_announcement_type_must_be_valid()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();

        $response = $this->post(route('admin.announcements.store'), [
            'category_id' => $category->id,
            'title' => 'Test Announcement',
            'content' => 'Test content',
            'status' => 'draft',
            'type' => 'invalid',
        ]);

        $response->assertSessionHasErrors(['type']);
    }

    public function test_announcement_can_upload_thumbnail()
    {
        Storage::fake('public');

        $this->actingAs($this->admin);

        $category = Category::factory()->create();
        $file = UploadedFile::fake()->image('thumbnail.jpg');

        $response = $this->post(route('admin.announcements.store'), [
            'category_id' => $category->id,
            'title' => 'Test Announcement',
            'content' => 'Test content',
            'status' => 'draft',
            'type' => 'regular',
            'thumbnail' => $file,
        ]);

        $response->assertRedirect(route('admin.announcements.index'));
        Storage::disk('public')->assertExists('announcements/' . $file->hashName());
    }

    public function test_published_announcement_sets_published_at()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();

        $response = $this->post(route('admin.announcements.store'), [
            'category_id' => $category->id,
            'title' => 'Test Announcement',
            'content' => 'Test content',
            'status' => 'published',
            'type' => 'regular',
        ]);

        $response->assertRedirect(route('admin.announcements.index'));
        $this->assertDatabaseHas('announcements', [
            'title' => 'Test Announcement',
            'status' => 'published',
        ]);
        $this->assertNotNull(Announcement::where('title', 'Test Announcement')->first()->published_at);
    }

    public function test_event_announcement_can_create_event_detail()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();

        $response = $this->post(route('admin.announcements.store'), [
            'category_id' => $category->id,
            'title' => 'Test Event',
            'content' => 'Test content',
            'status' => 'published',
            'type' => 'event',
            'event_detail' => [
                'start_at' => now()->addDays(1)->toDateTimeString(),
                'end_at' => now()->addDays(1)->addHours(4)->toDateTimeString(),
                'location' => 'Test Location',
                'speaker' => 'Test Speaker',
                'quota' => 100,
                'registration_link' => 'https://test.com',
            ],
        ]);

        $response->assertRedirect(route('admin.announcements.index'));
        $this->assertDatabaseHas('announcements', [
            'title' => 'Test Event',
            'type' => 'event',
        ]);
        $this->assertDatabaseHas('event_details', [
            'location' => 'Test Location',
        ]);
    }

    public function test_admin_users_can_access_edit_page()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();
        $announcement = Announcement::factory()->create(['category_id' => $category->id]);

        $response = $this->get(route('admin.announcements.edit', $announcement));
        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->has('announcement')
            ->has('categories')
        );
    }

    public function test_admin_users_can_update_announcement()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();
        $announcement = Announcement::factory()->create(['category_id' => $category->id]);

        $response = $this->put(route('admin.announcements.update', $announcement), [
            'category_id' => $category->id,
            'title' => 'Updated Title',
            'content' => 'Updated content',
            'status' => 'published',
            'type' => 'regular',
        ]);

        $response->assertRedirect(route('admin.announcements.index'));
        $this->assertDatabaseHas('announcements', [
            'id' => $announcement->id,
            'title' => 'Updated Title',
            'content' => 'Updated content',
        ]);
    }

    public function test_announcement_update_requires_valid_fields()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();
        $announcement = Announcement::factory()->create(['category_id' => $category->id]);

        $response = $this->put(route('admin.announcements.update', $announcement), [
            'title' => '',
        ]);

        $response->assertSessionHasErrors(['category_id', 'title', 'content', 'status', 'type']);
    }

    public function test_announcement_update_can_change_type_to_event()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();
        $announcement = Announcement::factory()->create([
            'category_id' => $category->id,
            'type' => 'regular',
        ]);

        $response = $this->put(route('admin.announcements.update', $announcement), [
            'category_id' => $category->id,
            'title' => 'Updated Title',
            'content' => 'Updated content',
            'status' => 'published',
            'type' => 'event',
            'event_detail' => [
                'start_at' => now()->addDays(1)->toDateTimeString(),
                'end_at' => now()->addDays(1)->addHours(4)->toDateTimeString(),
                'location' => 'Test Location',
                'speaker' => 'Test Speaker',
                'quota' => 100,
                'registration_link' => 'https://test.com',
            ],
        ]);

        $response->assertRedirect(route('admin.announcements.index'));
        $this->assertDatabaseHas('announcements', [
            'id' => $announcement->id,
            'type' => 'event',
        ]);
        $this->assertDatabaseHas('event_details', [
            'location' => 'Test Location',
        ]);
    }

    public function test_announcement_update_can_change_type_from_event_to_regular()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();
        $announcement = Announcement::factory()->event()->create(['category_id' => $category->id]);
        $announcement->eventDetail()->create([
            'start_at' => now()->addDays(1),
            'end_at' => now()->addDays(1)->addHours(4),
            'location' => 'Test Location',
        ]);

        $response = $this->put(route('admin.announcements.update', $announcement), [
            'category_id' => $category->id,
            'title' => 'Updated Title',
            'content' => 'Updated content',
            'status' => 'published',
            'type' => 'regular',
            'published_at' => $announcement->published_at,
        ]);

        $response->assertRedirect(route('admin.announcements.index'));
        $this->assertDatabaseHas('announcements', [
            'id' => $announcement->id,
            'type' => 'regular',
        ]);
        $this->assertDatabaseMissing('event_details', [
            'announcement_id' => $announcement->id,
        ]);
    }

    public function test_admin_users_can_delete_announcement()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();
        $announcement = Announcement::factory()->create(['category_id' => $category->id]);

        $response = $this->delete(route('admin.announcements.destroy', $announcement));

        $response->assertRedirect(route('admin.announcements.index'));
        $this->assertSoftDeleted('announcements', [
            'id' => $announcement->id,
        ]);
    }

    public function test_announcement_index_is_paginated()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();
        Announcement::factory()->count(15)->create(['category_id' => $category->id]);

        $response = $this->get(route('admin.announcements.index'));
        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->has('announcements')
            ->where('announcements.data', fn ($data) => count($data) === 10)
        );
    }
}
