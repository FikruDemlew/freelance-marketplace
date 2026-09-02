import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import {
    getNotifications,
    markNotificationRead,
} from "../services/notification";

function Navbar({ landing = false }) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            return;
        }

        const loadNotifications = async () => {
            try {
                setNotifications(await getNotifications());
            } catch (error) {
                console.error("Failed to load notifications:", error);
            }
        };

        loadNotifications();
    }, [user]);

    const markAsRead = async (notificationId) => {
        const notification = notifications.find(
            (item) => item.id === notificationId
        );
        if (!notification || notification.is_read) return;

        try {
            const updatedNotification = await markNotificationRead(notificationId);
            setNotifications((current) => current.map((item) => (
                item.id === notificationId ? updatedNotification : item
            )));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.is_read
    ).length;

    const navLink = (to, label) => {
        const active = location.pathname === to;
        return (
            <Link
                to={to}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                    active
                        ? "text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-primary"
                        : "text-gray-400 hover:text-white"
                }`}
            >
                {label}
            </Link>
        );
    };

    return (
        <nav
            className={`relative z-50 border-b text-white ${
                landing
                    ? "border-white/8 bg-transparent"
                    : "border-border bg-ink/95 backdrop-blur-xl"
            }`}
        >
            <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-5 sm:px-6 lg:px-10">

                {/* Logo */}
                <Link
                    to="/jobs"
                    className="group flex items-center gap-2.5 text-white"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-[#07130c] transition-all duration-200 group-hover:shadow-[0_0_14px_rgba(0,192,88,0.5)]">
                        ↗
                    </span>
                    <span className="font-display text-[15px] font-bold tracking-tight sm:text-lg">
                        Freelance<span className="text-primary">Hub</span>
                    </span>
                </Link>

                {/* Center navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {landing ? (
                        <>
                            <a href="#talent" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">Freelancers</a>
                            <a href="#how-it-works" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">How it works</a>
                            <a href="#talent" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">Pricing</a>
                            <a href="#talent" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">Blog</a>
                        </>
                    ) : (
                        <>
                            {navLink("/jobs", "Find Jobs")}
                            {user && navLink("/dashboard", "Dashboard")}
                            <a href="#how-it-works" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
                                How It Works
                            </a>
                            {user?.role === "client" && navLink("/my-jobs", "My Jobs")}
                            {user?.role === "freelancer" && navLink("/my-applications", "My Applications")}
                        </>
                    )}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Theme toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        className={`${landing ? "hidden sm:flex" : "flex"} h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6 text-sm text-gray-400 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary`}
                    >
                        {theme === "dark" ? "☀" : "☾"}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/messages"
                                aria-label="Messages"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6 text-gray-400 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                            >
                                <span aria-hidden="true">💬</span>
                            </Link>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsNotificationsOpen((open) => !open)}
                                    aria-label="Notifications"
                                    aria-expanded={isNotificationsOpen}
                                    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6 text-gray-400 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                                >
                                    <span aria-hidden="true">🔔</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-[#07130c]">
                                            {unreadCount > 9 ? "9+" : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {isNotificationsOpen && (
                                    <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-2xl">
                                        <div className="flex items-center justify-between border-b border-border px-4 py-3">
                                            <p className="font-display text-sm font-bold text-text-main">Notifications</p>
                                            <Link
                                                to="/notifications"
                                                onClick={() => setIsNotificationsOpen(false)}
                                                className="text-xs font-semibold text-primary hover:text-primary-hover"
                                            >
                                                View all
                                            </Link>
                                        </div>
                                        {notifications.length === 0 ? (
                                            <p className="px-4 py-7 text-center text-xs text-text-muted">
                                                You&apos;re all caught up.
                                            </p>
                                        ) : (
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.slice(0, 5).map((notification) => (
                                                    <Link
                                                        key={notification.id}
                                                        to="/notifications"
                                                        onClick={() => {
                                                            markAsRead(notification.id);
                                                            setIsNotificationsOpen(false);
                                                        }}
                                                        className={`block border-b border-border px-4 py-3 last:border-0 hover:bg-surface-hover ${
                                                            notification.is_read ? "" : "bg-primary/5"
                                                        }`}
                                                    >
                                                        <div className="flex gap-2">
                                                            {!notification.is_read && (
                                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                            )}
                                                            <p className="text-xs leading-5 text-text-main">
                                                                {notification.message}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* User Menu Dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsUserMenuOpen((open) => !open)}
                                    aria-expanded={isUserMenuOpen}
                                    className="flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10"
                                >
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary ring-1 ring-primary/30">
                                        {user.username?.slice(0, 1).toUpperCase()}
                                    </span>
                                    <span className="hidden text-xs font-semibold text-gray-300 sm:inline">
                                        {user.username}
                                    </span>
                                    <span className="text-[10px] text-gray-400">▼</span>
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-2xl py-1">
                                        <div className="border-b border-border px-4 py-2.5">
                                            <p className="text-xs font-bold text-text-main truncate">{user.username}</p>
                                            <p className="text-[10px] uppercase font-semibold text-primary">{user.role}</p>
                                        </div>

                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-text-main hover:bg-surface-hover hover:text-primary transition-colors"
                                        >
                                            📊 Dashboard
                                        </Link>

                                        <Link
                                            to="/profile"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-text-main hover:bg-surface-hover hover:text-primary transition-colors"
                                        >
                                            👤 My Profile
                                        </Link>

                                        <Link
                                            to="/saved-jobs"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-text-main hover:bg-surface-hover hover:text-primary transition-colors"
                                        >
                                            ♥ Saved Jobs
                                        </Link>

                                        {user.role === "client" ? (
                                            <Link
                                                to="/my-jobs"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-text-main hover:bg-surface-hover hover:text-primary transition-colors"
                                            >
                                                📋 My Jobs
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/my-applications"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-text-main hover:bg-surface-hover hover:text-primary transition-colors"
                                            >
                                                📄 My Applications
                                            </Link>
                                        )}

                                        <div className="border-t border-border mt-1 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    logout();
                                                }}
                                                className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                🚪 Log Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {user.role === "client" && (
                                <Link
                                    to="/jobs/create"
                                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_14px_rgba(0,192,88,0.35)]"
                                >
                                    Post a Job
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-full px-3 py-2 text-sm font-semibold text-gray-300 transition-colors hover:text-white sm:px-4"
                            >
                                {landing ? "Login" : "Log in"}
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-full bg-primary px-3 py-2 text-sm font-semibold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_14px_rgba(0,192,88,0.35)] sm:px-5"
                            >
                                {landing ? "Register" : "Get Started"}
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
