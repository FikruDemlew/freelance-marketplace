import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function JobDetails() {

    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {

        const fetchJob = async () => {

            try {

                const response = await api.get(`/jobs/${id}/`);

                setJob(response.data);

            } catch (error) {

                setError("Failed to load job.");

            } finally {

                setLoading(false);
            }
        };

        fetchJob();

    }, [id]);


    if (loading) {
        return <p>Loading...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    return (
        <div>

            <Link to="/jobs">
                ← Back to Jobs
            </Link>

            <h1>{job.title}</h1>

            <p>{job.description}</p>

            <p>
                Category: {job.category}
            </p>

            <p>
                Budget: ${job.budget}
            </p>

            <p>
                Deadline: {job.deadline}
            </p>

            <p>
                Status: {job.status}
            </p>

            <p>
                Posted by: {job.client}
            </p>

        </div>
    );
}

export default JobDetails;