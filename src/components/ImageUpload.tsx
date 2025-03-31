import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface ImageUploadProps {
  form: UseFormReturn<any>;
  uploadedImage: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  form,
  uploadedImage,
  handleImageUpload,
}) => {
  return (
    <FormField
      control={form.control}
      name="imageUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Plant Image</FormLabel>
          <FormControl>
            <div className="flex flex-col space-y-2">
              <Input
                type="file"
                accept="image/*"
                className="cursor-pointer"
                onChange={handleImageUpload}
              />
              {uploadedImage && (
                <div className="mt-2">
                  <p className="text-sm text-green-600 mb-2">
                    Image uploaded successfully
                  </p>
                  <div className="relative h-40 w-full overflow-hidden rounded-md border">
                    <img
                      src={uploadedImage}
                      alt="Uploaded plant"
                      className="object-cover h-full w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageUpload;
