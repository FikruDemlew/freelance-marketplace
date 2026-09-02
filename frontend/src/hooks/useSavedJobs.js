import { useEffect, useRef, useState } from "react";
import { getSavedJobs, removeSavedJob, saveJob } from "../services/savedJob";


export function useSavedJobs(user, authLoading) {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pendingJobIds, setPendingJobIds] = useState(() => new Set());
    const pendingJobIdsRef = useRef(new Set());

    useEffect(() => {
        let active = true;

        const fetchSavedJobs = async () => {
            if (authLoading) return;

            if (!user) {
                setSavedJobs([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const data = await getSavedJobs();
                if (active) setSavedJobs(data);
            } catch (requestError) {
                if (active) {
                    setError(
                        requestError.response?.data?.detail ||
                        "Failed to load saved jobs."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchSavedJobs();

        return () => {
            active = false;
        };
    }, [user, authLoading]);

    const toggleSavedJob = async (jobId) => {
        if (!user || pendingJobIdsRef.current.has(jobId)) return;

        const isSaved = savedJobs.some(
            (savedJob) => Number(savedJob.job_id) === Number(jobId)
        );
        const previousSavedJobs = savedJobs;

        pendingJobIdsRef.current.add(jobId);
        setPendingJobIds((current) => new Set(current).add(jobId));
        setError("");

        if (isSaved) {
            setSavedJobs((current) => current.filter(
                (savedJob) => Number(savedJob.job_id) !== Number(jobId)
            ));
        }

        try {
            if (isSaved) {
                await removeSavedJob(jobId);
            } else {
                const savedJob = await saveJob(jobId);
                setSavedJobs((current) => [...current, savedJob]);
            }
        } catch (requestError) {
            setSavedJobs(previousSavedJobs);
            setError(
                requestError.response?.data?.detail ||
                "Failed to update saved jobs."
            );
        } finally {
            pendingJobIdsRef.current.delete(jobId);
            setPendingJobIds((current) => {
                const next = new Set(current);
                next.delete(jobId);
                return next;
            });
        }
    };

    const isJobSaved = (jobId) => savedJobs.some(
        (savedJob) => Number(savedJob.job_id) === Number(jobId)
    );

    const isJobPending = (jobId) => pendingJobIds.has(jobId);

    return {
        savedJobs,
        loading,
        error,
        isJobSaved,
        isJobPending,
        toggleSavedJob,
    };
}
