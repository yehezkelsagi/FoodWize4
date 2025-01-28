import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useFavoriteRecipe } from "@/hooks/use-favorite-recipe";
import ViewRecipeDialog from "./ViewRecipeDialog";
import RecipeImage from "./components/RecipeImage";
import RecipeHeader from "./components/RecipeHeader";
import RecipeContent from "./components/RecipeContent";

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  prep_time: number | null;
  dietary_type: string | null;
  servings: number | null;
  onUpdate?: () => void;
}

const RecipeCard = ({ 
  id, 
  title, 
  description, 
  image_url, 
  prep_time, 
  dietary_type, 
  servings, 
  onUpdate 
}: RecipeCardProps) => {
  const { isFavorite, toggleFavorite } = useFavoriteRecipe(id);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const recipe = {
    id,
    title,
    description,
    prep_time,
    dietary_type,
    image_url,
    servings
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <RecipeImage
          image_url={image_url}
          title={title}
          onClick={() => setIsViewDialogOpen(true)}
        />
        <div className="p-4">
          <RecipeHeader
            recipe={recipe}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            onUpdate={onUpdate || (() => {})}
          />
          <RecipeContent
            description={description}
            prep_time={prep_time}
            onClick={() => setIsViewDialogOpen(true)}
          />
        </div>
      </Card>

      <ViewRecipeDialog
        recipe={recipe}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      />
    </>
  );
};

export default RecipeCard;