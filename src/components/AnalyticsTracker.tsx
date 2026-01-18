"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const initialized = useRef(false);

    useEffect(() => {
        // Function to track visit
        const trackVisit = async () => {
            try {
                // Get IP data from a free service (or rely on backend if implemented there)
                // For this implementation, we'll try to get what we can from client
                // Note: Real IP detection usually happens on the server (API route)
                // but we need to gather client-side info here.

                const response = await fetch("https://api.ipify.org?format=json");
                const { ip } = await response.json();

                // Get more details from ipstack if possible, or just send what we have
                // Ideally, the backend should handle IP geolocation to hide API keys
                // But following the existing pattern in the page.tsx, we'll do basic info here
                // AND/OR let the API route enhance it.

                // Actually, the best way is to send the visit to our own API
                // and let the API figure out the IP from the request headers.
                // However, detailed location data usually requires an external service.

                // Let's send a request to our API
                await fetch("/api/analytics", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ip: ip, // The API might overwrite this with request IP
                        path: pathname,
                        title: document.title,
                        referrer: document.referrer,
                        userAgent: navigator.userAgent,
                        screenResolution: `${window.screen.width}x${window.screen.height}`,
                        device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
                        browser: getBrowserName(),
                        os: getOSName(),
                    }),
                });

            } catch (error) {
                console.error("Failed to track visit:", error);
            }
        };

        // Track on mount and when pathname changes
        // Use a small timeout to ensure document.title is updated
        const timeoutId = setTimeout(() => {
            trackVisit();
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
}

// Helpers
function getBrowserName() {
    const agent = navigator.userAgent.toLowerCase();
    if (agent.includes("chrome")) return "Chrome";
    if (agent.includes("firefox")) return "Firefox";
    if (agent.includes("safari")) return "Safari";
    if (agent.includes("edge")) return "Edge";
    return "Unknown";
}

function getOSName() {
    const agent = navigator.userAgent.toLowerCase();
    if (agent.includes("win")) return "Windows";
    if (agent.includes("mac")) return "MacOS";
    if (agent.includes("linux")) return "Linux";
    if (agent.includes("android")) return "Android";
    if (agent.includes("iphone") || agent.includes("ipad")) return "iOS";
    return "Unknown";
}
