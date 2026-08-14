import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";


function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { fetchCurrentUser } = useAuth();

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

            const data = await loginUser(formData);

            localStorage.setItem(
                "access_token",
                data.access
            );

            localStorage.setItem(
                "refresh_token",
                data.refresh
            );

            await fetchCurrentUser();
            navigate("/jobs");

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Login failed. Please check your credentials."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/public/black5.jpg')] bg-center bg-cover">
            <div className="flex flex-col items-center justify-center text-white p-8 bg-black/40 backdrop-blur-sm shadow-md w-full max-w-md rounded-2xl border border-white/20">
                <h1 className="text-4xl font-extrabold">Login</h1>

                {error && (
                    <p>{error}</p>
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


                    <button
                        className="bg-white hover:bg-white/30 text-black font-bold py-1 px-6 rounded"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>


                <p className="mt-4 text-sm text-white/50">
                    Don't have an account?{" "}

                    <Link className="text-white hover:text-white/70" to="/register">
                        Register
                    </Link>

                </p>

            </div>
        </div>
    );
}


export default Login;