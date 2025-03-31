import React from "react";
import { LocationData } from "@/utils/locationService";

interface LocationInfoProps {
  locationData: LocationData;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ locationData }) => {
  if (!locationData.lat || !locationData.lng) {
    return null;
  }

  return (
    <div className="bg-green-50 p-4 rounded-md border border-green-100">
      <p className="text-sm font-medium text-green-800">Location detected:</p>
      <div className="mt-2 space-y-1">
        <p className="text-sm text-gray-700 break-words">
          <span className="font-medium">Full Address:</span>{" "}
          {locationData.fullAddress}
        </p>
        {locationData.locality && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">Locality:</span>{" "}
            {locationData.locality}
          </p>
        )}
        <p className="text-sm text-gray-700">
          <span className="font-medium">District:</span> {locationData.district}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">State:</span> {locationData.state}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Country:</span> {locationData.country}
        </p>

        {/* Add collapsible details for administrative info */}
        {locationData.adminDetails.length > 0 && (
          <div className="mt-3 pt-2 border-t border-green-100">
            <details className="text-sm">
              <summary className="cursor-pointer font-medium text-green-700 mb-1">
                Show detailed administrative info
              </summary>
              <div className="pl-2 space-y-1 mt-1">
                {locationData.adminDetails.map((item, index) => (
                  <p key={index} className="text-xs text-gray-600">
                    <span className="font-medium">{item.type || "Area"}:</span>{" "}
                    {item.name}
                    {item.description && (
                      <span className="text-gray-500">
                        {" "}
                        - {item.description}
                      </span>
                    )}
                  </p>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationInfo;
