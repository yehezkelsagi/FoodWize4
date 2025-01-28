import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface FormActionsProps {
  onClose: () => void;
  onSubmit: () => void;
}

const FormActions = ({ onClose, onSubmit }: FormActionsProps) => {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={onSubmit}>Add Recipe</Button>
    </DialogFooter>
  );
};

export default FormActions;