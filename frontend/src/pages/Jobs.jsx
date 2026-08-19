import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
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

        <div className="min-h-screen bg-background text-text-muted p-4">
            <div className="flex my-6 mx-12 p-4 rounded-lg bg-surface max-w-fit px-20">
                <div>
                {authLoading ? (
                    <p>Loading...</p>
                ) : user ? (<p className="text-text-main text-3xl font-semibold">Congratulations,{user.username}! You are now part of our community!</p>)
                : (<p>Please <Link to="/login">login</Link> to access more features.</p>)
                }

                <h1 className="text-primary mt-5">Tips to get Started</h1>
                <div className="flex gap-2 mt-5">
                    <img className="w-4 h-4" src="/public/check.png" alt="check" />
                    <p className="text-text-muted">Complete your profile to increase your visibility to potential clients.</p>
                </div>
                <div className="flex gap-2 mt-5">
                    <img className="w-4 h-4" src="/public/check.png" alt="check" />
                    <p className="text-text-muted">Submit a strong portfolio to showcase your skills and experience.</p>
                </div>
               
                {
                    user?.role === "client" && (
                        <Link to="/jobs/create">
                            Post a Job
                        </Link>
                    )
                }
                <div className="mt-5 ">
                    <input
                    className="w-[500px] p-4 rounded-l-md border border-border border-r-0 bg-surface text-text-muted"
                     type="text" 
                     placeholder="Search jobs..." />
                    <button className="px-10 py-4 bg-primary text-text-main font-semibold border border-border border-l-0 rounded-r-md">Search</button>
                    <button className="ml-5 px-10 py-4 text-primary-hover border border-primary-hover rounded-lg">Create Job</button>
                </div>
                </div>
                <div>
                    <img
                    className="ml-10 w-75 h-75 rounded-full object-cover"
                     src="/public/Freelancer.gif" 
                     alt="User Avatar" />
                </div>
            </div>
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
                            {user?.username === job.client && (
                                <Link to={`/jobs/${job.id}/edit`}>
                                    Edit Job
                                </Link>
                            )}
                        </div>
                   

            ))}
            
              

        </div>

      

    );
}

export default Jobs;