"use client";

import React, { useState, useMemo } from "react";
import {
    useGetVisitsQuery,
    useDeleteVisitMutation,
    IVisit,
    IPageVisit,
} from "@/app/features/AnalyticsSlice";
import {
    Loader2,
    Trash2,
    Globe,
    Smartphone,
    Monitor,
    Calendar,
    MapPin,
    AlertCircle,
    Info,
    X,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

// Helper type for flattened display
interface FlattenedVisit {
    sessionId: string;
    visitId: string; // Composite ID or index
    ip: string;
    city?: string;
    region?: string;
    country?: string;
    device?: string;
    os?: string;
    browser?: string;
    title?: string;
    path: string;
    visitedAt: string;
    fullSession: IVisit;
}

const AnalyticsPage = () => {
    const { data: sessions, isLoading, isError, refetch } = useGetVisitsQuery();
    const [deleteVisit, { isLoading: isDeleting }] = useDeleteVisitMutation();
    const [selectedSession, setSelectedSession] = useState<IVisit | null>(null);
    const [selectedIpData, setSelectedIpData] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const handleViewDetails = async (session: IVisit) => {
        setSelectedSession(session);
        setIsDetailsOpen(true);
        // Fetch IP details if not already mapped or if we want fresh info
        // For now, fetching every time we open details
        await fetchIpDetails(session.ip);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this session?")) {
            try {
                await deleteVisit(id).unwrap();
                toast.success("Session deleted successfully");
                refetch();
            } catch (error) {
                toast.error("Failed to delete session");
            }
        }
    };

    const fetchIpDetails = async (ip: string) => {
        setIsLoadingDetails(true);
        try {
            const response = await fetch(
                `https://api.ipstack.com/${ip}?access_key=5461e33f759a80d94b2b386ca138a09a`
            );
            const data = await response.json();
            setSelectedIpData(data);
        } catch (error) {
            console.error("Error fetching IP details:", error);
            toast.error("Failed to fetch additional IP details");
            setSelectedIpData(null);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // calculate stats
    const totalSessions = sessions?.length || 0;
    const totalPageViews = sessions?.reduce((acc, curr) => acc + (curr.visits?.length || 0), 0) || 0;
    const uniqueIPs = new Set(sessions?.map((v) => v.ip)).size;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500">
                <AlertCircle className="h-10 w-10 mb-2" />
                <p>Failed to load analytics data.</p>
                <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 space-y-8">
            {/* Header Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Monitor visitor traffic and user journeys
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-w-[140px]">
                        <p className="text-sm text-gray-500 font-medium">Total Sessions</p>
                        <p className="text-2xl font-bold text-indigo-600">
                            {totalSessions}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-w-[140px]">
                        <p className="text-sm text-gray-500 font-medium">Page Views</p>
                        <p className="text-2xl font-bold text-purple-600">{totalPageViews}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-w-[140px]">
                        <p className="text-sm text-gray-500 font-medium">Unique IPs</p>
                        <p className="text-2xl font-bold text-emerald-600">{uniqueIPs}</p>
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Recent Sessions
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[180px]">IP Address</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Journey</TableHead>
                                <TableHead>Device / OS</TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions && sessions.length > 0 ? (
                                sessions.map((session) => (
                                    <TableRow
                                        key={session._id}
                                        className="hover:bg-gray-50/50 cursor-pointer"
                                        onClick={() => handleViewDetails(session)}
                                    >
                                        <TableCell className="font-medium text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <Monitor className="h-4 w-4 text-gray-400" />
                                                {session.ip}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 font-medium">
                                                    {session.city || "Unknown City"}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {session.region || ""} {session.country || ""}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-indigo-600">
                                                    {session.visits?.length || 0} Pages Visited
                                                </span>
                                                <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                                    Started at: {session.visits?.[0]?.path || "/"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                                    {session.device?.toLowerCase().includes("mobile") ? (
                                                        <Smartphone className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Monitor className="h-3.5 w-3.5" />
                                                    )}
                                                    <span>{session.os || "Unknown OS"}</span>
                                                </div>
                                                <span className="text-xs text-gray-500 pl-5">
                                                    {session.browser || "Unknown Browser"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatDate(session.lastActiveAt)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                    onClick={(e) => { e.stopPropagation(); handleViewDetails(session); }}
                                                    title="View Full Details"
                                                >
                                                    <Info className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={(e) => handleDelete(session._id, e)}
                                                    disabled={isDeleting}
                                                    title="Delete Session"
                                                >
                                                    {isDeleting ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                                        No session data available yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Session Details Modal */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-indigo-600" />
                            Session Details
                        </DialogTitle>
                        <DialogDescription>
                            Full user journey and technical details
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSession && (
                        <div className="space-y-6 pt-2">
                            {/* User Journey Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    User Journey ({selectedSession.visits?.length || 0} Pages)
                                </h3>
                                <div className="border border-gray-100 rounded-lg overflow-hidden bg-gray-50/50">
                                    <Table>
                                        <TableHeader className="bg-gray-100/50">
                                            <TableRow>
                                                <TableHead>Time</TableHead>
                                                <TableHead>Page Title</TableHead>
                                                <TableHead>Path</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedSession.visits?.map((visit, idx) => (
                                                <TableRow key={idx} className="hover:bg-white">
                                                    <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                                                        {formatTime(visit.visitedAt)}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-gray-800 text-sm">
                                                        {visit.title || "No Title"}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-indigo-600 font-mono">
                                                        {visit.path}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Technical Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* IP Data */}
                                <div>
                                    <h4 className="text-xs font-semibold uppercase text-gray-500 mb-3 border-b pb-1">
                                        Location Data (IPStack)
                                    </h4>
                                    {isLoadingDetails ? (
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Loader2 className="h-3 w-3 animate-spin" /> Fetching details...
                                        </div>
                                    ) : selectedIpData ? (
                                        <div className="space-y-2">
                                            <DetailItem label="IP Address" value={selectedIpData.ip} />
                                            <DetailItem label="Location" value={`${selectedIpData.city}, ${selectedIpData.country_name}`} flag={selectedIpData.location?.country_flag_emoji} />
                                            <DetailItem label="Coordinates" value={`${selectedIpData.latitude?.toFixed(4)}, ${selectedIpData.longitude?.toFixed(4)}`} />
                                            <DetailItem label="ISP / Org" value={selectedIpData.connection?.isp || "N/A"} />
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400">Details unavailable</p>
                                    )}
                                </div>

                                {/* Device Data */}
                                <div>
                                    <h4 className="text-xs font-semibold uppercase text-gray-500 mb-3 border-b pb-1">
                                        System Info
                                    </h4>
                                    <div className="space-y-2">
                                        <DetailItem label="Device" value={selectedSession.device || "Unknown"} />
                                        <DetailItem label="OS" value={selectedSession.os || "Unknown"} />
                                        <DetailItem label="Browser" value={selectedSession.browser || "Unknown"} />
                                        <DetailItem label="Screen Res" value={selectedSession.screenResolution || "Unknown"} />
                                        <DetailItem label="User Agent" value={selectedSession.userAgent?.substring(0, 30) + "..." || "N/A"} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

const DetailItem = ({
    label,
    value,
    flag,
}: {
    label: string;
    value: string | number;
    flag?: string;
}) => (
    <div className="flex flex-col">
        <span className="text-xs text-gray-500 mb-0.5">{label}</span>
        <span className="font-medium text-gray-900 flex items-center gap-1.5">
            {flag && <span className="text-lg">{flag}</span>}
            {value || "N/A"}
        </span>
    </div>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
        {children}
    </span>
);

export default AnalyticsPage;
