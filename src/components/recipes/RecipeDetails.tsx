import { Recipe } from "@/types/recipe";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeNotes } from "./RecipeNotes";

interface RecipeDetailsProps {
  recipe: Recipe;
  ingredients: Ingredient[];
  onCookClick: () => void;
}

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
}

export const RecipeDetails = ({ recipe, ingredients, onCookClick }: RecipeDetailsProps) => {
  return (
    <div className="grid gap-4 md:gap-6">
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-48 md:h-64 object-cover rounded-lg"
        />
      )}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 md:gap-4 text-sm text-muted-foreground">
          {recipe.prep_time && (
            <div className="flex items-center gap-1">
              <span>Prep time:</span>
              <span className="font-medium">{recipe.prep_time} mins</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <span>Servings:</span>
              <span className="font-medium">{recipe.servings}</span>
            </div>
          )}
          {recipe.dietary_type && (
            <div className="flex items-center gap-1">
              <span>Dietary type:</span>
              <span className="font-medium capitalize">{recipe.dietary_type}</span>
            </div>
          )}
        </div>
        {recipe.description && (
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2">Description</h3>
            <p className="text-sm md:text-base text-muted-foreground break-words">{recipe.description}</p>
          </div>
        )}
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-2">Ingredients</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
            {ingredients.map((ingredient) => (
              <li key={ingredient.id} className="text-muted-foreground">
                <span className="font-medium">{ingredient.quantity}</span> {ingredient.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <RecipeNotes recipeId={recipe.id} />
        </div>
        <div className="pt-2 md:pt-4">
          <Button 
            onClick={onCookClick}
            className="w-full bg-[#F97316] hover:bg-[#F97316]/90 text-white"
            size="lg"
          >
            <ChefHat className="mr-2 h-5 w-5" />
            I want to cook this
          </Button>
        </div>
      </div>
    </div>
  );
};