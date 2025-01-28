import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import EditRecipeForm from "../form/EditRecipeForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface EditRecipeDialogContentProps {
  recipeId: string;
  title: string;
  description: string;
  prepTime: string;
  dietary_type: string;
  image_url: string | null;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onPrepTimeChange: (prepTime: string) => void;
  onDietaryTypeChange: (dietary_type: string) => void;
  onImageChange: (file: File | null) => void;
  onUpdate: () => void;
  onClose: () => void;
}

export const EditRecipeDialogContent = ({
  recipeId,
  title,
  description,
  prepTime,
  dietary_type,
  image_url,
  onTitleChange,
  onDescriptionChange,
  onPrepTimeChange,
  onDietaryTypeChange,
  onImageChange,
  onUpdate,
  onClose,
}: EditRecipeDialogContentProps) => {
  const navigate = useNavigate();

  const handleDeleteRecipe = async () => {
    try {
      // Delete recipe notes
      const { error: notesError } = await supabase
        .from('recipe_notes')
        .delete()
        .eq('recipe_id', recipeId);

      if (notesError) throw notesError;

      // Delete recipe ingredients
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', recipeId);

      if (ingredientsError) throw ingredientsError;

      // Delete favorite recipes
      const { error: favoritesError } = await supabase
        .from('favorite_recipes')
        .delete()
        .eq('recipe_id', recipeId);

      if (favoritesError) throw favoritesError;

      // Delete the recipe itself
      const { error: recipeError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (recipeError) throw recipeError;

      toast.success('Recipe deleted successfully');
      onClose();
      navigate('/recipes');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  return (
    <ScrollArea className="h-full max-h-[calc(90vh-8rem)] pr-4">
      <div className="space-y-6">
        <EditRecipeForm
          title={title}
          description={description}
          prepTime={prepTime}
          dietary_type={dietary_type}
          image_url={image_url}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          onPrepTimeChange={onPrepTimeChange}
          onDietaryTypeChange={onDietaryTypeChange}
          onImageChange={onImageChange}
        />
        <div className="flex justify-between pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Recipe
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the recipe
                  and all associated data including notes, ingredients, and favorites.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteRecipe}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={onUpdate}>
            Update Recipe
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};