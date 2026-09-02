import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import { getPublicProfile } from "../services/profile";
import { getFreelancerReviews } from "../services/review";

function PublicProfile() {
    const { userId } = useParams();
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await getPublicProfile(userId);
                setProfile(data);

                if (data.role === "freelancer" && data.user_id) {
                    try {
                        const revs = await getFreelancerReviews(data.user_id);
                        setReviews(revs);
                    } catch (revErr) {
                        console.error("Failed to load freelancer reviews:", revErr);
                    }
                }
            } catch (err) {
                console.error("Failed to load public profile:", err);
                setError(
                    err.response?.data?.detail ||
                    err.response?.data?.message ||
                    "Failed to load user profile."
                );
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfile();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                    <div className="spinner" />
                    <p className="text-sm text-text-muted">Loading profile…</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="mx-auto max-w-[900px] px-6 py-20">
                    <div className="rounded-3xl border border-red-500/25 bg-red-500/10 p-8 text-center">
                        <h2 className="font-display text-xl font-bold text-red-400">
                            Profile Not Found
                        </h2>
                        <p className="mt-2 text-sm text-red-300">
                            {error || "Unable to find the requested user profile."}
                        </p>
                        <Link
                            to="/jobs"
                            className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover"
                        >
                            Back to Jobs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isOwnProfile = user && Number(user.id) === Number(profile.user_id);
    const isFreelancer = profile.role === "freelancer";
    const initialLetter = (profile.display_name || profile.username || "U").slice(0, 1).toUpperCase();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Header Banner */}
            <section className="relative overflow-hidden border-b border-border bg-ink text-white">
                <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent" />
                <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-10 lg:py-12">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        
                        {/* Avatar & User Details */}
                        <div className="flex items-center gap-5">
                            {profile.profile_image ? (
                                <img
                                    src={profile.profile_image}
                                    alt={profile.display_name}
                                    className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary/40 shadow-lg sm:h-24 sm:w-24"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 text-3xl font-extrabold text-primary ring-2 ring-primary/40 shadow-lg sm:h-24 sm:w-24">
                                    {initialLetter}
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                        {profile.display_name}
                                    </h1>
                                    <span className="rounded-full bg-primary/15 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary border border-primary/30">
                                        {profile.role}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-text-muted">@{profile.username}</p>
                                {profile.location && (
                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                                        <span>📍</span> {profile.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        {isOwnProfile && (
                            <Link
                                to="/profile"
                                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.3)]"
                            >
                                ✏️ Edit My Profile
                            </Link>
                        )}

                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="mx-auto max-w-[1200px] px-6 py-10 lg:px-10">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* LEFT COLUMN — Main Info */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Bio Card */}
                        <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9">
                            <h2 className="font-display text-xl font-bold text-text-main">
                                About
                            </h2>
                            <div className="mt-4 border-t border-border pt-4">
                                <p className="whitespace-pre-line text-sm leading-7 text-text-muted">
                                    {profile.bio || "No description provided."}
                                </p>
                            </div>
                        </div>

                        {/* Freelancer specific: Skills & Experience */}
                        {isFreelancer && (
                            <>
                                {/* Skills Card */}
                                <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9">
                                    <h2 className="font-display text-xl font-bold text-text-main">
                                        Skills & Expertise
                                    </h2>
                                    <div className="mt-4 border-t border-border pt-4">
                                        {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {profile.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-text-muted">No skills listed.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Experience Card */}
                                <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9">
                                    <h2 className="font-display text-xl font-bold text-text-main">
                                        Work Experience
                                    </h2>
                                    <div className="mt-4 border-t border-border pt-4">
                                        <p className="whitespace-pre-line text-sm leading-7 text-text-muted">
                                            {profile.experience || "No work experience listed."}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Client specific: Company details */}
                        {!isFreelancer && (
                            <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9">
                                <h2 className="font-display text-xl font-bold text-text-main">
                                    Company Information
                                </h2>
                                <div className="mt-4 space-y-4 border-t border-border pt-4 text-sm">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">
                                            Company Name
                                        </p>
                                        <p className="mt-1 font-semibold text-text-main">
                                            {profile.company_name || "Not specified"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">
                                            Website
                                        </p>
                                        {profile.website ? (
                                            <a
                                                href={profile.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                                            >
                                                {profile.website} ↗
                                            </a>
                                        ) : (
                                            <p className="mt-1 text-text-muted">Not specified</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reviews Received (Freelancers) */}
                        {isFreelancer && (
                            <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-display text-xl font-bold text-text-main">
                                        Client Reviews ({reviews.length})
                                    </h2>
                                    {profile.rating !== null && profile.rating !== undefined && (
                                        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                                            <span>★</span>
                                            <span>{Number(profile.rating).toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 border-t border-border pt-4">
                                    {reviews.length === 0 ? (
                                        <p className="text-xs text-text-muted">No client reviews yet.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {reviews.map((rev) => (
                                                <div
                                                    key={rev.id}
                                                    className="rounded-2xl border border-border bg-surface-hover p-5"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-bold text-text-main">
                                                                {rev.reviewer}
                                                            </p>
                                                            <p className="text-xs text-text-muted">
                                                                Project: {rev.job_title}
                                                            </p>
                                                        </div>
                                                        <div className="text-xs font-bold text-amber-400">
                                                            {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                                                        </div>
                                                    </div>
                                                    <p className="mt-3 text-xs leading-5 text-text-muted">
                                                        {rev.comment}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT COLUMN — Sidebar Stats & Portfolios */}
                    <aside className="space-y-6">

                        {/* Profile Overview Card */}
                        <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm">
                            <h2 className="font-display text-lg font-bold text-text-main">
                                Profile Overview
                            </h2>

                            <div className="mt-6 border-b border-border pb-5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">
                                    {isFreelancer ? "Hourly Rate" : "Jobs Posted"}
                                </p>
                                <p className="mt-1.5 font-display text-3xl font-bold text-text-main">
                                    {isFreelancer
                                        ? (profile.hourly_rate ? `$${profile.hourly_rate}/hr` : "Not set")
                                        : profile.jobs_posted ?? 0}
                                </p>
                            </div>

                            <div className="border-b border-border py-5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">
                                    Jobs Completed
                                </p>
                                <p className="mt-1.5 text-xl font-bold text-text-main">
                                    {profile.jobs_completed ?? 0}
                                </p>
                            </div>

                            <div className="border-b border-border py-5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">
                                    Overall Rating
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-lg font-bold text-amber-400">
                                        {profile.rating !== null && profile.rating !== undefined
                                            ? `★ ${Number(profile.rating).toFixed(1)}`
                                            : "No ratings yet"}
                                    </span>
                                    <span className="text-xs text-text-muted">
                                        ({profile.reviews_count ?? 0} reviews)
                                    </span>
                                </div>
                            </div>

                            <div className="pt-5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">
                                    Member Since
                                </p>
                                <p className="mt-1 text-xs font-semibold text-text-main">
                                    {profile.created_at
                                        ? new Date(profile.created_at).toLocaleDateString("en-US", {
                                              month: "long",
                                              year: "numeric",
                                          })
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Freelancer Portfolio Links */}
                        {isFreelancer && (
                            <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm">
                                <h2 className="font-display text-lg font-bold text-text-main">
                                    Links & Portfolios
                                </h2>

                                <div className="mt-5 space-y-3 border-t border-border pt-5 text-xs">
                                    {profile.portfolio_url && (
                                        <a
                                            href={profile.portfolio_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 rounded-xl border border-border bg-surface-hover p-3 font-semibold text-text-main hover:border-primary/40 hover:text-primary transition-all"
                                        >
                                            🌐 Portfolio ↗
                                        </a>
                                    )}
                                    {profile.github_url && (
                                        <a
                                            href={profile.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 rounded-xl border border-border bg-surface-hover p-3 font-semibold text-text-main hover:border-primary/40 hover:text-primary transition-all"
                                        >
                                            💻 GitHub ↗
                                        </a>
                                    )}
                                    {profile.linkedin_url && (
                                        <a
                                            href={profile.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 rounded-xl border border-border bg-surface-hover p-3 font-semibold text-text-main hover:border-primary/40 hover:text-primary transition-all"
                                        >
                                            👔 LinkedIn ↗
                                        </a>
                                    )}
                                    {!profile.portfolio_url && !profile.github_url && !profile.linkedin_url && (
                                        <p className="text-xs text-text-muted">No external links provided.</p>
                                    )}
                                </div>
                            </div>
                        )}

                    </aside>

                </div>
            </main>
        </div>
    );
}

export default PublicProfile;
