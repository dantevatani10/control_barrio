'use client';

import { useState, useEffect } from 'react';

// VAPID Public Key - In a real app, this comes from env vars
const PUBLIC_VAPID_KEY = 'BOKBS_X.............'; // Placeholder

export function useNotifications() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            // eslint-disable-next-line
            setPermission(Notification.permission);
            navigator.serviceWorker.ready.then(function (registration) {
                registration.pushManager.getSubscription().then(function (sub) {
                    if (sub) {
                        setIsSubscribed(true);
                        setSubscription(sub);
                    }
                });
            });
        }
    }, []);

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribeToNotifications = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                const sub = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
                });

                // TODO: Send subscription to backend
                console.log('User Subscribed:', sub);

                setSubscription(sub);
                setIsSubscribed(true);
                setPermission(Notification.permission);
                return true;
            } catch (error) {
                console.error('Failed to subscribe the user: ', error);
                return false;
            }
        }
        return false;
    };

    return {
        isSubscribed,
        subscription,
        permission,
        subscribeToNotifications
    };
}
