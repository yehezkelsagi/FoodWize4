import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import EditRecipeDialog from "../EditRecipeDialog";
import { Recipe } from "@/types/recipe";

interface RecipeHeaderProps {
  recipe: Recipe;
  isFavorite: boolean;
  toggleFavorite: () => void;
  onUpdate: () => void;
}

const RecipeHeader = ({ recipe, isFavorite, toggleFavorite, onUpdate }: RecipeHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-semibold text-lg cursor-pointer">
        {recipe.title}
      </h3>
      <div className="flex gap-2 items-center">
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
          {recipe.dietary_type}
        </span>
        <EditRecipeDialog 
          recipe={recipe}
          onRecipeUpdated={onUpdate}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFavorite}
          className={isFavorite ? "text-yellow-500" : "text-gray-400"}
        >
          <Star className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
        </Button>
      </div>
    </div>
  );
};

export default RecipeHeader;