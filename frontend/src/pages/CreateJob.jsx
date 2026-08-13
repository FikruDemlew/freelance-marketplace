import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";


function CreateJob() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Web Development",
        budget: "",
        deadline: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            await api.post(
                "/jobs/",
                formData
            );

            navigate("/jobs");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data ||
                "Failed to create job."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div>

            <h1>Create Job</h1>

            {error && (
                <p>
                    {JSON.stringify(error)}
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


                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Job"
                    }
                </button>

            </form>

        </div>
    );
}


export default CreateJob;