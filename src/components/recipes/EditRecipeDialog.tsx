import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEditRecipe } from "./edit/useEditRecipe";
import { EditRecipeDialogContent } from "./edit/EditRecipeDialogContent";
import { useState } from "react";

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  prep_time: number | null;
  dietary_type: string | null;
  image_url: string | null;
  servings: number | null;
}

interface EditRecipeDialogProps {
  recipe: Recipe;
  onRecipeUpdated: () => void;
}

const EditRecipeDialog = ({ recipe, onRecipeUpdated }: EditRecipeDialogProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const {
    editedRecipe,
    setEditedRecipe,
    setImageFile,
    handleUpdateRecipe,
  } = useEditRecipe(recipe, () => {
    onRecipeUpdated();
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className={`${isMobile ? 'w-[95vw] h-[90vh]' : 'max-w-2xl max-h-[85vh]'} overflow-hidden`}>
        <DialogHeader>
          <DialogTitle>Edit Recipe</DialogTitle>
        </DialogHeader>
        <EditRecipeDialogContent
          recipeId={recipe.id}
          title={editedRecipe.title}
          description={editedRecipe.description}
          prepTime={editedRecipe.prepTime}
          dietary_type={editedRecipe.dietary_type}
          image_url={recipe.image_url}
          onTitleChange={(title) => setEditedRecipe({ ...editedRecipe, title })}
          onDescriptionChange={(description) => setEditedRecipe({ ...editedRecipe, description })}
          onPrepTimeChange={(prepTime) => setEditedRecipe({ ...editedRecipe, prepTime })}
          onDietaryTypeChange={(dietary_type) => setEditedRecipe({ ...editedRecipe, dietary_type })}
          onImageChange={setImageFile}
          onUpdate={handleUpdateRecipe}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditRecipeDialog;