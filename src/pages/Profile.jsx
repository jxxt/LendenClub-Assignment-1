import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile({ user, setUser }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch("http://localhost:8002/verify", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setLoading(false);
                } else {
                    navigate("/guest");
                }
            } catch (err) {
                navigate("/guest");
            }
        };

        if (!user) {
            verifyToken();
        } else {
            setLoading(false);
        }
    }, [navigate, setUser, user]);

    const handleSignOut = async () => {
        try {
            await fetch("http://localhost:8002/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            // Ignore error
        } finally {
            setUser(null);
            navigate("/guest");
        }
    };

    const handleBackToHome = () => {
        navigate("/");
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <button onClick={handleBackToHome} style={styles.backButton}>
                    ← Back to Home
                </button>
                <button onClick={handleSignOut} style={styles.signOutButton}>
                    Sign Out
                </button>
            </div>

            {/* Profile Card */}
            <div style={styles.profileCard}>
                {/* Avatar Section */}
                <div style={styles.avatarSection}>
                    <div style={styles.avatar}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h1 style={styles.userName}>{user.name}</h1>
                    <p style={styles.userEmail}>{user.email}</p>
                </div>

                {/* Divider */}
                <div style={styles.divider}></div>

                {/* User Details Section */}
                <div style={styles.detailsSection}>
                    <h2 style={styles.sectionTitle}>Profile Information</h2>

                    <div style={styles.detailRow}>
                        <div style={styles.detailLabel}>
                            <span style={styles.icon}>👤</span>
                            Full Name
                        </div>
                        <div style={styles.detailValue}>{user.name}</div>
                    </div>

                    <div style={styles.detailRow}>
                        <div style={styles.detailLabel}>
                            <span style={styles.icon}>✉️</span>
                            Email Address
                        </div>
                        <div style={styles.detailValue}>{user.email}</div>
                    </div>

                    <div style={styles.detailRow}>
                        <div style={styles.detailLabel}>
                            <span style={styles.icon}>🔐</span>
                            Aadhaar Number
                        </div>
                        <div style={styles.detailValue}>
                            {user.aadhaar.replace(
                                /(\d{4})(\d{4})(\d{4})/,
                                "$1 $2 $3"
                            )}
                        </div>
                    </div>

                    <div style={styles.detailRow}>
                        <div style={styles.detailLabel}>
                            <span style={styles.icon}>🆔</span>
                            User ID
                        </div>
                        <div style={styles.detailValue}>{user.auth_id}</div>
                    </div>
                </div>

                {/* Security Badge */}
                <div style={styles.securityBadge}>
                    <span style={styles.securityIcon}>🛡️</span>
                    <div style={styles.securityText}>
                        <div style={styles.securityTitle}>
                            Your data is encrypted
                        </div>
                        <div style={styles.securitySubtitle}>
                            Protected with AES-256 encryption and Argon2
                            password hashing
                        </div>
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
        width: "100%",
        backgroundColor: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "15px",
        paddingBottom: "70px",
        boxSizing: "border-box",
        overflow: "auto",
    },
    header: {
        width: "100%",
        maxWidth: "700px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        padding: "10px 0",
        gap: "10px",
        flexWrap: "wrap",
    },
    backButton: {
        padding: "8px 12px",
        backgroundColor: "transparent",
        color: "#888",
        border: "1px solid #333",
        borderRadius: "8px",
        fontSize: "clamp(11px, 2vw, 13px)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontWeight: "500",
        whiteSpace: "nowrap",
    },
    signOutButton: {
        padding: "8px 12px",
        backgroundColor: "#dc2626",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "clamp(11px, 2vw, 13px)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontWeight: "500",
        whiteSpace: "nowrap",
    },
    profileCard: {
        width: "100%",
        maxWidth: "700px",
        backgroundColor: "#1a1a1a",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
        border: "1px solid #2a2a2a",
    },
    avatarSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "20px",
    },
    avatar: {
        width: "clamp(60px, 15vw, 90px)",
        height: "clamp(60px, 15vw, 90px)",
        borderRadius: "50%",
        backgroundColor: "#3b82f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "clamp(24px, 6vw, 36px)",
        fontWeight: "bold",
        color: "#fff",
        marginBottom: "12px",
        boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
    },
    userName: {
        color: "#fff",
        fontSize: "clamp(20px, 4vw, 26px)",
        fontWeight: "600",
        marginBottom: "6px",
        margin: "0 0 6px 0",
        textAlign: "center",
        wordBreak: "break-word",
    },
    userEmail: {
        color: "#888",
        fontSize: "clamp(12px, 2.2vw, 14px)",
        margin: "0",
        textAlign: "center",
        wordBreak: "break-all",
    },
    divider: {
        width: "100%",
        height: "1px",
        backgroundColor: "#2a2a2a",
        margin: "20px 0",
    },
    detailsSection: {
        marginBottom: "20px",
    },
    sectionTitle: {
        color: "#fff",
        fontSize: "clamp(16px, 3vw, 18px)",
        fontWeight: "600",
        marginBottom: "15px",
        margin: "0 0 15px 0",
    },
    detailRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "12px",
        backgroundColor: "#0f0f0f",
        borderRadius: "10px",
        marginBottom: "10px",
        border: "1px solid #222",
        transition: "all 0.3s ease",
        flexWrap: "wrap",
        gap: "8px",
    },
    detailLabel: {
        color: "#888",
        fontSize: "clamp(11px, 2vw, 13px)",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flex: "0 0 auto",
    },
    detailValue: {
        color: "#fff",
        fontSize: "clamp(12px, 2.2vw, 14px)",
        fontWeight: "500",
        textAlign: "right",
        wordBreak: "break-word",
        flex: "1 1 auto",
    },
    icon: {
        fontSize: "clamp(14px, 2.5vw, 16px)",
    },
    securityBadge: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px",
        backgroundColor: "#0f3d0f",
        borderRadius: "10px",
        border: "1px solid #1a5c1a",
    },
    securityIcon: {
        fontSize: "clamp(22px, 4vw, 28px)",
        flexShrink: 0,
    },
    securityText: {
        flex: 1,
    },
    securityTitle: {
        color: "#4ade80",
        fontSize: "clamp(12px, 2.2vw, 14px)",
        fontWeight: "600",
        marginBottom: "3px",
    },
    securitySubtitle: {
        color: "#86efac",
        fontSize: "clamp(11px, 2vw, 12px)",
        lineHeight: "1.4",
    },
    loadingSpinner: {
        width: "50px",
        height: "50px",
        border: "4px solid #333",
        borderTop: "4px solid #3b82f6",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "20px",
    },
    loadingText: {
        color: "#888",
        fontSize: "clamp(14px, 2.5vw, 16px)",
    },
    footer: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: "12px",
        textAlign: "center",
        borderTop: "1px solid #333",
        backgroundColor: "#0a0a0a",
    },
    footerText: {
        color: "#666",
        fontSize: "clamp(11px, 2vw, 13px)",
        margin: 0,
    },
};

export default Profile;
