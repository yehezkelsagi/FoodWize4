import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRecipeGeneration } from "./useRecipeGeneration";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RecipeGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RecipeGenerationDialog = ({ isOpen, onClose, onSuccess }: RecipeGenerationDialogProps) => {
  const [openAIKey, setOpenAIKey] = useState("");
  const {
    isGenerating,
    generatedRecipe,
    showApprovalStep,
    generateRecipe,
    setShowApprovalStep,
    setGeneratedRecipe
  } = useRecipeGeneration();

  const handleClose = () => {
    setOpenAIKey("");
    setGeneratedRecipe(null);
    setShowApprovalStep(false);
    onClose();
  };

  const saveRecipe = async () => {
    try {
      if (!generatedRecipe) {
        toast.error("No recipe to save!");
        return;
      }

      // First, insert the recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert([
          {
            title: generatedRecipe.title,
            description: `${generatedRecipe.description}\n\nInstructions:\n${generatedRecipe.instructions}`,
            user_id: 'a5fdafd5-b250-46bc-a3c3-8c6ed6605faa',
            dietary_type: 'carnivore',
            image_url: generatedRecipe.image_url,
          },
        ])
        .select()
        .single();

      if (recipeError) {
        console.error('Error inserting recipe:', recipeError);
        throw recipeError;
      }

      // Then, insert the ingredients
      const ingredientsToInsert = generatedRecipe.ingredients.map(ingredient => ({
        recipe_id: recipeData.id,
        name: ingredient.name,
        quantity: ingredient.quantity,
      }));

      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(ingredientsToInsert);

      if (ingredientsError) {
        console.error('Error inserting ingredients:', ingredientsError);
        throw ingredientsError;
      }

      toast.success("Recipe saved successfully!");
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error("Failed to save recipe. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Recipe with AI</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {!showApprovalStep ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                Enter your OpenAI API key to generate a unique recipe based on your pantry items.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  The AI will generate a unique recipe using ingredients from your pantry. Make sure you have added ingredients to your pantry first. This helps create recipes with ingredients you already have!
                </p>
              </div>
              <Input
                type="password"
                placeholder="Enter your OpenAI API key"
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
              />
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Review the generated recipe:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                {generatedRecipe && (
                  <>
                    <h3 className="font-semibold mb-2">{generatedRecipe.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{generatedRecipe.description}</p>
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Ingredients:</h4>
                      <ul className="list-disc pl-5 text-sm">
                        {generatedRecipe.ingredients.map((ingredient, index) => (
                          <li key={index}>
                            {ingredient.name}: {ingredient.quantity}g
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Instructions:</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {generatedRecipe.instructions}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {!showApprovalStep ? (
            <Button
              onClick={() => generateRecipe(openAIKey)}
              disabled={!openAIKey || isGenerating}
              className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
            >
              {isGenerating ? "Generating..." : "Generate Recipe"}
            </Button>
          ) : (
            <Button
              onClick={saveRecipe}
              className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
            >
              Save Recipe
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeGenerationDialog;