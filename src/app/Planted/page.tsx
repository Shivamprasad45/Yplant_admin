"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Leaf,
  Sprout,
  TreesIcon as Tree,
  Gift,
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

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorComponent onRetry={reset} />;

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-6xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h1 className="text-2xl font-bold text-green-800">
            My Tree Collection
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search trees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-[200px]"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setSortBy("name")}
                  className={cn(sortBy === "name" && "font-medium")}
                >
                  Sort by Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("age")}
                  className={cn(sortBy === "age" && "font-medium")}
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

        <Tabs defaultValue="0" className="w-full">
          {/* Tabs Header */}
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-background p-2 rounded-2xl shadow-sm">
              <TabTrigger
                value="0"
                count={statusGroups[0].length}
                label="Planted"
                icon={<Sprout className="h-4 w-4" />}
              />
              <TabTrigger
                value="1"
                count={statusGroups[1].length}
                label="Growing"
                icon={<Leaf className="h-4 w-4" />}
              />
              <TabTrigger
                value="2"
                count={statusGroups[2].length}
                label="Matured"
                icon={<Tree className="h-4 w-4" />}
              />
              <TabTrigger
                value="free"
                count={statusGroups.free.length}
                label="Free Trees"
                icon={<Gift className="h-4 w-4" />}
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
  );
}

// Custom Tab Trigger Component
const TabTrigger = ({
  value,
  count,
  label,
  icon,
}: {
  value: string;
  count: number;
  label: string;
  icon: React.ReactNode;
}) => (
  <TabsTrigger
    value={value}
    className="data-[state=active]:bg-green-50 data-[state=active]:border-green-200
             data-[state=active]:text-green-700 flex flex-col items-center justify-center
             p-4 rounded-xl border bg-white hover:bg-gray-50 transition-all
             shadow-sm hover:shadow-md data-[state=active]:shadow-md"
  >
    <div className="flex items-center gap-1.5 mb-1">
      {icon}
      <span className="text-lg font-bold text-green-600">{count}</span>
    </div>
    <span className="text-sm font-medium text-gray-600">{label}</span>
  </TabsTrigger>
);

// Tree Card Component
const TreeCard = ({ item }: { item: IPlantProfile }) => {
  const statusColor = {
    0: "bg-amber-50 text-amber-700",
    1: "bg-blue-50 text-blue-700",
    2: "bg-green-50 text-green-700",
    free: "bg-purple-50 text-purple-700",
  };

  const statusIcon = {
    0: <Sprout className="h-3.5 w-3.5" />,
    1: <Leaf className="h-3.5 w-3.5" />,
    2: <Tree className="h-3.5 w-3.5" />,
    free: <Gift className="h-3.5 w-3.5" />,
  };

  const status = item.Free ? "free" : item.status;

  return (
    <div
      className="group rounded-2xl border bg-white overflow-hidden hover:shadow-lg transition-all
                duration-300 hover:-translate-y-1"
    >
      {item.imageUrl && (
        <div className="relative aspect-video overflow-hidden">
          <Link href={item.status === 0 ? `/Addmap/${item.Plaintid}` : "#"}>
            <img
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <Badge
              className={`absolute top-3 right-3 flex items-center gap-1.5 ${
                statusColor[status as keyof typeof statusColor]
              }`}
            >
              {statusIcon[0]}
              {item.Free ? "Free" : getStatusLabel(item.status.toString())}
            </Badge>
          </Link>
        </div>
      )}
      <div className="p-5">
        <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-green-700 transition-colors">
          {item.name}
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-t">
            <span className="text-muted-foreground">Age</span>
            <span className="font-medium text-gray-700">{item.age} years</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t">
            <span className="text-muted-foreground">Location</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-medium text-gray-700">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="text-green-700 hover:text-green-800 hover:bg-green-50"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ category }: { category: string }) => (
  <div className="col-span-full flex flex-col justify-center items-center min-h-[300px] bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8">
    <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
      <Tree className="h-8 w-8 text-green-500" />
    </div>
    <p className="text-muted-foreground text-lg mb-2">
      No trees found in {category}
    </p>
    <p className="text-muted-foreground text-sm text-center max-w-md mb-6">
      You don&apos;t have any trees in this category yet. Add new trees to see
      them here.
    </p>
    <Button className="bg-green-600 hover:bg-green-700">Add New Tree</Button>
  </div>
);

// Helper function
const getStatusLabel = (status: string) => {
  switch (status) {
    case "0":
      return "Planted";
    case "1":
      return "Growing";
    case "2":
      return "Matured";
    case "free":
      return "Free";
    default:
      return "Unknown";
  }
};

// Improved Loading Skeleton
const LoadingSkeleton = () => (
  <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
    <div className="flex justify-between">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-64" />
    </div>

    <Skeleton className="h-16 w-full max-w-md mx-auto rounded-xl" />

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-2xl border bg-white overflow-hidden">
          <Skeleton className="aspect-video" />
          <div className="p-5 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-9 w-28 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Improved Error Component
const ErrorComponent = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 bg-gray-50 rounded-2xl border p-8">
    <div className="bg-red-50 p-4 rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-red-500"
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
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        Failed to load tree data
      </h3>
      <p className="text-muted-foreground max-w-md">
        There was an error loading your tree collection. Please check your
        connection and try again.
      </p>
    </div>
    <Button
      onClick={onRetry}
      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 
               transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
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
);
