"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import PlantForm, { formSchema } from "@/components/PlantForm";
import SimpleMapDisplay from "@/components/SimpleMapDisplay";
import {
  getCurrentLocation,
  initialLocationData,
  LocationData,
} from "@/utils/locationService";

const Index = () => {
  const [locationData, setLocationData] =
    useState<LocationData>(initialLocationData);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      bio: "",
      name: "",
      relation: undefined,
      imageUrl: "",
    },
  });

  // Handler for image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        form.setValue("imageUrl", "https://example.com/placeholder-image.jpg"); // Simulated URL
        // Fetch location when image is uploaded
        fetchLocation();
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch location data
  const fetchLocation = async () => {
    setIsLoading(true);
    try {
      const data = await getCurrentLocation();
      setLocationData(data);
    } catch (error) {
      console.error("Failed to get location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Check if we have location data
    if (!locationData.lat || !locationData.lng) {
      toast.error("Please allow location access before submitting");
      return;
    }

    // Here you would typically handle form submission
    console.log("Form submitted with values:", {
      ...values,
      location: locationData,
    });

    toast.success("Plant information submitted successfully!");
    form.reset(); // Clear the form
    setUploadedImage("");

    // Reset location data
    setLocationData(initialLocationData);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-green-50 to-white">
      <Card className="w-full max-w-2xl mx-auto shadow-md">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-center text-green-800">
            Plant Information Tracker
          </CardTitle>
        </CardHeader>

        <div className="h-64 p-4">
          <SimpleMapDisplay locationData={locationData} />
        </div>

        <CardContent className="pt-6">
          <PlantForm
            form={form}
            onSubmit={onSubmit}
            isLoading={isLoading}
            locationData={locationData}
            uploadedImage={uploadedImage}
            handleImageUpload={handleImageUpload}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
