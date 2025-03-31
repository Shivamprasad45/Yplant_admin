import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import ImageUpload from "./ImageUpload";
import LocationInfo from "./LocationInfo";
import { LocationData } from "@/utils/locationService";

export const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  bio: z.string().min(5, "Bio must be at least 5 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  relation: z.enum(["Friend", "Family", "Colleague", "Neighbor"]),
  imageUrl: z
    .string()
    .url("Please upload an image")
    .optional()
    .or(z.literal("")),
});

interface PlantFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
  locationData: LocationData;
  uploadedImage: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PlantForm: React.FC<PlantFormProps> = ({
  form,
  onSubmit,
  isLoading,
  locationData,
  uploadedImage,
  handleImageUpload,
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plant Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the plant species, condition, and surroundings"
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Bio</FormLabel>
              <FormControl>
                <Input
                  list="bioOptions"
                  placeholder="Write your bio or choose from options"
                  {...field}
                />
              </FormControl>
              <datalist id="bioOptions">
                <option value="Environmentalist" />
                <option value="Nature Enthusiast" />
                <option value="Tree Planter" />
                <option value="Gardener" />
              </datalist>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="relation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relation to Area</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a relation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Friend">Friend</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Colleague">Colleague</SelectItem>
                    <SelectItem value="Neighbor">Neighbor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ImageUpload
          form={form}
          uploadedImage={uploadedImage}
          handleImageUpload={handleImageUpload}
        />

        <LocationInfo locationData={locationData} />

        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Submit Plant Information"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PlantForm;
