import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import RecipeFilters from "@/components/recipes/RecipeFilters";
import RecipeSearch from "@/components/recipes/RecipeSearch";
import RecipeCard from "@/components/recipes/RecipeCard";
import AddRecipeForm from "@/components/recipes/AddRecipeForm";

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dietaryType, setDietaryType] = useState("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [maxPrepTime, setMaxPrepTime] = useState<number>(120);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: recipes = [], refetch } = useQuery({
    queryKey: ['recipes', showFavorites],
    queryFn: async () => {
      if (showFavorites) {
        const { data, error } = await supabase
          .from('favorite_recipes')
          .select(`
            recipe_id,
            recipes (
              id,
              title,
              description,
              prep_time,
              dietary_type,
              image_url,
              servings
            )
          `)
          .eq('user_id', 'a5fdafd5-b250-46bc-a3c3-8c6ed6605faa');

        if (error) {
          toast.error('Failed to fetch favorite recipes');
          throw error;
        }

        return data.map(item => item.recipes) || [];
      } else {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          toast.error('Failed to fetch recipes');
          throw error;
        }
        
        return data || [];
      }
    },
  });

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiet = dietaryType === "all" || recipe.dietary_type === dietaryType;
    const matchesPrepTime = !recipe.prep_time || recipe.prep_time <= maxPrepTime;
    return matchesSearch && matchesDiet && matchesPrepTime;
  });

  return (
    <div className="min-h-screen bg-[#E5DFD7]">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#F97316]">Recipes</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
                size="lg"
              >
                <Plus className="mr-2" />
                Add Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Recipe</DialogTitle>
              </DialogHeader>
              <AddRecipeForm 
                onClose={() => setIsDialogOpen(false)}
                onSuccess={refetch}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <RecipeSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <RecipeFilters 
            dietaryType={dietaryType}
            onDietaryTypeChange={setDietaryType}
            showFavorites={showFavorites}
            onShowFavoritesChange={setShowFavorites}
            maxPrepTime={maxPrepTime}
            onMaxPrepTimeChange={setMaxPrepTime}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              {...recipe} 
              onUpdate={refetch}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recipes;