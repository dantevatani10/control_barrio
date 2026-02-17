/**
 * Share data using the Web Share API.
 * Falls back to clipboard copy if sharing is not supported.
 */
export async function shareData(data: ShareData): Promise<boolean> {
    if (navigator.share) {
        try {
            await navigator.share(data);
            return true;
        } catch (error) {
            console.error('Error sharing:', error);
            return false;
        }
    } else {
        // Fallback: Copy to clipboard (simplified)
        if (data.url) {
            try {
                await navigator.clipboard.writeText(data.url);
                alert('Link copiado al portapapeles');
                return true;
            } catch (err) {
                console.error('Failed to copy to clipboard', err);
            }
        }
        return false;
    }
}
