"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import LocationComponent, {
  initialLocationData,
  type LocationData,
} from "./Map";
import { useGetOneTreeQuery, useUpdateTreeMutation } from "../features/Planted";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectImageURL } from "../features/ImageSlice";
import { Loader2, MapPin, ArrowLeft, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Free_clam = () => {
  const searchParams = useSearchParams();
  const imageSelector = useSelector(selectImageURL);

  // Extract query parameters
  const plantId = searchParams.get("plantid");
  const findId = searchParams.get("findid");
  const router = useRouter();

  const { data, isLoading: isLoadingTree } = useGetOneTreeQuery({
    findid: findId,
    plantId: plantId,
  });

  const [update, { isLoading: isUpdating, isSuccess }] =
    useUpdateTreeMutation();

  // Form state
  const [location, setLocation] = useState<LocationData>(initialLocationData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  // Handle location data from LocationComponent
  const handleLocationChange = (locationData: LocationData, url: string) => {
    setLocation(locationData);

    // Clear any previous error for location
    if (errors.location) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.location;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!location.lat || !location.lng) {
      newErrors.location = "Please allow location access when uploading photo";
    }

    if (!imageSelector) {
      newErrors.image = "Please upload a photo of your planted tree";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Show toast for validation errors
      toast.error("Please fix the errors before submitting");
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const confirmSubmission = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    try {
      await update({
        findid: findId,
        plantId: plantId,
        plantLocation: location,
        userId: data?.UserId,
        ImageURL: imageSelector,
        CommanName: data?.name || "",
      }).unwrap();

      // Show success message
      toast.success("Tree claimed successfully!");
      setSubmissionComplete(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToHome = () => {
    router.push("/Planted");
  };

  // If submission is complete, show success screen
  if (submissionComplete) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700">
              Tree Claimed Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Thank you for planting a tree!
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Your contribution helps make our planet greener. You can view your
              planted trees in your dashboard.
            </p>
            <Button
              onClick={handleGoToHome}
              className="bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-1"
        onClick={handleGoBack}
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <h1 className="text-3xl font-bold text-center mb-4 text-green-700">
        Plant Your Tree
      </h1>

      <p className="text-center text-muted-foreground mb-8 max-w-md mx-auto">
        Please upload a photo of your planted tree and confirm your location to
        complete the claim process.
      </p>

      <Card className="w-full max-w-2xl mx-auto shadow-md">
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="text-green-700">Free Tree Claim Form</CardTitle>
          <CardDescription>
            Complete the form below to claim your free tree
          </CardDescription>
        </CardHeader>

        {isLoadingTree ? (
          <CardContent className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <p>Loading tree information...</p>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tree Information */}
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-start mb-6 bg-green-50/50 p-4 rounded-lg">
                {data?.imageUrl && (
                  <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                    <Image
                      src={data.imageUrl || "/placeholder.svg"}
                      alt={data?.name || "Tree image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg">
                    {data?.name || "Tree"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please plant this tree in a suitable location with adequate
                    sunlight and water access.
                  </p>
                </div>
              </div>

              {/* Location component that handles image upload and location fetching */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">Planting Location</h3>
                </div>

                <LocationComponent onLocationChange={handleLocationChange} />

                {errors.location && (
                  <Alert variant="destructive">
                    <AlertTitle>Location Required</AlertTitle>
                    <AlertDescription>{errors.location}</AlertDescription>
                  </Alert>
                )}

                {errors.image && (
                  <Alert variant="destructive">
                    <AlertTitle>Image Required</AlertTitle>
                    <AlertDescription>{errors.image}</AlertDescription>
                  </Alert>
                )}

                {location.lat && location.lng && (
                  <div className="bg-green-50 p-3 rounded-md flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">
                      Location successfully captured
                    </span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Claim Free Tree"
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By claiming this tree, you agree to plant and care for it
                according to the provided guidelines.
              </p>
            </CardFooter>
          </form>
        )}
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Tree Claim</DialogTitle>
            <DialogDescription>
              Are you sure you want to claim this tree? This action confirms
              that you have planted the tree at the specified location.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={confirmSubmission}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Claim"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Free_clam;
