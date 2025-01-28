import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    quantity: number;
  }>;
  instructions: string;
  image_url: string | null;
}

export const useRecipeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [showApprovalStep, setShowApprovalStep] = useState(false);

  const generateRecipe = async (openAIKey: string) => {
    try {
      setIsGenerating(true);
      setGeneratedRecipe(null);
      setShowApprovalStep(false);
      
      // Fetch pantry items
      const { data: pantryItemsResponse, error: pantryError } = await supabase
        .from('pantry_items')
        .select('name')
        .eq('user_id', 'a5fdafd5-b250-46bc-a3c3-8c6ed6605faa');

      if (pantryError) {
        console.error('Error fetching pantry items:', pantryError);
        throw pantryError;
      }

      if (!pantryItemsResponse || pantryItemsResponse.length === 0) {
        toast.error("No pantry items found. Please add some items to your pantry first.");
        return;
      }

      // Fetch existing recipes to avoid duplicates
      const { data: existingRecipes, error: recipesError } = await supabase
        .from('recipes')
        .select('title');

      if (recipesError) {
        console.error('Error fetching existing recipes:', recipesError);
        throw recipesError;
      }

      const existingTitles = existingRecipes?.map(recipe => recipe.title.toLowerCase()) || [];

      // Generate recipe with uniqueness check
      const { data, error } = await supabase.functions.invoke('generate-unique-recipe', {
        body: {
          pantryItems: pantryItemsResponse,
          existingTitles,
          openAIKey,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data || !data.recipe) {
        throw new Error('No recipe was generated');
      }

      const parsedRecipe: GeneratedRecipe = JSON.parse(data.recipe);
      setGeneratedRecipe(parsedRecipe);
      setShowApprovalStep(true);
      toast.success("Recipe generated successfully! Please review and approve it.");
      
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast.error("Failed to generate recipe. Please check your OpenAI API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedRecipe,
    showApprovalStep,
    generateRecipe,
    setShowApprovalStep,
    setGeneratedRecipe
  };
};