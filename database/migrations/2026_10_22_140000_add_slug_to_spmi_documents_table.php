<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('spmi_documents', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('title');
        });

        // Populate slug for existing records
        $documents = DB::table('spmi_documents')->get();
        foreach ($documents as $doc) {
            $baseSlug = Str::slug($doc->title);
            $slug = $baseSlug ?: 'dokumen-' . $doc->id;

            // Ensure unique
            $count = DB::table('spmi_documents')->where('slug', $slug)->where('id', '!=', $doc->id)->count();
            if ($count > 0) {
                $slug .= '-' . $doc->year . '-' . $doc->id;
            }

            DB::table('spmi_documents')->where('id', $doc->id)->update(['slug' => $slug]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('spmi_documents', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
