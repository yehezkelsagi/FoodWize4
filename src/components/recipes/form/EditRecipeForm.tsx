import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "./ImageUpload";

interface EditRecipeFormProps {
  title: string;
  description: string;
  prepTime: string;
  dietary_type: string;
  image_url: string | null;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPrepTimeChange: (value: string) => void;
  onDietaryTypeChange: (value: string) => void;
  onImageChange: (file: File | null) => void;
}

const EditRecipeForm = ({
  title,
  description,
  prepTime,
  dietary_type,
  image_url,
  onTitleChange,
  onDescriptionChange,
  onPrepTimeChange,
  onDietaryTypeChange,
  onImageChange,
}: EditRecipeFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
      <ImageUpload
        currentImageUrl={image_url}
        onImageChange={onImageChange}
      />
      <div className="grid gap-2">
        <Label htmlFor="prepTime">Prep Time (minutes)</Label>
        <Input
          id="prepTime"
          type="number"
          value={prepTime}
          onChange={(e) => onPrepTimeChange(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="dietary_type">Dietary Type</Label>
        <Select
          value={dietary_type}
          onValueChange={onDietaryTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select dietary type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="carnivore">Carnivore</SelectItem>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="vegan">Vegan</SelectItem>
            <SelectItem value="pescatarian">Pescatarian</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EditRecipeForm;