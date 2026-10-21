<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\StaticPage;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate dynamic sitemap.xml for search engines.
     */
    public function index(): Response
    {
        $baseUrl = rtrim(config('app.url'), '/');
        $nowIso = now()->toAtomString();

        $latestAnnouncement = Announcement::published()->latest('updated_at')->first();
        $homeLastmod = $latestAnnouncement?->updated_at?->toAtomString() ?? $nowIso;

        $urls = [
            [
                'loc' => $baseUrl . '/',
                'lastmod' => $homeLastmod,
                'changefreq' => 'daily',
                'priority' => '1.0',
            ],
            [
                'loc' => $baseUrl . '/announcements',
                'lastmod' => $homeLastmod,
                'changefreq' => 'daily',
                'priority' => '0.9',
            ],
            [
                'loc' => $baseUrl . '/akreditasi',
                'lastmod' => $nowIso,
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ],
            [
                'loc' => $baseUrl . '/akreditasi/universitas',
                'lastmod' => $nowIso,
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ],
        ];

        // Static Pages
        $staticPages = StaticPage::all();
        foreach ($staticPages as $page) {
            $urls[] = [
                'loc' => $baseUrl . '/' . ltrim($page->slug, '/'),
                'lastmod' => $page->updated_at?->toAtomString() ?? $nowIso,
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ];
        }

        // Published Announcements
        $announcements = Announcement::published()->latest('updated_at')->get();
        foreach ($announcements as $announcement) {
            $item = [
                'loc' => $baseUrl . '/announcements/' . $announcement->slug,
                'lastmod' => $announcement->updated_at?->toAtomString() ?? $nowIso,
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ];

            if ($announcement->thumbnail) {
                $item['image'] = [
                    'loc' => $baseUrl . '/storage/' . ltrim($announcement->thumbnail, '/'),
                    'title' => $announcement->title,
                ];
            }

            $urls[] = $item;
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' . "\n";
        $xml .= '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";

        foreach ($urls as $u) {
            $xml .= '    <url>' . "\n";
            $xml .= '        <loc>' . htmlspecialchars($u['loc'], ENT_XML1) . '</loc>' . "\n";
            $xml .= '        <lastmod>' . $u['lastmod'] . '</lastmod>' . "\n";
            $xml .= '        <changefreq>' . $u['changefreq'] . '</changefreq>' . "\n";
            $xml .= '        <priority>' . $u['priority'] . '</priority>' . "\n";

            if (isset($u['image'])) {
                $xml .= '        <image:image>' . "\n";
                $xml .= '            <image:loc>' . htmlspecialchars($u['image']['loc'], ENT_XML1) . '</image:loc>' . "\n";
                $xml .= '            <image:title>' . htmlspecialchars($u['image']['title'], ENT_XML1) . '</image:title>' . "\n";
                $xml .= '        </image:image>' . "\n";
            }

            $xml .= '    </url>' . "\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
        ]);
    }
}
