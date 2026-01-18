"use client";

import type React from "react";

import Image from "next/image";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Leaf,
  Sprout,
  TreesIcon as Tree,
  Gift,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllMytreeMutation } from "../features/Planted";
import type { IPlantProfile } from "../../../type";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function TreeManagement() {
  const [GetAllTree, { data, isError, isLoading, reset }] =
    useGetAllMytreeMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "age">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        await GetAllTree();
      } catch (error) {
        console.error("Error fetching trees:", error);
      }
    };
    fetchTrees();
  }, [GetAllTree]);

  // Process and group the data
  const processData = () => {
    if (!data) return { 0: [], 1: [], 2: [], free: [] };

    // Filter by search term if provided
    const filteredData = searchTerm
      ? data.filter((item: IPlantProfile) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : data;

    // Sort the data
    const sortedData = [...filteredData].sort(
      (a: IPlantProfile, b: IPlantProfile) => {
        if (sortBy === "name") {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else {
          return sortOrder === "asc" ? a.age - b.age : b.age - a.age;
        }
      }
    );

    // Group by status
    return {
      0: sortedData.filter((item: IPlantProfile) => item.status === 0),
      1: sortedData.filter((item: IPlantProfile) => item.status === 1),
      2: sortedData.filter((item: IPlantProfile) => item.status === 2),
      free: sortedData.filter((item: IPlantProfile) => item.Free),
    };
  };

  const statusGroups = processData();

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Calculate statistics
  const totalTrees = data?.length || 0;
  const averageAge = data?.length
    ? (data.reduce((sum, tree) => sum + tree.age, 0) / data.length).toFixed(1)
    : 0;

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorComponent onRetry={reset} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="w-full flex justify-center px-4 py-8">
        <div className="w-full max-w-7xl space-y-8">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  Tree Collection Dashboard
                </h1>
                <p className="text-gray-600">
                  Manage and monitor your planted trees
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search trees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-[240px] border-green-200 focus:border-green-400"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="default"
                      className="flex items-center gap-2 border-green-200 hover:bg-green-50"
                    >
                      <Filter className="h-4 w-4" />
                      <span>Sort</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setSortBy("name")}
                      className={cn(sortBy === "name" && "font-medium bg-green-50")}
                    >
                      Sort by Name
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy("age")}
                      className={cn(sortBy === "age" && "font-medium bg-green-50")}
                    >
                      Sort by Age
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleSortOrder}>
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      {sortOrder === "asc" ? "Ascending" : "Descending"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <StatCard
                icon={<Tree className="h-5 w-5" />}
                label="Total Trees"
                value={totalTrees.toString()}
                color="green"
              />
              <StatCard
                icon={<TrendingUp className="h-5 w-5" />}
                label="Average Age"
                value={`${averageAge} years`}
                color="blue"
              />
              <StatCard
                icon={<Sprout className="h-5 w-5" />}
                label="Planted"
                value={statusGroups[0].length.toString()}
                color="amber"
              />
              <StatCard
                icon={<Leaf className="h-5 w-5" />}
                label="Growing"
                value={statusGroups[1].length.toString()}
                color="emerald"
              />
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="0" className="w-full">
            {/* Tabs Header */}
            <div className="flex justify-center mb-6">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-md border border-green-100">
                <TabTrigger
                  value="0"
                  count={statusGroups[0].length}
                  label="Planted"
                  icon={<Sprout className="h-4 w-4" />}
                  color="amber"
                />
                <TabTrigger
                  value="1"
                  count={statusGroups[1].length}
                  label="Growing"
                  icon={<Leaf className="h-4 w-4" />}
                  color="blue"
                />
                <TabTrigger
                  value="2"
                  count={statusGroups[2].length}
                  label="Matured"
                  icon={<Tree className="h-4 w-4" />}
                  color="green"
                />
                <TabTrigger
                  value="free"
                  count={statusGroups.free.length}
                  label="Free Trees"
                  icon={<Gift className="h-4 w-4" />}
                  color="purple"
                />
              </TabsList>
            </div>

            {/* Content Area */}
            <div>
              {Object.entries(statusGroups).map(([key, items]) => (
                <TabsContent
                  key={key}
                  value={key}
                  className="animate-in fade-in-50 duration-300"
                >
                  {items.length === 0 ? (
                    <EmptyState category={getStatusLabel(key)} />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((item: IPlantProfile) => (
                        <TreeCard key={item._id} item={item} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Statistics Card Component
const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) => {
  const colorClasses = {
    green: "bg-green-50 text-green-600 border-green-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div
          className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]
            }`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Custom Tab Trigger Component
const TabTrigger = ({
  value,
  count,
  label,
  icon,
  color,
}: {
  value: string;
  count: number;
  label: string;
  icon: React.ReactNode;
  color: string;
}) => {
  const activeColors = {
    amber: "data-[state=active]:bg-amber-50 data-[state=active]:border-amber-300 data-[state=active]:text-amber-700",
    blue: "data-[state=active]:bg-blue-50 data-[state=active]:border-blue-300 data-[state=active]:text-blue-700",
    green: "data-[state=active]:bg-green-50 data-[state=active]:border-green-300 data-[state=active]:text-green-700",
    purple: "data-[state=active]:bg-purple-50 data-[state=active]:border-purple-300 data-[state=active]:text-purple-700",
  };

  return (
    <TabsTrigger
      value={value}
      className={`${activeColors[color as keyof typeof activeColors]}
               flex flex-col items-center justify-center
               p-4 rounded-xl border-2 bg-white hover:bg-gray-50 transition-all
               shadow-sm hover:shadow-md data-[state=active]:shadow-md`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xl font-bold">{count}</span>
      </div>
      <span className="text-xs font-medium">{label}</span>
    </TabsTrigger>
  );
};

// Enhanced Tree Card Component
const TreeCard = ({ item }: { item: IPlantProfile }) => {
  const statusConfig = {
    0: {
      color: "bg-gradient-to-r from-amber-500 to-orange-500",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      icon: <Sprout className="h-3.5 w-3.5" />,
    },
    1: {
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      icon: <Leaf className="h-3.5 w-3.5" />,
    },
    2: {
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      icon: <Tree className="h-3.5 w-3.5" />,
    },
    free: {
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
      icon: <Gift className="h-3.5 w-3.5" />,
    },
  };

  const status = item.Free ? "free" : item.status;
  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <div className="group rounded-2xl border-2 border-gray-100 bg-white overflow-hidden hover:shadow-2xl hover:border-green-200 transition-all duration-300 hover:-translate-y-2">
      {item.imageUrl && (
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100">
          <Link
            href={
              item.status === 0
                ? `/AddMap?plantid=${item.Plaintid}&findid=${item.findtree_id}`
                : "#"
            }
          >
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <Badge
              className={`absolute top-3 right-3 flex items-center gap-1.5 ${config.color} text-white border-0 shadow-lg`}
            >
              {config.icon}
              {item.Free ? "Free" : getStatusLabel(item.status.toString())}
            </Badge>
          </Link>
        </div>
      )}

      <div className="p-5">
        <h3 className="font-bold text-xl mb-4 text-gray-800 group-hover:text-green-600 transition-colors line-clamp-1">
          {item.name}
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Age</span>
            </div>
            <span className="font-semibold text-gray-900">{item.age} years</span>
          </div>

          <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </div>
            <span className="font-semibold text-gray-900 text-xs">Tracked</span>
          </div>

          <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <Tree className="h-4 w-4" />
              <span>Status</span>
            </div>
            <Badge className={`${config.bgColor} ${config.textColor} border-0`}>
              {item.Free ? "Free" : getStatusLabel(item.status.toString())}
            </Badge>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100">
          <Link
            href={
              item.status === 0
                ? `/AddMap?plantid=${item.Plaintid}&findid=${item.findtree_id}`
                : "#"
            }
          >
            <Button
              variant="default"
              size="sm"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ category }: { category: string }) => (
  <div className="col-span-full flex flex-col justify-center items-center min-h-[400px] bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12">
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-full mb-6 shadow-sm">
      <Tree className="h-12 w-12 text-green-600" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">
      No trees found in {category}
    </h3>
    <p className="text-gray-500 text-center max-w-md mb-8">
      You don&apos;t have any trees in this category yet. Add new trees to see
      them here.
    </p>
    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all">
      <Sprout className="h-4 w-4 mr-2" />
      Add New Tree
    </Button>
  </div>
);

// Helper function
const getStatusLabel = (status: string) => {
  switch (status) {
    case "0":
      return "Pending";
    case "1":
      return "Shipping";
    case "2":
      return "Planted";
    case "free":
      return "Free";
    default:
      return "Unknown";
  }
};

// Improved Loading Skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>

      <Skeleton className="h-20 w-full max-w-2xl mx-auto rounded-2xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl border-2 bg-white overflow-hidden">
            <Skeleton className="aspect-video" />
            <div className="p-5 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Improved Error Component
const ErrorComponent = ({ onRetry }: { onRetry: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
    <div className="flex flex-col items-center justify-center space-y-6 bg-white rounded-2xl border-2 border-red-100 p-12 max-w-md">
      <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Failed to load tree data
        </h3>
        <p className="text-gray-600">
          There was an error loading your tree collection. Please check your
          connection and try again.
        </p>
      </div>
      <Button
        onClick={onRetry}
        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Try Again
      </Button>
    </div>
  </div>
);
