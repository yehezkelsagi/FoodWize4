import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface RecipeNotesProps {
  recipeId: string;
}

interface Note {
  id: string;
  note: string;
  created_at: string;
}

export const RecipeNotes = ({ recipeId }: RecipeNotesProps) => {
  const [newNote, setNewNote] = useState("");

  const { data: notes = [], refetch } = useQuery({
    queryKey: ['recipe-notes', recipeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipe_notes')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Note[];
    },
  });

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      const { error } = await supabase
        .from('recipe_notes')
        .insert([
          {
            recipe_id: recipeId,
            note: newNote.trim(),
            user_id: 'a5fdafd5-b250-46bc-a3c3-8c6ed6605faa'
          }
        ]);

      if (error) throw error;

      toast.success('Note added successfully!');
      setNewNote("");
      refetch();
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('recipe_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      toast.success('Note deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Notes</h3>
      <div className="space-y-2">
        <Textarea
          placeholder="Add a personal note about this recipe..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={handleAddNote} className="w-full">
          Add Note
        </Button>
      </div>
      
      <div className="space-y-4 mt-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-gray-50 p-4 rounded-lg space-y-2"
          >
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-600">
                {new Date(note.created_at).toLocaleDateString()}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteNote(note.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
            <p className="text-gray-800">{note.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
};