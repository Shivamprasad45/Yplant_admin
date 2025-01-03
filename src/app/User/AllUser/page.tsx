"use client";

import { useGetAlluserMutation } from "@/app/features/users";
import React from "react";
import { Loader2, AlertCircle, User } from "lucide-react";
import { IUser } from "../../../../type";
import Link from "next/link";

const Users = () => {
  const [getUsers, { data, isError, isLoading, isSuccess }] =
    useGetAlluserMutation();

  React.useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <AlertCircle className="h-8 w-8 text-red-600 mr-2" />
        <p className="text-red-600">Error loading users. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>
      {isSuccess && data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((user: IUser) => (
            <Link key={user.email} href={`/User/${user._id}`}>
              <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400 bg-gray-200 rounded-full p-2 mr-4" />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
                {user.role && (
                  <p className="text-sm text-gray-500 mb-2">
                    Role: {user.role}
                  </p>
                )}
                {user.authProviderId && (
                  <p className="text-sm text-gray-500">
                    Auth Provider: {user.authProviderId}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No users found.</p>
      )}
    </div>
  );
};

export default Users;
