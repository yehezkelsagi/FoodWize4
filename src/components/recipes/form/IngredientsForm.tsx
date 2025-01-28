import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Ingredient } from "../types/recipe";

interface IngredientsFormProps {
  ingredients: Ingredient[];
  onIngredientChange: (index: number, field: keyof Ingredient, value: string | number) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (index: number) => void;
}

const IngredientsForm = ({
  ingredients,
  onIngredientChange,
  onAddIngredient,
  onRemoveIngredient,
}: IngredientsFormProps) => {
  return (
    <div className="grid gap-2">
      <Label>Ingredients</Label>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="flex-1">
            <Input
              placeholder="Ingredient name"
              value={ingredient.name}
              onChange={(e) => onIngredientChange(index, 'name', e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Input
              type="number"
              min="0"
              step="100"
              placeholder="Quantity (grams)"
              value={ingredient.quantity}
              onChange={(e) => onIngredientChange(index, 'quantity', e.target.value)}
            />
          </div>
          {ingredients.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveIngredient(index)}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={onAddIngredient}
        className="mt-2"
      >
        Add Another Ingredient
      </Button>
    </div>
  );
};

export default IngredientsForm;