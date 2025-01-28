import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, Apple, Book, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RecipeCard from "@/components/recipes/RecipeCard";
import { motion } from "framer-motion";
import { Testimonials } from "@/components/home/Testimonials";
import { Card } from "@/components/ui/card";

const Home = () => {
  const navigate = useNavigate();

  const { data: cookedRecipes } = useQuery({
    queryKey: ["cooked-recipes"],
    queryFn: async () => {
      const { data: cookedRecipes, error } = await supabase
        .from("cooked_recipes")
        .select(`
          *,
          recipe:recipes(*)
        `)
        .order("cooked_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return cookedRecipes;
    },
  });

  const { data: recipesCount } = useQuery({
    queryKey: ["favorite-recipes-count"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorite_recipes")
        .select("*");

      if (error) throw error;
      return data?.length || 0;
    },
  });

  const { data: pantryCount } = useQuery({
    queryKey: ["pantry-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("pantry_items")
        .select("*", { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  const { data: shoppingListCount } = useQuery({
    queryKey: ["shopping-list-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("shopping_list_items")
        .select("*", { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <div className="min-h-screen -mt-8 -mx-8 px-8 pt-8 space-y-12 bg-gradient-to-b from-orange-50 to-white">
      <div className="relative">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to FoodWize
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="max-w-2xl mx-auto">
              <p className="text-xl text-muted-foreground mb-8">
                Your personal culinary companion that makes cooking a delightful adventure. 
                You've saved {recipesCount} {recipesCount === 1 ? 'recipe' : 'recipes'} so far!
              </p>
              
              <div className="mb-16">
                <Button
                  size="lg"
                  onClick={() => navigate("/recipes")}
                  className="bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-xl py-6"
                >
                  <ChefHat className="mr-2 h-6 w-6" />
                  Let's Cook Something
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12"
          >
            <Card 
              className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate("/pantry")}
            >
              <Apple className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">{pantryCount || 0}</h3>
              <p className="text-muted-foreground">Pantry Items</p>
            </Card>
            <Card 
              className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate("/recipes")}
            >
              <Book className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">{recipesCount || 0}</h3>
              <p className="text-muted-foreground">Saved Recipes</p>
            </Card>
            <Card 
              className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate("/shopping-list")}
            >
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">{shoppingListCount || 0}</h3>
              <p className="text-muted-foreground">Shopping List Items</p>
            </Card>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10" />
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {cookedRecipes && cookedRecipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6 py-8"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <h2 className="text-3xl font-semibold text-center">Recently Cooked</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cookedRecipes.map((item, index) => (
              <motion.div
                key={`${item.recipe.id}-${item.cooked_at}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
              >
                <RecipeCard
                  id={item.recipe.id}
                  title={item.recipe.title}
                  description={item.recipe.description || ""}
                  image_url={item.recipe.image_url}
                  prep_time={item.recipe.prep_time}
                  dietary_type={item.recipe.dietary_type}
                  servings={item.recipe.servings}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
