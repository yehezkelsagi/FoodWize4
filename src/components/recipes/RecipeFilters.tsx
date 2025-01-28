import { Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface RecipeFiltersProps {
  dietaryType: string;
  onDietaryTypeChange: (value: string) => void;
  showFavorites: boolean;
  onShowFavoritesChange: (value: boolean) => void;
  maxPrepTime: number;
  onMaxPrepTimeChange: (value: number) => void;
}

const RecipeFilters = ({ 
  dietaryType, 
  onDietaryTypeChange, 
  showFavorites, 
  onShowFavoritesChange,
  maxPrepTime,
  onMaxPrepTimeChange
}: RecipeFiltersProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleCheckboxChange = (type: string) => {
    let newTypes: string[];
    if (selectedTypes.includes(type)) {
      newTypes = selectedTypes.filter(t => t !== type);
    } else {
      newTypes = [...selectedTypes, type];
    }
    setSelectedTypes(newTypes);
    
    if (newTypes.length === 0) {
      onDietaryTypeChange('all');
    } else if (newTypes.length === 1) {
      onDietaryTypeChange(newTypes[0]);
    }
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="border-2">
            <Filter className="mr-2" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Dietary Preferences</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="carnivore" 
                    checked={selectedTypes.includes('carnivore')}
                    onCheckedChange={() => handleCheckboxChange('carnivore')}
                  />
                  <Label htmlFor="carnivore">Carnivore</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vegetarian" 
                    checked={selectedTypes.includes('vegetarian')}
                    onCheckedChange={() => handleCheckboxChange('vegetarian')}
                  />
                  <Label htmlFor="vegetarian">Vegetarian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vegan" 
                    checked={selectedTypes.includes('vegan')}
                    onCheckedChange={() => handleCheckboxChange('vegan')}
                  />
                  <Label htmlFor="vegan">Vegan</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium leading-none">Maximum Preparation Time</h4>
              <div className="space-y-4">
                <Slider
                  value={[maxPrepTime]}
                  max={120}
                  step={5}
                  onValueChange={(value) => onMaxPrepTimeChange(value[0])}
                />
                <div className="text-sm text-muted-foreground text-center">
                  {maxPrepTime} minutes
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button 
        variant={showFavorites ? "default" : "outline"} 
        onClick={() => onShowFavoritesChange(!showFavorites)}
        className={showFavorites ? "bg-yellow-500 hover:bg-yellow-600" : ""}
      >
        <Star className="mr-2" fill={showFavorites ? "currentColor" : "none"} />
        Saved
      </Button>
    </div>
  );
};

export default RecipeFilters;