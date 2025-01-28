export interface Ingredient {
  name: string;
  quantity: number;
}

export interface RecipeFormData {
  title: string;
  description: string;
  prepTime: string;
  servings: string;
  dietary_type: string;
  imageFile?: File;
}

export interface AddRecipeFormProps {
  onClose: () => void;
  onSuccess: () => void;
}