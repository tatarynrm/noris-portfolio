import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    let messages;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/translations/${locale}`, {
            next: { revalidate: 0 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch translations: ${response.status}`);
        }

        messages = await response.json();
        console.log(`[i18n] Loaded messages for ${locale} from DB`);
    } catch (error) {
        console.error(`[i18n] Error fetching from DB, falling back to JSON:`, error);
        messages = (await import(`../../messages/${locale}.json`)).default;
    }

    return {
        locale,
        messages
    };
});
