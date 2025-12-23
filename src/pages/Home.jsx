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
                    navigate("/guest");
                }
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                navigate("/guest");
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
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            // Ignore error, just navigate
        } finally {
            setUser(null);
            navigate("/guest");
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

            <footer style={styles.footer}>
                <p style={styles.footerText}>
                    Developed by <strong>Jeet Debnath</strong> •{" "}
                    {new Date().getFullYear()}
                </p>
            </footer>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#0f0f0f",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        paddingBottom: "80px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "auto",
    },
    signOutButton: {
        position: "absolute",
        top: "15px",
        right: "15px",
        padding: "8px 16px",
        backgroundColor: "#dc2626",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
        zIndex: 10,
    },
    profileButton: {
        position: "absolute",
        top: "15px",
        right: "100px",
        padding: "8px 16px",
        backgroundColor: "transparent",
        color: "#888",
        border: "1px solid #333",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
        zIndex: 10,
    },
    welcomeSection: {
        textAlign: "center",
        marginBottom: "20px",
        padding: "0 10px",
    },
    title: {
        color: "#fff",
        fontSize: "clamp(24px, 5vw, 42px)",
        fontWeight: "700",
        marginBottom: "8px",
        textShadow: "0 4px 20px rgba(59, 130, 246, 0.5)",
        wordBreak: "break-word",
    },
    subtitle: {
        color: "#888",
        fontSize: "clamp(14px, 2.5vw, 16px)",
        fontWeight: "400",
    },
    featuresContainer: {
        backgroundColor: "#1a1a1a",
        borderRadius: "16px",
        padding: "20px",
        maxWidth: "700px",
        width: "100%",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
        border: "1px solid #2a2a2a",
    },
    featuresTitle: {
        color: "#3b82f6",
        fontSize: "clamp(16px, 3vw, 22px)",
        fontWeight: "700",
        marginBottom: "20px",
        textAlign: "center",
        lineHeight: "1.4",
        wordBreak: "break-word",
    },
    featuresList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    featureItem: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#ddd",
        fontSize: "clamp(13px, 2.2vw, 15px)",
        padding: "10px",
        backgroundColor: "#0f0f0f",
        borderRadius: "10px",
        transition: "all 0.3s ease",
        border: "1px solid #222",
    },
    emoji: {
        fontSize: "clamp(18px, 3vw, 22px)",
        minWidth: "22px",
    },
    footer: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: "12px",
        textAlign: "center",
        borderTop: "1px solid #333",
        backgroundColor: "#0f0f0f",
    },
    footerText: {
        color: "#666",
        fontSize: "clamp(11px, 2vw, 13px)",
        margin: 0,
    },
};

export default Home;
