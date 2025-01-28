import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImageUrl: string | null;
  onImageChange: (file: File | null) => void;
}

const ImageUpload = ({ currentImageUrl, onImageChange }: ImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(currentImageUrl);

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

    onImageChange(file);
  };

  return (
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
  );
};

export default ImageUpload;