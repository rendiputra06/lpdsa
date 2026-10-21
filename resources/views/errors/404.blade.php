<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 — Halaman Tidak Ditemukan | LPDSA Universitas Abdurrab</title>
    <meta name="robots" content="noindex, follow">
    
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700,800" rel="stylesheet" />

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2e0813 100%);
            color: #f8fafc;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }

        .container {
            max-width: 580px;
            width: 100%;
            text-align: center;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: 28px;
            padding: 48px 32px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 16px;
            border-radius: 9999px;
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid rgba(212, 175, 55, 0.3);
            color: #facc15;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 24px;
        }

        .badge-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #facc15;
        }

        .error-code {
            font-size: clamp(80px, 18vw, 130px);
            font-weight: 900;
            line-height: 1;
            letter-spacing: -0.04em;
            background: linear-gradient(135deg, #ffffff 30%, #facc15 70%, #8B142C 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 8px;
        }

        h1 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 12px;
            color: #ffffff;
        }

        p {
            font-size: 15px;
            color: #94a3b8;
            line-height: 1.6;
            margin-bottom: 32px;
        }

        .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            justify-content: center;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 24px;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .btn-primary {
            background: linear-gradient(135deg, #8B142C 0%, #a61b36 100%);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 15px -3px rgba(139, 20, 44, 0.3);
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #a61b36 0%, #be2040 100%);
            transform: translateY(-2px);
            box-shadow: 0 14px 20px -3px rgba(139, 20, 44, 0.4);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.08);
            color: #e2e8f0;
            border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
            color: #ffffff;
            transform: translateY(-2px);
        }

        .footer {
            margin-top: 36px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 12px;
            color: #64748b;
        }

        .footer a {
            color: #facc15;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="badge">
            <span class="badge-dot"></span>
            <span>Universitas Abdurrab</span>
        </div>

        <div class="error-code">404</div>
        <h1>Halaman Tidak Ditemukan</h1>
        <p>Maaf, tautan atau pengumuman yang Anda tuju mungkin telah dipindahkan, dihapus, atau alamat URL yang Anda masukkan kurang tepat.</p>

        <div class="actions">
            <a href="/" class="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span>Kembali ke Beranda</span>
            </a>
            <a href="/announcements" class="btn btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                <span>Arsip Pengumuman</span>
            </a>
            <a href="/akreditasi" class="btn btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="6"/>
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
                <span>Data Akreditasi</span>
            </a>
        </div>

        <div class="footer">
            <span>Lembaga Pangkalan Data, SPMI, dan Akreditasi (LPDSA) • </span>
            <a href="https://univrab.ac.id" target="_blank" rel="noopener noreferrer">univrab.ac.id</a>
        </div>
    </div>
</body>
</html>
