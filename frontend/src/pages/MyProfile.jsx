import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import { getMyProfile, updateMyProfile } from "../services/profile";
import { getFreelancerReviews } from "../services/review";

function MyProfile() {
    const { refreshUser } = useAuth();

    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        bio: "",
        location: "",
        // Freelancer fields
        hourly_rate: "",
        skillsInput: "",
        experience: "",
        portfolio_url: "",
        github_url: "",
        linkedin_url: "",
        // Client fields
        company_name: "",
        website: "",
    });
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchProfileData = async () => {
        setLoading(true);
        setError("");
        try {
            const profileData = await getMyProfile();
            setProfile(profileData);
            populateFormData(profileData);

            if (profileData.role === "freelancer" && profileData.user_id) {
                try {
                    const reviewData = await getFreelancerReviews(profileData.user_id);
                    setReviews(reviewData);
                } catch (err) {
                    console.error("Failed to load freelancer reviews:", err);
                }
            }
        } catch (err) {
            console.error("Failed to load profile:", err);
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Failed to load profile details."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const populateFormData = (data) => {
        setFormData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            phone: data.phone || "",
            bio: data.bio || "",
            location: data.location || "",
            hourly_rate: data.hourly_rate ?? "",
            skillsInput: Array.isArray(data.skills) ? data.skills.join(", ") : "",
            experience: data.experience || "",
            portfolio_url: data.portfolio_url || "",
            github_url: data.github_url || "",
            linkedin_url: data.linkedin_url || "",
            company_name: data.company_name || "",
            website: data.website || "",
        });
        setImagePreview(data.profile_image || null);
        setSelectedImageFile(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setError("");
        if (profile) {
            populateFormData(profile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            let payload;

            if (selectedImageFile) {
                payload = new FormData();
                payload.append("first_name", formData.first_name);
                payload.append("last_name", formData.last_name);
                payload.append("email", formData.email);
                payload.append("phone", formData.phone);
                payload.append("bio", formData.bio);
                payload.append("location", formData.location);
                payload.append("profile_image", selectedImageFile);

                if (profile.role === "freelancer") {
                    const skillsArray = formData.skillsInput
                        ? formData.skillsInput.split(",").map((s) => s.trim()).filter(Boolean)
                        : [];
                    skillsArray.forEach((skill) => payload.append("skills", skill));
                    payload.append("experience", formData.experience);
                    payload.append("hourly_rate", formData.hourly_rate !== "" ? formData.hourly_rate : "");
                    payload.append("portfolio_url", formData.portfolio_url);
                    payload.append("github_url", formData.github_url);
                    payload.append("linkedin_url", formData.linkedin_url);
                } else if (profile.role === "client") {
                    payload.append("company_name", formData.company_name);
                    payload.append("website", formData.website);
                }
            } else {
                payload = {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    phone: formData.phone,
                    bio: formData.bio,
                    location: formData.location,
                };

                if (profile.role === "freelancer") {
                    payload.skills = formData.skillsInput
                        ? formData.skillsInput.split(",").map((s) => s.trim()).filter(Boolean)
                        : [];
                    payload.experience = formData.experience;
                    payload.hourly_rate = formData.hourly_rate !== "" ? formData.hourly_rate : null;
                    payload.portfolio_url = formData.portfolio_url;
                    payload.github_url = formData.github_url;
                    payload.linkedin_url = formData.linkedin_url;
                } else if (profile.role === "client") {
                    payload.company_name = formData.company_name;
                    payload.website = formData.website;
                }
            }

            const updatedProfile = await updateMyProfile(payload);
            setProfile(updatedProfile);
            populateFormData(updatedProfile);
            setIsEditing(false);
            setSuccess("Profile updated successfully!");
            await refreshUser();
        } catch (err) {
            console.error("Failed to update profile:", err);
            const errData = err.response?.data;
            if (errData && typeof errData === "object") {
                const messages = Object.entries(errData)
                    .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(" ") : val}`)
                    .join(" | ");
                setError(messages || "Failed to update profile.");
            } else {
                setError(errData?.detail || errData?.message || "Failed to update profile.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                    <div className="spinner" />
                    <p className="text-sm text-text-muted">Loading your profile…</p>
                </div>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="mx-auto max-w-[900px] px-6 py-20">
                    <div className="rounded-3xl border border-red-500/25 bg-red-500/10 p-8 text-center">
                        <h2 className="font-display text-xl font-bold text-red-400">
                            Failed to load profile
                        </h2>
                        <p className="mt-2 text-sm text-red-300">{error}</p>
                        <button
                            type="button"
                            onClick={fetchProfileData}
                            className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isFreelancer = profile?.role === "freelancer";
    const initialLetter = (profile?.display_name || profile?.username || "U").slice(0, 1).toUpperCase();

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
                        <div className="flex items-center gap-3">
                            <Link
                                to={`/profile/${profile.user_id}`}
                                className="rounded-xl border border-border bg-surface-hover px-5 py-2.5 text-sm font-semibold text-text-main transition-all duration-200 hover:border-primary/30 hover:text-primary"
                            >
                                View Public Profile
                            </Link>

                            {!isEditing && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.3)]"
                                >
                                    ✏️ Edit Profile
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </section>

            {/* Notification Banners */}
            <div className="mx-auto max-w-[1200px] px-6 pt-6 lg:px-10">
                {error && (
                    <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-400">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 rounded-xl border border-primary/25 bg-primary/10 p-4 text-sm font-medium text-primary">
                        {success}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <main className="mx-auto max-w-[1200px] px-6 py-8 lg:px-10">

                {isEditing ? (
                    /* EDIT FORM */
                    <form onSubmit={handleSubmit} className="space-y-8">

                        <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9">
                            <div className="flex items-center justify-between border-b border-border pb-5">
                                <div>
                                    <h2 className="font-display text-xl font-bold text-text-main">
                                        Edit Personal Details
                                    </h2>
                                    <p className="mt-1 text-xs text-text-muted">
                                        Update your personal profile information.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text-muted hover:text-text-main"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-[#07130c] hover:bg-primary-hover disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                
                                {/* Profile Image Upload */}
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Profile Picture
                                    </label>
                                    <div className="flex items-center gap-4">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-16 w-16 rounded-xl object-cover ring-1 ring-border"
                                            />
                                        ) : (
                                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-hover text-xl font-bold text-text-muted">
                                                📷
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="text-xs text-text-muted file:mr-3 file:rounded-xl file:border-0 file:bg-surface-hover file:px-4 file:py-2 file:text-xs file:font-semibold file:text-text-main hover:file:bg-primary/20 hover:file:text-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. John"
                                        className="field"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Doe"
                                        className="field"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                        className="field"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+1 234 567 8900"
                                        className="field"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="e.g. New York, USA"
                                        className="field"
                                    />
                                </div>

                                {/* Role Specific Fields */}
                                {isFreelancer ? (
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                            Hourly Rate ($/hr)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="hourly_rate"
                                            value={formData.hourly_rate}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 45.00"
                                            className="field"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            name="company_name"
                                            value={formData.company_name}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Acme Corp"
                                            className="field"
                                        />
                                    </div>
                                )}

                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Bio / About
                                    </label>
                                    <textarea
                                        rows={4}
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Tell us about yourself or your company..."
                                        className="field"
                                    />
                                </div>

                            </div>
                        </div>

                        {/* FREELANCER SPECIFIC EDIT SECTION */}
                        {isFreelancer && (
                            <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9 space-y-6">
                                <div>
                                    <h2 className="font-display text-xl font-bold text-text-main">
                                        Freelancer Portfolio & Skills
                                    </h2>
                                    <p className="mt-1 text-xs text-text-muted">
                                        Share your skills and online profiles.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                            Skills (comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            name="skillsInput"
                                            value={formData.skillsInput}
                                            onChange={handleInputChange}
                                            placeholder="React, Node.js, Python, PostgreSQL"
                                            className="field"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                            Work Experience Summary
                                        </label>
                                        <textarea
                                            rows={4}
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleInputChange}
                                            placeholder="Describe your professional work background, past roles, or key accomplishments..."
                                            className="field"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                            Portfolio URL
                                        </label>
                                        <input
                                            type="url"
                                            name="portfolio_url"
                                            value={formData.portfolio_url}
                                            onChange={handleInputChange}
                                            placeholder="https://myportfolio.com"
                                            className="field"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                            GitHub URL
                                        </label>
                                        <input
                                            type="url"
                                            name="github_url"
                                            value={formData.github_url}
                                            onChange={handleInputChange}
                                            placeholder="https://github.com/username"
                                            className="field"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                            LinkedIn URL
                                        </label>
                                        <input
                                            type="url"
                                            name="linkedin_url"
                                            value={formData.linkedin_url}
                                            onChange={handleInputChange}
                                            placeholder="https://linkedin.com/in/username"
                                            className="field"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CLIENT SPECIFIC EDIT SECTION */}
                        {!isFreelancer && (
                            <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9 space-y-6">
                                <div>
                                    <h2 className="font-display text-xl font-bold text-text-main">
                                        Company Information
                                    </h2>
                                    <p className="mt-1 text-xs text-text-muted">
                                        Add details about your organization.
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Company Website URL
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com"
                                        className="field"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Form Submit Footer */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-text-muted transition-all hover:text-text-main"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-[#07130c] transition-all hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.35)] disabled:opacity-60"
                            >
                                {saving ? "Saving Changes..." : "Save Profile"}
                            </button>
                        </div>

                    </form>
                ) : (
                    /* VIEW MODE */
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                        {/* LEFT COLUMN — Main Info */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Bio Card */}
                            <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9">
                                <h2 className="font-display text-xl font-bold text-text-main">
                                    About Me
                                </h2>
                                <div className="mt-4 border-t border-border pt-4">
                                    <p className="whitespace-pre-line text-sm leading-7 text-text-muted">
                                        {profile.bio || "No bio provided yet."}
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
                                                <p className="text-xs text-text-muted">No skills listed yet.</p>
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
                                                {profile.experience || "No work experience details provided yet."}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Client specific: Company details */}
                            {!isFreelancer && (
                                <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9">
                                    <h2 className="font-display text-xl font-bold text-text-main">
                                        Company Details
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
                                            <p className="text-xs text-text-muted">No reviews received yet.</p>
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

                        {/* RIGHT COLUMN — Sidebar Stats & Contact Info */}
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

                            {/* Private Contact Card */}
                            <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm">
                                <h2 className="font-display text-lg font-bold text-text-main">
                                    Private Contact Info
                                </h2>
                                <p className="mt-1 text-xs text-text-muted">
                                    (Only visible to you)
                                </p>

                                <div className="mt-5 space-y-4 border-t border-border pt-5 text-xs">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">
                                            Email
                                        </p>
                                        <p className="mt-1 font-semibold text-text-main">
                                            {profile.email || "Not specified"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">
                                            Phone
                                        </p>
                                        <p className="mt-1 font-semibold text-text-main">
                                            {profile.phone || "Not specified"}
                                        </p>
                                    </div>
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
                                            <p className="text-xs text-text-muted">No external links added.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                        </aside>

                    </div>
                )}

            </main>
        </div>
    );
}

export default MyProfile;
