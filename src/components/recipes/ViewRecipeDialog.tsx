import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Recipe } from "@/types/recipe";
import { RecipeDetails } from "./RecipeDetails";
import { MissingIngredientsDialog } from "./MissingIngredientsDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
}

interface MissingIngredient extends Ingredient {
  requiredQuantity: number;
  availableQuantity: number;
  pantryQuantity: number;
  shoppingListQuantity: number;
}

interface ViewRecipeDialogProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

const ViewRecipeDialog = ({ recipe, isOpen, onClose }: ViewRecipeDialogProps) => {
  const [showMissingIngredientsDialog, setShowMissingIngredientsDialog] = useState(false);
  const [missingIngredients, setMissingIngredients] = useState<MissingIngredient[]>([]);
  const isMobile = useIsMobile();

  const { data: ingredients = [] } = useQuery({
    queryKey: ['recipe-ingredients', recipe.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipe_ingredients')
        .select('*')
        .eq('recipe_id', recipe.id);

      if (error) throw error;
      return data as Ingredient[];
    },
    enabled: isOpen,
  });

  const handleClose = () => {
    setShowMissingIngredientsDialog(false);
    setMissingIngredients([]);
    onClose();
  };

  const checkPantryAndCook = async () => {
    const [pantryResponse, shoppingListResponse] = await Promise.all([
      supabase
        .from('pantry_items')
        .select('name, quantity')
        .eq('user_id', 'a5fdafd5-b250-46bc-a3c3-8c6ed6605faa'),
      supabase
        .from('shopping_list_items')
        .select('name, quantity')
        .eq('user_id', 'a5fdafd5-b250-46bc-a3c3-8c6ed6605faa')
        .eq('completed', false)
    ]);

    if (pantryResponse.error || shoppingListResponse.error) {
      toast.error('Failed to check ingredients');
      handleClose();
      return;
    }

    const pantryItems = pantryResponse.data || [];
    const shoppingListItems = shoppingListResponse.data || [];

    const missing = ingredients.map(ingredient => {
      const pantryItem = pantryItems.find(item => 
        item.name.toLowerCase() === ingredient.name.toLowerCase()
      );
      const shoppingListItem = shoppingListItems.find(item => 
        item.name.toLowerCase() === ingredient.name.toLowerCase()
      );
      
      const recipeQuantity = ingredient.quantity;
      const pantryQuantity = pantryItem ? Number(pantryItem.quantity) : 0;
      const shoppingListQuantity = shoppingListItem ? Number(shoppingListItem.quantity) : 0;
      const totalAvailable = pantryQuantity + shoppingListQuantity;
      
      if (totalAvailable < recipeQuantity) {
        return {
          ...ingredient,
          requiredQuantity: recipeQuantity,
          availableQuantity: totalAvailable,
          pantryQuantity,
          shoppingListQuantity
        };
      }
      return null;
    }).filter((item): item is MissingIngredient => item !== null);

    if (missing.length === 0) {
      toast.success('You have all ingredients! Happy cooking! 🎉');
      handleClose();
    } else {
      setMissingIngredients(missing);
      setShowMissingIngredientsDialog(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className={`${isMobile ? 'w-[95vw] h-[90vh]' : 'max-w-3xl max-h-[85vh]'} mx-auto`}>
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold">{recipe.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-full max-h-[calc(90vh-8rem)] pr-4">
            <div className={`${isMobile ? 'p-2' : 'p-4'}`}>
              <RecipeDetails 
                recipe={recipe}
                ingredients={ingredients}
                onCookClick={checkPantryAndCook}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <MissingIngredientsDialog 
        isOpen={showMissingIngredientsDialog}
        onClose={() => setShowMissingIngredientsDialog(false)}
        missingIngredients={missingIngredients}
        onCloseMainDialog={handleClose}
      />
    </>
  );
};

export default ViewRecipeDialog;