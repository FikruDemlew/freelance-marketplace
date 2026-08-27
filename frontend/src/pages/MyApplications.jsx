import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getApplications, deleteApplication } from "../services/application";
import { useAuth } from "../context/useAuth";
import ApplyModal from "../components/ApplyModal";


function MyApplications() {

    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedApplication, setSelectedApplication] =useState(null);

    const handleApplicationUpdated = async () => {
    const data = await getApplications();
    setApplications(data);
    };

    const handleDeleteApplication = async (applicationId) => {
        const confirmed =window.confirm("Are you sure you want to delete this application>");

        if (!confirmed) {
            return;
        }

        try {
            await deleteApplication(applicationId);
            setApplications((currentApplications) => currentApplications.filter(
                (application) => application.id !== applicationId
            ))
        } catch(error) {
            console.error(error);
            setError(error.response?.data || "Failed to delete application.");
        }
    }

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getApplications();

                const myApplications = data.filter(
                    (application)=>
                        Number(application.freelancer_id) === Number(user.id)
                );
                setApplications(myApplications);
                
            } catch (error) {
                console.error(error);
                setError("Failed to load your applications.");
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchApplications();
        }

    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="mx-auto max-w-[1100px] px-6 py-20 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading applications...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-[1100px] px-6 py-12 lg:px-10">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-950">
                        My Applications
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Track the jobs you have applied for.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {applications.length === 0 ? (
                    <div className="rounded-[28px] border border-gray-200 bg-white p-12 text-center shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900">
                            No applications yet
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Find a job and submit your first application.
                        </p>

                        <Link
                            to="/jobs"
                            className="mt-6 inline-flex rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {applications.map((application) => (
                            <div
                                key={application.id}
                                className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex flex-col justify-between gap-5 sm:flex-row">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-950">
                                            {application.job_title}
                                        </h2>

                                        <p className="mt-2 text-sm text-gray-500">
                                            Applied on{" "}
                                            {new Date(
                                                application.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <span className="h-fit rounded-full bg-yellow-50 px-4 py-2 text-xs font-semibold text-yellow-700">
                                        {application.status}
                                    </span>
                                </div>

                                <div className="mt-6 grid gap-5 border-t border-gray-100 pt-5 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Your Bid
                                        </p>

                                        <p className="mt-2 text-lg font-bold text-gray-950">
                                            ${application.bid_amount}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Proposal
                                        </p>

                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                                            {application.proposal}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3 border-t border-gray-100 pt-5">
                                    <Link
                                        to={`/jobs/${application.job}`}
                                        className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                                    >
                                        View Job
                                    </Link>

                                    <button
                                        onClick={() => setSelectedApplication(application)}
                                        className="rounded-xl bg-yellow-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-yellow-700"
                                    >
                                        Edit Application
                                    </button>

                                    <button
                                    onClick={()=> handleDeleteApplication(application.id)}
                                    className="rounded-xl bg-red-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-red-700"
                                    >
                                    Delete Application
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
    {selectedApplication && (
    <ApplyModal
        jobId={selectedApplication.job}
        jobTitle={selectedApplication.job_title}
        existingApplication={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onSuccess={handleApplicationUpdated}
    />
)}
        </div>
    );
}

export default MyApplications;