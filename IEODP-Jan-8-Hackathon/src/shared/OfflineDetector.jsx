// src/components/OfflineDetector.jsx
import { useEffect, useState } from "react";

const OfflineDetector = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div
            data-testid="offline-banner"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                padding: "12px",
                background: "#d32f2f",
                color: "#fff",
                textAlign: "center",
                zIndex: 9999,
                fontWeight: "bold",
            }}
        >
            ⚠️ You are offline. Please check your internet connection.
        </div>
    );
};

export default OfflineDetector;
