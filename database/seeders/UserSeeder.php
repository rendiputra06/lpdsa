<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'superadmin@univrab.ac.id'],
            [
                'name' => 'Super Admin LPDSA',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@univrab.ac.id'],
            [
                'name' => 'Admin LPDSA',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );
    }
}
