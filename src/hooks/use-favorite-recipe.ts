import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useFavoriteRecipe = (recipeId: string) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkIfFavorite();
  }, [recipeId]);

  const checkIfFavorite = async () => {
    const { data: favorites, error } = await supabase
      .from('favorite_recipes')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq('user_id', 'a5fdafd5-b250-46bc-a3c3-8c6ed6605faa');

    if (!error && favorites && favorites.length > 0) {
      setIsFavorite(true);
    }
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      const { error } = await supabase
        .from('favorite_recipes')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('user_id', 'a5fdafd5-b250-46bc-a3c3-8c6ed6605faa');

      if (error) {
        toast.error('Failed to remove from favorites');
        return;
      }
      setIsFavorite(false);
      toast.success('Removed from favorites');
    } else {
      const { error } = await supabase
        .from('favorite_recipes')
        .insert([
          {
            recipe_id: recipeId,
            user_id: 'a5fdafd5-b250-46bc-a3c3-8c6ed6605faa'
          }
        ]);

      if (error) {
        toast.error('Failed to add to favorites');
        return;
      }
      setIsFavorite(true);
      toast.success('Added to favorites');
    }
  };

  return { isFavorite, toggleFavorite };
};