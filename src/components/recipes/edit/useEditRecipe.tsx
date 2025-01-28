import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useImageUpload } from "./ImageUploadHandler";

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  prep_time: number | null;
  dietary_type: string | null;
  image_url: string | null;
}

interface EditedRecipe {
  title: string;
  description: string;
  prepTime: string;
  dietary_type: string;
}

export const useEditRecipe = (recipe: Recipe, onSuccess: () => void) => {
  const [editedRecipe, setEditedRecipe] = useState<EditedRecipe>({
    title: recipe.title,
    description: recipe.description || "",
    prepTime: recipe.prep_time?.toString() || "",
    dietary_type: recipe.dietary_type || "carnivore",
  });

  const { imageFile, setImageFile, handleImageUpload } = useImageUpload(recipe.image_url);

  const handleUpdateRecipe = async () => {
    try {
      const image_url = await handleImageUpload();
      if (image_url === null) return;

      const { error } = await supabase
        .from('recipes')
        .update({
          title: editedRecipe.title,
          description: editedRecipe.description,
          prep_time: editedRecipe.prepTime ? parseInt(editedRecipe.prepTime) : null,
          dietary_type: editedRecipe.dietary_type,
          image_url: image_url,
        })
        .eq('id', recipe.id);

      if (error) throw error;

      toast.success('Recipe updated successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Failed to update recipe');
    }
  };

  return {
    editedRecipe,
    setEditedRecipe,
    imageFile,
    setImageFile,
    handleUpdateRecipe,
  };
};