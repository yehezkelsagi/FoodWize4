import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RecipeFormData } from "../types/recipe";
import { useState } from "react";
import { toast } from "sonner";

interface RecipeDetailsFormProps {
  details: RecipeFormData;
  onChange: (details: RecipeFormData) => void;
}

const RecipeDetailsForm = ({ details, onChange }: RecipeDetailsFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Update form data with the file
    onChange({ ...details, imageFile: file });
  };

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="title">Recipe Title</Label>
        <Input
          id="title"
          placeholder="Enter recipe title"
          value={details.title}
          onChange={(e) => onChange({ ...details, title: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter recipe description"
          value={details.description}
          onChange={(e) => onChange({ ...details, description: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image">Recipe Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="cursor-pointer"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Recipe preview"
              className="w-full max-w-[200px] h-auto rounded-md"
            />
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="prepTime">Prep Time (minutes)</Label>
        <Input
          id="prepTime"
          type="number"
          min="0"
          placeholder="Enter prep time"
          value={details.prepTime}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || parseInt(value) >= 0) {
              onChange({ ...details, prepTime: value });
            }
          }}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="servings">Servings</Label>
        <Input
          id="servings"
          type="number"
          min="0"
          placeholder="Enter number of servings"
          value={details.servings}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || parseInt(value) >= 0) {
              onChange({ ...details, servings: value });
            }
          }}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="dietary_type">Dietary Type</Label>
        <select
          id="dietary_type"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          value={details.dietary_type}
          onChange={(e) => onChange({ ...details, dietary_type: e.target.value })}
        >
          <option value="carnivore">Carnivore</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
      </div>
    </>
  );
};

export default RecipeDetailsForm;