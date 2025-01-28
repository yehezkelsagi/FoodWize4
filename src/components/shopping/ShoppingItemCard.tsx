import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
}

interface ShoppingItemCardProps {
  item: ShoppingItem;
  onUpdate: () => void;
}

const ShoppingItemCard = ({ item, onUpdate }: ShoppingItemCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedItem, setEditedItem] = useState({
    name: item.name,
    quantity: item.quantity.toString(),
  });

  const handleDelete = async () => {
    const { error } = await supabase
      .from("shopping_list_items")
      .delete()
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to delete item");
      console.error("Error deleting item:", error);
      return;
    }

    onUpdate();
    toast.success("Item removed from shopping list");
  };

  const handleEdit = async () => {
    if (!editedItem.name || !editedItem.quantity) {
      toast.error("Please fill in all fields");
      return;
    }

    const { error } = await supabase
      .from("shopping_list_items")
      .update({
        name: editedItem.name,
        quantity: Number(editedItem.quantity),
      })
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to update item");
      console.error("Error updating item:", error);
      return;
    }

    setIsEditDialogOpen(false);
    onUpdate();
    toast.success("Item updated successfully");
  };

  const toggleCompleted = async () => {
    const { error } = await supabase
      .from("shopping_list_items")
      .update({ completed: !item.completed })
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to update item status");
      console.error("Error updating item status:", error);
      return;
    }

    onUpdate();
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={item.completed}
                onCheckedChange={toggleCompleted}
              />
              <h3 className={`font-semibold text-lg ${item.completed ? 'line-through text-gray-400' : ''}`}>
                {item.name}
              </h3>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          <p className={`text-gray-600 ml-6 ${item.completed ? 'line-through' : ''}`}>
            {item.quantity}
          </p>
        </div>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Shopping List Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editedItem.name}
                onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                placeholder="Item name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-quantity">Quantity (grams)</Label>
              <Input
                id="edit-quantity"
                type="number"
                min="0"
                step="100"
                value={editedItem.quantity}
                onChange={(e) => {
                  const value = Math.max(0, Number(e.target.value));
                  setEditedItem({ ...editedItem, quantity: value.toString() });
                }}
                placeholder="Amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShoppingItemCard;