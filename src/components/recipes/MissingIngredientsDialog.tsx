import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  requiredQuantity: number;
  availableQuantity: number;
  pantryQuantity: number;
  shoppingListQuantity: number;
}

interface MissingIngredientsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  missingIngredients: Ingredient[];
  onCloseMainDialog: () => void;
}

export const MissingIngredientsDialog = ({
  isOpen,
  onClose,
  missingIngredients,
  onCloseMainDialog,
}: MissingIngredientsDialogProps) => {
  const navigate = useNavigate();

  const addToShoppingList = async () => {
    try {
      // Process each missing ingredient
      for (const ingredient of missingIngredients) {
        const neededQuantity = ingredient.requiredQuantity - ingredient.availableQuantity;
        
        // Check if item already exists in shopping list
        const { data: existingItems } = await supabase
          .from('shopping_list_items')
          .select('*')
          .eq('name', ingredient.name)
          .eq('user_id', 'a5fdafd5-b250-46bc-a3c3-8c6ed6605faa')
          .eq('completed', false);

        if (existingItems && existingItems.length > 0) {
          // Update existing item
          const existingItem = existingItems[0];
          const { error: updateError } = await supabase
            .from('shopping_list_items')
            .update({ quantity: Number(existingItem.quantity) + neededQuantity })
            .eq('id', existingItem.id);

          if (updateError) {
            console.error('Error updating shopping list item:', updateError);
            toast.error(`Failed to update ${ingredient.name} in shopping list`);
            return;
          }
        } else {
          // Insert new item
          const { error: insertError } = await supabase
            .from('shopping_list_items')
            .insert({
              name: ingredient.name,
              quantity: neededQuantity,
              user_id: 'a5fdafd5-b250-46bc-a3c3-8c6ed6605faa'
            });

          if (insertError) {
            console.error('Error adding item to shopping list:', insertError);
            toast.error(`Failed to add ${ingredient.name} to shopping list`);
            return;
          }
        }
      }

      toast.success('Items added to shopping list!');
      onClose();
      onCloseMainDialog();
      navigate('/shopping-list');
    } catch (error) {
      console.error('Unexpected error adding to shopping list:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Missing Ingredients</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">
            You're missing the following ingredients to cook this recipe:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {missingIngredients.map((ingredient) => (
              <li key={ingredient.id} className="text-muted-foreground">
                {ingredient.requiredQuantity - ingredient.availableQuantity} {ingredient.name}
                <div className="text-sm text-gray-500 ml-2">
                  <div>In pantry: {ingredient.pantryQuantity}</div>
                  <div>In shopping list: {ingredient.shoppingListQuantity}</div>
                  <div>Total needed: {ingredient.requiredQuantity}</div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mb-4">Would you like to add these items to your shopping list?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={addToShoppingList}>
              Add to Shopping List
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};