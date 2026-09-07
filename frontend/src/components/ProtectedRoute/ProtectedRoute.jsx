import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../firebase";

const auth = getAuth(app);

function ProtectedRoute({ children, allowedRole }) {
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebaseUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Wait until Firebase finishes restoring the login session
    if (loading) {
        return <div>Loading...</div>;
    }

    // Not logged in
    if (!firebaseUser) {
        return <Navigate to="/" replace />;
    }

    // Get PostgreSQL user information stored during login
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    // No local user information
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Logged in but trying to access another role's page
    if (allowedRole && user.role !== allowedRole) {
        if (user.role === "teacher") {
            return <Navigate to="/teacher/dashboard" replace />;
        }

        if (user.role === "student") {
            return <Navigate to="/student/dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }
    console.log("PROTECTED ROUTE:", {
        firebaseUser: firebaseUser?.uid,
        localUser: localStorage.getItem("user"),
    });

    return children;
}

export default ProtectedRoute;