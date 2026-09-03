import { Link } from "react-router-dom";


const categoryColors = {
    "Web Development": "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
    "Mobile Development": "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20",
    "UI/UX Design": "bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/20",
    "Graphics Design": "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20",
    "Writing": "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
    "Data Science": "bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20",
    "Data & Analytics": "bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20",
    Other: "bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/20",
};
const defaultCategoryColor = "bg-primary/10 text-primary ring-1 ring-primary/20";

const statusBadgeClass = (status) => ({
    Open: "badge-open",
    Closed: "badge-closed",
    "In Progress": "badge-in-progress",
    Completed: "badge-completed",
}[status] ?? "badge-open");

function JobCard({ job, user, isSaved, isPending, onToggleSaved }) {
    return (
        <article className="group relative overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_4px_24px_rgba(0,192,88,0.08)]">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/6 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="grid lg:grid-cols-[1fr_220px]">
                <div className="p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[job.category] ?? defaultCategoryColor}`}>
                            {job.category}
                        </span>

                        <div className="flex items-center gap-2">
                            <span className={`inline-flex h-6 items-center rounded-full px-3 text-[10px] font-bold uppercase tracking-wide ${statusBadgeClass(job.status)}`}>
                                {job.status}
                            </span>
                            {user && (
                                <button
                                    type="button"
                                    onClick={() => onToggleSaved(job.id)}
                                    disabled={isPending}
                                    aria-label={isSaved ? "Remove saved job" : "Save job"}
                                    aria-pressed={isSaved}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${isSaved ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-text-muted hover:border-primary/40 hover:text-primary"}`}
                                >
                                    {isSaved ? "♥" : "♡"}
                                </button>
                            )}
                        </div>
                    </div>

                    <h3 className="job-card-title mt-4 text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                        {job.title}
                    </h3>
                    <p className="job-card-copy mt-2.5 line-clamp-2 text-sm leading-6">
                        {job.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                            <span className="text-primary">💰</span>
                            <span className="font-semibold text-text-main">${job.budget}</span>
                            budget
                        </span>
                        <span className="h-3 w-px bg-border" />
                        <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                            <span>📅</span>
                            Due <span className="font-medium text-text-main">{job.deadline}</span>
                        </span>
                    </div>
                </div>

                <div className="flex flex-col justify-between border-t border-border bg-background/35 p-5 sm:p-6 lg:border-l lg:border-t-0">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Budget</p>
                        <p className="mt-1.5 font-display text-3xl font-bold text-text-main">${job.budget}</p>
                        <p className="mt-0.5 text-xs text-text-muted">Fixed price</p>
                    </div>
                    <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Deadline</p>
                        <p className="mt-1 text-sm font-semibold text-text-main">{job.deadline}</p>
                    </div>
                    <Link
                        to={`/jobs/${job.id}`}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.3)]"
                    >
                        View Job
                        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default JobCard;
