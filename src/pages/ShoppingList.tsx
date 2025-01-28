import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import AddShoppingItemDialog from "@/components/shopping/AddShoppingItemDialog";
import ShoppingItemCard from "@/components/shopping/ShoppingItemCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
}

const ShoppingList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch shopping list items
  const { data: items = [], isLoading, refetch: fetchItems } = useQuery({
    queryKey: ['shopping-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shopping_list_items")
        .select("*")
        .eq("user_id", "a5fdafd5-b250-46bc-a3c3-8c6ed6605faa")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching shopping items:", error);
        toast.error("Failed to load shopping list items");
        throw error;
      }

      return data as ShoppingItem[];
    },
  });

  // Filter items based on search term only
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel('shopping_list_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_list_items'
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems]);

  return (
    <div className="min-h-screen bg-[#E5DFD7]">
      <div className="container mx-auto p-4 pb-20 md:pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Shopping List</h1>
          <AddShoppingItemDialog onItemAdded={() => fetchItems()} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
          <Input
            type="text"
            placeholder="Search shopping list items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="text-gray-400" />}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading shopping list...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {searchTerm ? "No items match your search." : "Your shopping list is empty. Add some items to get started!"}
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-200px)] mt-6">
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <ShoppingItemCard
                  key={item.id}
                  item={item}
                  onUpdate={() => fetchItems()}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;