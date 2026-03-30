import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function SkeletonCard() {
  return (
    <Card className="w-full mt-10">
      <CardHeader>
        <Skeleton className="h-8 w-2/3 mx-auto" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  );
}


export function SkeletonAudio() {
  return (
    <div className="w-full mt-10 flex items-center gap-4 ">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-[350px]" />
      </div>
    </div>
  );
}