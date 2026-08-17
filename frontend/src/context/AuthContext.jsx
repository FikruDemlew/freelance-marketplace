import { createContext, useEffect, useState } from "react";

import api from "../api/axios";


const AuthContext = createContext();


export { AuthContext };

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const refreshUser = async () => {

        const token = localStorage.getItem("access_token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {

            const response = await api.get("/auth/me/");

            setUser(response.data);

        } catch (error) {

            console.error("Failed to get current user:", error);

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            setUser(null);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        (async () => {
            await refreshUser();
        })();
    }, []);


    const logout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}