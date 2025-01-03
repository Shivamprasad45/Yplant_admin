"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, FileText, Calendar } from "lucide-react";
import dynamic from "next/dynamic";
import {
  useFetch_my_treeQuery,
  useUpdate_verfied_treeMutation,
} from "@/app/features/users";
import { Types } from "mongoose";

// const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function TreeDetails({ params }: { params: { id: string } }) {
  const { data, isError } = useFetch_my_treeQuery(params.id);
  const [Verification, {}] = useUpdate_verfied_treeMutation();
  const Verified = (id: string) => {
    try {
      Verification(id);
    } catch (error) {}
  };
  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Tree Planting Details
          </CardTitle>
        </CardHeader>
        {data
          ?.filter((tree) => tree.verifed === false)
          .map((tree) => (
            <CardContent key={tree.find_id} className="grid gap-6">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={tree?.imageURL}
                  alt="Planted Tree"
                  layout="fill"
                  objectFit="cover"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{tree?.name}</span>
                  <Badge variant="outline">{tree?.relation}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{tree?.Plant_Addresses}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <h3 className="font-semibold">Description</h3>
                <p>{tree?.description}</p>
              </div>

              <div className="grid gap-2">
                <h3 className="font-semibold">Bio</h3>
                <p>{tree?.bio}</p>
              </div>

              <div className=" rounded-lg overflow-hidden">
                {/* <Map latitude={tree.late} longitude={tree.long} /> */}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>ID: {tree?.find_id}</span>
                </div>
                <div
                  className="flex items-center gap-1"
                  onClick={() => Verified(tree.find_id)}
                >
                  <Calendar className="h-4 w-4" />
                  <span>
                    Verification: {tree?.verifed ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            </CardContent>
          ))}
      </Card>
    </div>
  );
}
