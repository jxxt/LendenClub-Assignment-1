import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home({ user, setUser }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch("http://localhost:8002/verify", {
                    method: "GET",
                    credentials: "include", // Important: sends cookies with request
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setLoading(false);
                } else {
                    // Token is invalid or expired
                    navigate("/login");
                }
            } catch (err) {
                navigate("/login");
            }
        };

        verifyToken();
    }, [navigate, setUser]);

    if (loading) {
        return (
            <div style={styles.container}>
                <p style={styles.subtitle}>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleSignOut = async () => {
        try {
            await fetch("http://localhost:8002/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            // Ignore error, just navigate
        } finally {
            setUser(null);
            navigate("/login");
        }
    };

    return (
        <div style={styles.container}>
            <button onClick={handleSignOut} style={styles.signOutButton}>
                Sign Out
            </button>
            <button
                onClick={() => navigate("/profile")}
                style={styles.profileButton}
            >
                View Profile
            </button>
            <h1 style={styles.title}>Hello {user.name}</h1>
            <p style={styles.subtitle}>Welcome to the application!</p>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        width: "100vw",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        overflow: "hidden",
        boxSizing: "border-box",
        position: "relative",
    },
    signOutButton: {
        position: "absolute",
        top: "20px",
        right: "20px",
        padding: "10px 20px",
        backgroundColor: "#555",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontSize: "14px",
        cursor: "pointer",
    },
    profileButton: {
        position: "absolute",
        top: "20px",
        right: "120px",
        padding: "10px 20px",
        backgroundColor: "#3b82f6",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontSize: "14px",
        cursor: "pointer",
    },
    title: {
        color: "#fff",
        fontSize: "48px",
        marginBottom: "20px",
    },
    subtitle: {
        color: "#888",
        fontSize: "18px",
    },
};

export default Home;
