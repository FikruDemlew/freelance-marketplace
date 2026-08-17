import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../context/useAuth";


function EditJob() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { user, loading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Web Development",
        budget: "",
        deadline: "",
        status: "Open",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {

        if (authLoading) {
            return;
        }

        if (!user) {
            navigate("/login");
            return;
        }

        const fetchJob = async () => {

            try {

                const response = await api.get(
                    `/jobs/${id}/`
                );

                console.log("Job fetched:", response.data);

                const job = response.data;

                setFormData({
                    title: job.title,
                    description: job.description,
                    category: job.category,
                    budget: job.budget.toString(),
                    deadline: job.deadline,
                    status: job.status,
                });

            } catch (error) {

                console.error("Fetch error:", error);

                setError(
                    "Unable to load this job."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchJob();

    }, [id, user, authLoading]);


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setSaving(true);
        setError("");

        try {

            const payload = {
                ...formData,
                budget: parseFloat(formData.budget),
            };

            console.log("Sending payload:", payload);

            const response = await api.patch(
                `/jobs/${id}/`,
                payload
            );

            console.log("Update response:", response.data);

            navigate(`/jobs/${id}`);

        } catch (error) {

            console.error("Update error:", error);

            if (error.response?.status === 403) {

                setError(
                    "You don't have permission to edit this job."
                );

            } else {

                setError(
                    error.response?.data?.detail ||
                    JSON.stringify(error.response?.data) ||
                    "Failed to update job."
                );
            }

        } finally {

            setSaving(false);

        }
    };


    if (authLoading) {
        return <p>Loading auth...</p>;
    }

    if (loading) {
        return <p>Loading job...</p>;
    }

    if (error && !formData.title) {
        return <p>Error: {error}</p>;
    }


    return (

        <div>

            <h1>Edit Job</h1>

            {error && (
                <p>
                    {typeof error === "string"
                        ? error
                        : JSON.stringify(error)
                    }
                </p>
            )}


            <form onSubmit={handleSubmit}>

                <div>

                    <label>
                        Job Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                </div>


                <div>

                    <label>
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />

                </div>


                <div>

                    <label>
                        Category
                    </label>

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >

                        <option value="Web Development">
                            Web Development
                        </option>

                        <option value="Mobile Development">
                            Mobile Development
                        </option>

                        <option value="UI/UX Design">
                            UI/UX Design
                        </option>

                        <option value="Graphics Design">
                            Graphics Design
                        </option>

                        <option value="Writing">
                            Writing
                        </option>

                        <option value="Data Science">
                            Data Science
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>

                </div>


                <div>

                    <label>
                        Budget
                    </label>

                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />

                </div>


                <div>

                    <label>
                        Deadline
                    </label>

                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                    />

                </div>


                <div>

                    <label>
                        Status
                    </label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >

                        <option value="Open">
                            Open
                        </option>

                        <option value="Closed">
                            Closed
                        </option>

                    </select>

                </div>


                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : "Save Changes"
                    }
                </button>


                <button
                    type="button"
                    onClick={() => navigate(`/jobs/${id}`)}
                >
                    Cancel
                </button>

            </form>

        </div>
    );
}


export default EditJob;