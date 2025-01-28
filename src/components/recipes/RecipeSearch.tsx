import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import RecipeGenerationDialog from "./generation/RecipeGenerationDialog";

interface RecipeSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const RecipeSearch = ({ searchTerm, onSearchChange }: RecipeSearchProps) => {
  const [showGenerationDialog, setShowGenerationDialog] = useState(false);

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
        <p className="text-sm text-gray-500 mt-2">
          Enter ingredients separated by commas (e.g., chicken, rice, tomatoes)
        </p>
      </div>
      <Button 
        className="bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white hover:opacity-90"
        onClick={() => setShowGenerationDialog(true)}
      >
        <Sparkles className="mr-2" />
        Generate with AI
      </Button>
      <Button variant="default" className="bg-black hover:bg-black/90 text-white">
        <Search className="mr-2" />
        Search
      </Button>

      <RecipeGenerationDialog
        isOpen={showGenerationDialog}
        onClose={() => setShowGenerationDialog(false)}
        onSuccess={() => setShowGenerationDialog(false)}
      />
    </div>
  );
};

export default RecipeSearch;