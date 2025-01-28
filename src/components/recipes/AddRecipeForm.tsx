import { AddRecipeFormProps } from "./types/recipe";
import RecipeDetailsForm from "./form/RecipeDetailsForm";
import IngredientsForm from "./form/IngredientsForm";
import FormActions from "./form/FormActions";
import { useRecipeForm } from "./hooks/useRecipeForm";

const AddRecipeForm = ({ onClose, onSuccess }: AddRecipeFormProps) => {
  const {
    ingredients,
    newRecipe,
    setNewRecipe,
    addIngredient,
    removeIngredient,
    updateIngredient,
    handleAddRecipe,
  } = useRecipeForm(onClose, onSuccess);

  return (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
      <RecipeDetailsForm
        details={newRecipe}
        onChange={setNewRecipe}
      />
      <IngredientsForm
        ingredients={ingredients}
        onIngredientChange={updateIngredient}
        onAddIngredient={addIngredient}
        onRemoveIngredient={removeIngredient}
      />
      <FormActions
        onClose={onClose}
        onSubmit={handleAddRecipe}
      />
    </div>
  );
};

export default AddRecipeForm;