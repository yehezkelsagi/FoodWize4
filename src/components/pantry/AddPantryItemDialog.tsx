import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AddPantryItemDialogProps {
  onItemAdded: () => void;
}

const AddPantryItemDialog = ({ onItemAdded }: AddPantryItemDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    expirationDate: "",
  });

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.quantity || !newItem.expirationDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const { error } = await supabase.from("pantry_items").insert({
      name: newItem.name,
      quantity: Number(newItem.quantity),
      expiration_date: newItem.expirationDate,
      user_id: "a5fdafd5-b250-46bc-a3c3-8c6ed6605faa"
    });

    if (error) {
      toast.error("Failed to add item");
      console.error("Error adding item:", error);
      return;
    }

    setNewItem({
      name: "",
      quantity: "",
      expirationDate: "",
    });
    setIsDialogOpen(false);
    onItemAdded();
    toast.success("Item added to pantry");
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
          <DialogTitle>Add New Pantry Item</DialogTitle>
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
          <div className="grid gap-2">
            <Label htmlFor="expiration">Expiration Date</Label>
            <Input
              id="expiration"
              type="date"
              value={newItem.expirationDate}
              onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
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

export default AddPantryItemDialog;