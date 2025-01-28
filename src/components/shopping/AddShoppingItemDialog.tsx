import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AddShoppingItemDialogProps {
  onItemAdded: () => void;
}

const AddShoppingItemDialog = ({ onItemAdded }: AddShoppingItemDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
  });

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.quantity) {
      toast.error("Please fill in all fields");
      return;
    }

    // First, check if the item already exists
    const { data: existingItems, error: fetchError } = await supabase
      .from("shopping_list_items")
      .select("*")
      .eq("name", newItem.name)
      .eq("user_id", "a5fdafd5-b250-46bc-a3c3-8c6ed6605faa");

    if (fetchError) {
      toast.error("Failed to check existing items");
      console.error("Error checking existing items:", fetchError);
      return;
    }

    if (existingItems && existingItems.length > 0) {
      // Item exists, update its quantity
      const existingItem = existingItems[0];
      const newQuantity = Number(existingItem.quantity) + Number(newItem.quantity);

      const { error: updateError } = await supabase
        .from("shopping_list_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id);

      if (updateError) {
        toast.error("Failed to update item quantity");
        console.error("Error updating item:", updateError);
        return;
      }

      toast.success("Item quantity updated in shopping list");
    } else {
      // Item doesn't exist, create new entry
      const { error: insertError } = await supabase
        .from("shopping_list_items")
        .insert({
          name: newItem.name,
          quantity: Number(newItem.quantity),
          user_id: "a5fdafd5-b250-46bc-a3c3-8c6ed6605faa"
        });

      if (insertError) {
        toast.error("Failed to add item");
        console.error("Error adding item:", insertError);
        return;
      }

      toast.success("Item added to shopping list");
    }

    setNewItem({
      name: "",
      quantity: "",
    });
    setIsDialogOpen(false);
    onItemAdded();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#F97316] hover:bg-[#F97316]/90 text-white" size="lg">
          <Plus className="mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Shopping List Item</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Item name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity (grams)</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              step="100"
              value={newItem.quantity}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                setNewItem({ ...newItem, quantity: value.toString() });
              }}
              placeholder="Amount"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddItem}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddShoppingItemDialog;