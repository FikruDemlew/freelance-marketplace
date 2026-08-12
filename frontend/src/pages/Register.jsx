import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api/auth";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "client",
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
            await registerUser(formData);

            navigate("/login");

        } catch (error) {
            setError(
                error.response?.data ||
                "Registration failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/public/black5.jpg')] bg-center bg-cover">
            <div className="flex flex-col items-center justify-center text-white p-8 bg-black/40 backdrop-blur-sm shadow-md w-full max-w-md rounded-2xl border border-white/20">
                <h1>Create Account</h1>

                {error && (
                    <p>{JSON.stringify(error)}</p>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="flex flex-col gap-2 my-4">
                        <label>
                            Username
                        </label>

                        <input
                            className=" border border-white/20 rounded-lg p-2"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2 my-4">
                        <label>
                            Email
                        </label>

                        <input
                            className=" border border-white/20 rounded-lg p-2"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2 my-4">
                        <label>
                            Password
                        </label>

                        <input
                            className=" border border-white/20 rounded-lg p-2"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-row gap-2 my-4">
                        <label>
                            Account Type
                        </label>

                        <select
                            className=" border border-white/20 rounded-lg p-2 "
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option className="bg-black/70 text-white hover:bg-red-300" value="client">
                                Client
                            </option>

                            <option className="bg-gray-800 text-white" value="freelancer">
                                Freelancer
                            </option>
                        </select>
                    </div>

                    <button
                        className="bg-white hover:bg-white/30 text-black font-bold py-1 px-6 rounded"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Register"
                        }
                    </button>

                </form>

                <p className="mt-4 text-sm text-white/50">
                    Already have an account?{" "}

                    <Link className="text-white hover:text-white/70" to="/login">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;