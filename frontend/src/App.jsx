import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import Landing from "./pages/Landing";
import MyApplications from "./pages/MyApplications";
import Messages from "./pages/Messages";
import MyJobs from "./pages/MyJobs";
import Notifications from "./pages/Notifications";
import MyProfile from "./pages/MyProfile";
import PublicProfile from "./pages/PublicProfile";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <Routes>

            <Route
                path="/"
                element={<Landing />}
            />

            <Route
                path="/jobs"
                element={<Jobs />}
            />

            <Route
                path="/jobs/:id"
                element={<JobDetails />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/jobs/create"
                element={
                    <ProtectedRoute allowedRole="client">
                        <CreateJob />
                    </ProtectedRoute>
                }
            />



            <Route
                path="/jobs/:id/edit"
                element={
                    <ProtectedRoute allowedRole="client">
                        <EditJob />
                    </ProtectedRoute>
               }
            />
            <Route
                path="/my-applications"
                element={
                    <ProtectedRoute allowedRole="freelancer">
                        <MyApplications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/chat/:conversationId"
                element={<Messages />}
            />

            <Route
                path="/messages"
                element={
                    <ProtectedRoute>
                        <Messages />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <Notifications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-jobs"
                element={
                    <ProtectedRoute allowedRole="client">
                        <MyJobs />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <MyProfile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile/:userId"
                element={<PublicProfile />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
