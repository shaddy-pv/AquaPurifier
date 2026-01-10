import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
      <div className="relative overflow-hidden">
        <Skeleton className="w-full h-64" />
      </div>

      <CardContent className="p-4">
        <div className="flex items-center space-x-1 mb-2">
          <Skeleton className="h-4 w-20" />
        </div>

        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-3" />

        <div className="space-y-2 mb-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="flex space-x-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton;
