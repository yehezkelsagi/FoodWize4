import { useState } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  expiration_date: string;
}

interface PantryItemCardProps {
  item: PantryItem;
  onDelete: () => void;
}

const PantryItemCard = ({ item, onDelete }: PantryItemCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedItem, setEditedItem] = useState({
    name: item.name,
    quantity: item.quantity.toString(),
    expirationDate: item.expiration_date,
  });

  const handleDelete = async () => {
    const { error } = await supabase
      .from("pantry_items")
      .delete()
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to delete item");
      console.error("Error deleting item:", error);
      return;
    }

    onDelete();
    toast.success("Item removed from pantry");
  };

  const handleEdit = async () => {
    if (!editedItem.name || !editedItem.quantity || !editedItem.expirationDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const { error } = await supabase
      .from("pantry_items")
      .update({
        name: editedItem.name,
        quantity: Number(editedItem.quantity),
        expiration_date: editedItem.expirationDate,
      })
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to update item");
      console.error("Error updating item:", error);
      return;
    }

    setIsEditDialogOpen(false);
    onDelete(); // This will trigger a refresh of the items list
    toast.success("Item updated successfully");
  };

  const getExpirationColor = (date: string) => {
    const expirationDate = new Date(date);
    const today = new Date();
    const daysUntilExpiration = Math.floor(
      (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiration < 0) return "text-red-500";
    if (daysUntilExpiration < 7) return "text-orange-500";
    return "text-green-500";
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          <p className="text-gray-600">{item.quantity}</p>
          <div className="flex items-center mt-2">
            <Calendar className="h-4 w-4 mr-2" />
            <span className={`text-sm ${getExpirationColor(item.expiration_date)}`}>
              Expires: {format(new Date(item.expiration_date), "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Pantry Item</DialogTitle>
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
            <div className="grid gap-2">
              <Label htmlFor="edit-expiration">Expiration Date</Label>
              <Input
                id="edit-expiration"
                type="date"
                value={editedItem.expirationDate}
                onChange={(e) => setEditedItem({ ...editedItem, expirationDate: e.target.value })}
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

export default PantryItemCard;