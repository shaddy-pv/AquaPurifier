import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export interface Variant {
  id: string;
  name: string;
  value: string;
  price?: number;
  inStock: boolean;
}

export interface VariantOption {
  name: string;
  variants: Variant[];
}

interface ProductVariantsProps {
  options: VariantOption[];
  onVariantChange?: (selectedVariants: Record<string, string>) => void;
}

const ProductVariants = ({ options, onVariantChange }: ProductVariantsProps) => {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const handleSelect = (optionName: string, variantId: string) => {
    const newSelection = {
      ...selectedVariants,
      [optionName]: variantId,
    };
    setSelectedVariants(newSelection);
    onVariantChange?.(newSelection);
  };

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.name} className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{option.name}</h4>
            {selectedVariants[option.name] && (
              <span className="text-sm text-muted-foreground">
                Selected: {option.variants.find(v => v.id === selectedVariants[option.name])?.value}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {option.variants.map((variant) => {
              const isSelected = selectedVariants[option.name] === variant.id;
              const isDisabled = !variant.inStock;

              return (
                <Button
                  key={variant.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  disabled={isDisabled}
                  onClick={() => handleSelect(option.name, variant.id)}
                  className={`relative ${
                    isSelected ? "bg-primary" : ""
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isSelected && (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  {variant.value}
                  {variant.price && (
                    <span className="ml-2 text-xs">
                      +₹{variant.price}
                    </span>
                  )}
                  {isDisabled && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 text-xs px-1 py-0"
                    >
                      Out
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductVariants;
