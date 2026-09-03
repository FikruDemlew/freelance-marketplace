import { useCallback, useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import {
    getNotifications,
    markNotificationRead,
} from "../services/notification";

const formatDate = (value) => new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
}).format(new Date(value));

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const loadNotifications = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            setNotifications(await getNotifications());
        } catch (requestError) {
            console.error("Failed to load notifications:", requestError);
            setError("Unable to load notifications. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timerId = window.setTimeout(loadNotifications, 0);
        return () => window.clearTimeout(timerId);
    }, [loadNotifications]);

    const handleMarkAsRead = async (notificationId) => {
        setUpdatingId(notificationId);
        try {
            const updatedNotification = await markNotificationRead(notificationId);
            setNotifications((current) => current.map((notification) => (
                notification.id === notificationId
                    ? updatedNotification
                    : notification
            )));
        } catch (requestError) {
            console.error("Failed to mark notification as read:", requestError);
            setError("Unable to mark this notification as read.");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-main">
            <Navbar />
            <main className="mx-auto max-w-4xl px-6 py-10 lg:px-10">
                <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        Activity
                    </p>
                    <h1 className="mt-1 font-display text-3xl font-bold">Notifications</h1>
                    <p className="mt-2 text-sm text-text-muted">
                        Updates about applications and messages in one place.
                    </p>
                </div>

                {loading ? (
                    <div className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-surface">
                        <div className="spinner" />
                        <p className="text-sm text-text-muted">Loading notifications…</p>
                    </div>
                ) : error ? (
                    <div className="rounded-3xl border border-red-500/25 bg-red-500/10 p-7 text-center">
                        <p className="text-sm text-red-300">{error}</p>
                        <button
                            type="button"
                            onClick={loadNotifications}
                            className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-bold text-[#07130c] hover:bg-primary-hover"
                        >
                            Try again
                        </button>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-border bg-surface p-12 text-center">
                        <p className="text-lg font-bold">No notifications yet</p>
                        <p className="mt-2 text-sm text-text-muted">
                            New application activity and messages will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <article
                                key={notification.id}
                                className={`flex gap-4 rounded-2xl border p-5 ${
                                    notification.is_read
                                        ? "border-border bg-surface"
                                        : "border-primary/30 bg-primary/5"
                                }`}
                            >
                                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                                    notification.is_read ? "bg-text-subtle" : "bg-primary"
                                }`} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm leading-6 text-text-main">
                                        {notification.message}
                                    </p>
                                    <p className="mt-1 text-xs text-text-muted">
                                        {formatDate(notification.created_at)}
                                    </p>
                                </div>
                                {!notification.is_read && (
                                    <button
                                        type="button"
                                        disabled={updatingId === notification.id}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className="shrink-0 self-start text-xs font-bold text-primary hover:text-primary-hover disabled:opacity-50"
                                    >
                                        {updatingId === notification.id ? "Saving…" : "Mark as read"}
                                    </button>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Notifications;
