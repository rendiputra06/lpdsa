/**
 * Format a date string into Indonesian localized format.
 * Example: '14 Oktober 2026' or with time '14 Oktober 2026, 09:00 WIB'
 */
export function formatDate(dateString: string | null | undefined, includeTime = false): string {
    if (!dateString) {
return '-';
}

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
return '-';
}

        const dateFormatted = new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);

        if (!includeTime) {
return dateFormatted;
}

        const timeFormatted = new Intl.DateTimeFormat('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);

        return `${dateFormatted}, ${timeFormatted} WIB`;
    } catch {
        return dateString;
    }
}

/**
 * Format date into parts for calendar badge (day, month short, year)
 */
export function getDateBadgeParts(dateString: string | null | undefined): { day: string; month: string; year: string } {
    if (!dateString) {
        return { day: '--', month: '---', year: '----' };
    }

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return { day: '--', month: '---', year: '----' };
        }

        const day = date.getDate().toString().padStart(2, '0');
        const month = new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(date).toUpperCase();
        const year = date.getFullYear().toString();

        return { day, month, year };
    } catch {
        return { day: '--', month: '---', year: '----' };
    }
}
