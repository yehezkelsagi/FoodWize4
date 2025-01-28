interface RecipeContentProps {
  description: string;
  prep_time: number | null;
  onClick: () => void;
}

const RecipeContent = ({ description, prep_time, onClick }: RecipeContentProps) => {
  return (
    <>
      <p 
        className="text-gray-600 text-sm mt-1 cursor-pointer"
        onClick={onClick}
      >
        {description}
      </p>
      <p className="text-accent text-sm mt-2">
        {prep_time ? `${prep_time} mins` : 'Prep time not specified'}
      </p>
    </>
  );
};

export default RecipeContent;