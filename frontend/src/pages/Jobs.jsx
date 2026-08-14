import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user, loading: authLoading } = useAuth();

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
        console.log("User in Jobs component:", user);
    }, []);


    if (loading) {
        return <p>Loading jobs...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    return (

        <div>
            {authLoading ? (
                <p>Loading...</p>
            ) : user ? (<p>Welcome, {user.username} ({user.role})</p>)
            : (<p>Please <Link to="/login">login</Link> to access more features.</p>)
        }

            <h1>Available Jobs</h1>
            {
                user?.role === "client" && (
                    <Link to="/jobs/create">
                        Post a Job
                    </Link>
                )
            }
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