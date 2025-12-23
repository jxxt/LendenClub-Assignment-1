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
            <div style={styles.welcomeSection}>
                <h1 style={styles.title}>👋 Hello, {user.name}!</h1>
                <p style={styles.subtitle}>Welcome to your secure dashboard</p>
            </div>

            <div style={styles.featuresContainer}>
                <h2 style={styles.featuresTitle}>
                    Features Implemented for Assignment 1 of Lenden Club
                </h2>
                <div style={styles.featuresList}>
                    <div style={styles.featureItem}>
                        <span style={styles.emoji}>🔐</span>
                        <span>User Authentication with JWT tokens</span>
                    </div>
                    <div style={styles.featureItem}>
                        <span style={styles.emoji}>🛡️</span>
                        <span>Secure password encryption</span>
                    </div>
                    <div style={styles.featureItem}>
                        <span style={styles.emoji}>🍪</span>
                        <span>Session management with HTTPS-only cookies</span>
                    </div>
                    <div style={styles.featureItem}>
                        <span style={styles.emoji}>👤</span>
                        <span>User profile management</span>
                    </div>
                    <div style={styles.featureItem}>
                        <span style={styles.emoji}>🔥</span>
                        <span>Firebase integration for data storage</span>
                    </div>
                    <div style={styles.featureItem}>
                        <span style={styles.emoji}>🚀</span>
                        <span>Protected routes and API endpoints</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: "#fff",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "30px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
    },
    profileButton: {
        position: "absolute",
        top: "20px",
        right: "130px",
        padding: "10px 20px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        color: "#667eea",
        border: "none",
        borderRadius: "30px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease",
    },
    welcomeSection: {
        textAlign: "center",
        marginBottom: "25px",
    },
    title: {
        color: "#fff",
        fontSize: "42px",
        fontWeight: "700",
        marginBottom: "8px",
        textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    },
    subtitle: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: "16px",
        fontWeight: "300",
    },
    featuresContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "25px 35px",
        maxWidth: "700px",
        width: "100%",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
    },
    featuresTitle: {
        color: "#667eea",
        fontSize: "22px",
        fontWeight: "700",
        marginBottom: "20px",
        textAlign: "center",
        whiteSpace: "nowrap",
    },
    featuresList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    featureItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: "#333",
        fontSize: "15px",
        padding: "10px 15px",
        backgroundColor: "rgba(102, 126, 234, 0.05)",
        borderRadius: "10px",
        transition: "all 0.3s ease",
        border: "2px solid transparent",
    },
    emoji: {
        fontSize: "22px",
        minWidth: "22px",
    },
};

export default Home;
