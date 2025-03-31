import React from "react";
import { MapPin } from "lucide-react";
import { LocationData } from "@/utils/locationService";

interface SimpleMapDisplayProps {
  locationData: LocationData;
}

const SimpleMapDisplay: React.FC<SimpleMapDisplayProps> = ({
  locationData,
}) => {
  if (!locationData.lat || !locationData.lng) {
    return (
      <div className="h-64 bg-gray-100 flex flex-col items-center justify-center text-gray-500 rounded-md">
        <MapPin className="mb-2 h-10 w-10 text-gray-400" />
        <p>Location will appear here after uploading an image</p>
      </div>
    );
  }

  // Create a map iframe with the marker using Google Maps (free for embedding)
  const mapUrl = `https://maps.google.com/maps?q=${locationData.lat},${locationData.lng}&z=15&output=embed`;

  return (
    <iframe
      width="100%"
      height="100%"
      frameBorder="0"
      scrolling="no"
      marginHeight={0}
      marginWidth={0}
      src={mapUrl}
      className="rounded-md border border-gray-300"
      title="Location Map"
    ></iframe>
  );
};

export default SimpleMapDisplay;
