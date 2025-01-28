import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RecipeImageProps {
  image_url: string | null;
  title: string;
  onClick: () => void;
}

const RecipeImage = ({ image_url, title, onClick }: RecipeImageProps) => {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (!image_url) return '/placeholder.svg';
    
    try {
      if (image_url.startsWith('http')) {
        return image_url;
      }
      
      const { data } = supabase.storage
        .from('recipe_images')
        .getPublicUrl(image_url.replace(/^\//, ''));
      
      return data?.publicUrl || '/placeholder.svg';
    } catch (error) {
      console.error('Error getting image URL:', error);
      return '/placeholder.svg';
    }
  };

  return (
    <div 
      className="relative w-full h-48 bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={imageError ? '/placeholder.svg' : getImageUrl()}
        alt={title}
        className="w-full h-full object-cover"
        onError={() => {
          console.error('Failed to load image:', image_url);
          setImageError(true);
        }}
      />
    </div>
  );
};

export default RecipeImage;