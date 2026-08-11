import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchJobs = async () => {

            try {

                const response = await api.get("/jobs/");

                setJobs(response.data);

            } catch (error) {

                setError("Failed to load jobs.");

            } finally {

                setLoading(false);

            }

        };

        fetchJobs();

    }, []);


    if (loading) {
        return <p>Loading jobs...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    return (

        <div>

            <h1>Available Jobs</h1>

            {jobs.map((job) => (

                <div key={job.id}>

                    <h2>{job.title}</h2>

                    <p>{job.description}</p>

                    <p>{job.category}</p>

                    <p>${job.budget}</p>

                    <p>
                        Deadline: {job.deadline}
                    </p>

                    <Link to={`/jobs/${job.id}`}>
                        View Details
                    </Link>

                </div>

            ))}

        </div>

    );
}

export default Jobs;