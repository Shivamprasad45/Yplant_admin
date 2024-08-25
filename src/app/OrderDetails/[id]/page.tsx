"use client";
import React, { useEffect, useState } from "react";
import {
  useFetch_my_treeQuery,
  useUpdate_my_treeMutation,
} from "../../features/OrderSlice";
import { IPlantProfile } from "../../../../type";

const FetchTreesPage = ({ params }: { params: { id: string } }) => {
  const [updateMyTree] = useUpdate_my_treeMutation();

  const [selectedStatus, setSelectedStatus] = useState<{
    [key: string]: number;
  }>({});
  const { data: trees, isLoading, isError } = useFetch_my_treeQuery(params.id);
  // useEffect(() => {
  //   const handleFetchTrees = async () => {
  //     if (params.id) {
  //       await fetchMyTree(params.id); // Trigger the mutation
  //     }
  //   };
  //   handleFetchTrees();
  // }, [params.id, fetchMyTree]);

  const handleStatusChange = async (treeId: string, status: number) => {
    try {
      await updateMyTree({ findtree_id: treeId, status });
      // Update local state after successful mutation
      setSelectedStatus((prev) => ({ ...prev, [treeId]: status }));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tree Details</h1>

      {isLoading && <div className="text-blue-500">Loading...</div>}

      {isError && <div className="text-red-500">Error: {isError}</div>}

      {trees && trees.length > 0 ? (
        <ul className="space-y-4">
          {trees.map((tree: IPlantProfile) => (
            <li
              key={tree._id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {tree.name}
              </h3>
              <p className="text-gray-600 mt-2">
                Image URL: {tree.imageUrl.slice(0, 40)}
              </p>
              <p className="text-gray-600 mt-1">Age: {tree.age}</p>
              <p
                className={`text-gray-600 mt-1 p-2 rounded ${
                  (tree.status === 0 && "bg-red-600 text-white") ||
                  (tree.status === 1 && "bg-yellow-500 text-white") ||
                  (tree.status === 2 && "bg-green-500 text-white")
                }`}
              >
                Status: {tree.status}
              </p>

              <div className="mt-4">
                <label className="block text-gray-700">Update Status:</label>
                <select
                  value={selectedStatus[tree.findtree_id] || tree.status}
                  onChange={(e) =>
                    handleStatusChange(tree.findtree_id, Number(e.target.value))
                  }
                  className="mt-1 p-2 border border-gray-300 rounded"
                >
                  <option value={0}>Not Started</option>
                  <option value={1}>In Progress</option>
                  <option value={2}>Planted</option>
                  <option value={3}>Completed</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-600 mt-6">No trees found.</div>
      )}
    </div>
  );
};

export default FetchTreesPage;
