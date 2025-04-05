"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Camera from "./Camra";
import { useDispatch } from "react-redux";
import { setURL } from "../features/ImageSlice";

// Location interface
export interface LocationData {
  lat: number | null;
  lng: number | null;
  state: string;
  district: string;
  locality: string;
  country: string;
  fullAddress: string;
  adminDetails: Array<{ name: string; description: string; type: string }>;
}

export const initialLocationData: LocationData = {
  lat: null,
  lng: null,
  state: "",
  district: "",
  locality: "",
  country: "",
  fullAddress: "",
  adminDetails: [],
};

// Move the getCurrentLocation function inside the component
// Or wrap it in a check for window/navigator

const LocationComponent = ({
  onLocationChange,
}: {
  onLocationChange: (location: LocationData, Url: string) => void;
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState<LocationData>(initialLocationData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch();

  // Move getCurrentLocation inside the component
  const getCurrentLocation = async (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser");
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Get address from coordinates using BigDataCloud API
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
              {
                headers: {
                  Accept: "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Build full address from components
            const addressParts = [];
            if (data.locality) addressParts.push(data.locality);
            if (data.city && data.city !== data.locality)
              addressParts.push(data.city);
            if (data.principalSubdivision)
              addressParts.push(data.principalSubdivision);
            if (data.countryName) addressParts.push(data.countryName);

            // Get postal code if available
            const postcode = data.postcode || "";
            if (postcode) addressParts.push(postcode);

            const fullAddress = addressParts.join(", ");

            // Extract administrative details from localityInfo
            const adminDetails: Array<{
              name: string;
              description: string;
              type: string;
            }> = [];
            if (data.localityInfo && data.localityInfo.administrative) {
              data.localityInfo.administrative.forEach((item: any) => {
                adminDetails.push({
                  name: item.name,
                  description: item.description || "",
                  type: item.adminLevel ? `Level ${item.adminLevel}` : "",
                });
              });
            }

            // Find district from administrative details
            let district = "Unknown district";
            const districtInfo = adminDetails.find(
              (item) =>
                item.description?.toLowerCase().includes("district") ||
                item.type === "Level 5" // District is typically admin level 5
            );

            if (districtInfo) {
              district = districtInfo.name;
            }

            // Extract location data from the response
            const locationData: LocationData = {
              lat: lat,
              lng: lng,
              state: data.principalSubdivision || "Unknown state",
              district: district,
              locality: data.locality || data.city || "",
              country: data.countryName || "Unknown country",
              fullAddress: fullAddress,
              adminDetails: adminDetails,
            };

            toast.success("Location fetched successfully!");
            resolve(locationData);
          } catch (error) {
            console.error("Error fetching address:", error);
            const errorLocationData: LocationData = {
              lat: lat,
              lng: lng,
              state: "Unknown",
              district: "Unknown",
              locality: "Unknown",
              country: "Unknown country",
              fullAddress: "Address information unavailable",
              adminDetails: [],
            };
            toast.error("Error fetching address information");
            resolve(errorLocationData);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error(
            "Unable to get your location. Please check your permissions."
          );
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  };

  // Handle image selection from camera
  const handleImageSelected = async (url: string) => {
    setImageUrl(url);
    dispatch(setURL(url));
    // Clear any previous error for imageUrl
    if (errors.imageUrl) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.imageUrl;
        return newErrors;
      });
    }

    // Fetch location when image is uploaded
    setIsLoading(true);
    try {
      const locationData = await getCurrentLocation();
      setLocation(locationData);
      onLocationChange(locationData, url); // Updated to use the url parameter directly
    } catch (error) {
      console.error("Error fetching location:", error);
      toast.error("Failed to fetch location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader className="bg-green-50">
        <CardTitle className="text-green-700">Photo & Location</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Photo Proof
          </label>
          <Camera onImageSelected={handleImageSelected} />

          {imageUrl && (
            <div className="mt-4">
              <p className="text-sm text-green-600 mb-2">
                Image uploaded successfully!
              </p>
              <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Uploaded proof"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {errors.imageUrl && (
            <p className="text-sm text-red-500 mt-1">{errors.imageUrl}</p>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          location.lat && (
            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <h3 className="font-medium text-green-700 mb-2">
                Location Details
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {location.fullAddress}
                </p>
                <p>
                  <span className="font-medium">District:</span>{" "}
                  {location.district}
                </p>
                <p>
                  <span className="font-medium">State:</span> {location.state}
                </p>
                <p>
                  <span className="font-medium">Country:</span>{" "}
                  {location.country}
                </p>
                <p className="text-xs text-gray-500">
                  Coordinates: {location.lat}, {location.lng}
                </p>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default LocationComponent;
