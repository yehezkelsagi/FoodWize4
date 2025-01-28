import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pantryItems, openAIKey } = await req.json();
    
    if (!pantryItems || !Array.isArray(pantryItems)) {
      console.error('Invalid pantry items:', pantryItems);
      throw new Error('Invalid pantry items provided');
    }

    const ingredients = pantryItems.map((item) => item.name).join(', ');
    console.log('Ingredients being sent to OpenAI:', ingredients);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get a random existing recipe image URL
    const { data: existingRecipe } = await supabase
      .from('recipes')
      .select('image_url')
      .not('image_url', 'is', null)
      .limit(1)
      .single();

    const imageUrl = existingRecipe?.image_url || null;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful chef assistant that generates recipes based on available ingredients. 
            Format your response in JSON with the following structure:
            {
              "title": "Recipe Title",
              "description": "A brief 4-line description of the recipe",
              "ingredients": [
                {
                  "name": "ingredient name",
                  "quantity": number in grams
                }
              ],
              "instructions": "Step by step cooking instructions"
            }`
          },
          {
            role: 'user',
            content: `Create a recipe using some or all of these ingredients: ${ingredients}. 
            Make sure the description is no more than 4 lines long.
            Ensure all ingredient quantities are in grams.
            Format the response as specified in the system message.`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    // Parse the JSON response
    const recipeData = JSON.parse(generatedContent);
    
    // Add the image URL to the recipe data
    const finalRecipe = {
      ...recipeData,
      image_url: imageUrl
    };

    return new Response(
      JSON.stringify({ recipe: JSON.stringify(finalRecipe) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-recipe function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});