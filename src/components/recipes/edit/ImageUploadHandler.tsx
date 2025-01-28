import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadHandlerProps {
  currentImageUrl: string | null;
  onImageUploaded: (url: string) => void;
}

export const useImageUpload = (currentImageUrl: string | null) => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return currentImageUrl;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('recipe_images')
        .upload(fileName, imageFile, {
          upsert: false,
          contentType: imageFile.type,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        toast.error('Failed to upload image. Please try again.');
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('recipe_images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error in image upload:', error);
      toast.error('Failed to process image upload');
      return null;
    }
  };

  return {
    imageFile,
    setImageFile,
    handleImageUpload,
  };
};