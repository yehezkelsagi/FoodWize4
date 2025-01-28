import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ingredient, RecipeFormData } from "../types/recipe";

export const useRecipeForm = (onClose: () => void, onSuccess: () => void) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: 0 }]);
  const [newRecipe, setNewRecipe] = useState<RecipeFormData>({
    title: "",
    description: "",
    prepTime: "",
    servings: "",
    dietary_type: "carnivore",
  });

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: 0 }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...ingredients];
    if (field === 'name') {
      newIngredients[index] = { ...newIngredients[index], [field]: value as string };
    } else {
      const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
      newIngredients[index] = { ...newIngredients[index], quantity: numValue };
    }
    setIngredients(newIngredients);
  };

  const handleAddRecipe = async () => {
    try {
      // Validate user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to add a recipe');
        return;
      }

      if (parseInt(newRecipe.servings) < 0) {
        toast.error('Number of servings cannot be negative');
        return;
      }

      if (parseInt(newRecipe.prepTime) < 0) {
        toast.error('Prep time cannot be negative');
        return;
      }

      let image_url = null;

      // Upload image if one was selected
      if (newRecipe.imageFile) {
        const fileExt = newRecipe.imageFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('recipe_images')
          .upload(fileName, newRecipe.imageFile, {
            upsert: false,
            contentType: newRecipe.imageFile.type,
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error('Failed to upload image. Please try again.');
          return;
        }

        // Get the public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('recipe_images')
          .getPublicUrl(fileName);

        image_url = publicUrl;
      }

      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert([
          {
            title: newRecipe.title,
            description: newRecipe.description,
            prep_time: parseInt(newRecipe.prepTime),
            servings: parseInt(newRecipe.servings),
            dietary_type: newRecipe.dietary_type,
            image_url: image_url,
            user_id: session.user.id, // Add user_id to the recipe
          },
        ])
        .select();

      if (recipeError) throw recipeError;
      if (!recipeData || recipeData.length === 0) throw new Error('Failed to create recipe');

      const recipeId = recipeData[0].id;

      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(
          ingredients
            .filter(ing => ing.name.trim() !== "")
            .map(ing => ({
              recipe_id: recipeId,
              name: ing.name.trim(),
              quantity: ing.quantity,
            }))
        );

      if (ingredientsError) throw ingredientsError;

      toast.success('Recipe added successfully!');
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error adding recipe:', error);
      toast.error('Failed to add recipe');
    }
  };

  return {
    ingredients,
    newRecipe,
    setNewRecipe,
    addIngredient,
    removeIngredient,
    updateIngredient,
    handleAddRecipe,
  };
};