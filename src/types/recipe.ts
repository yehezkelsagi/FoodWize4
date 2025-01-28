export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  prep_time: number | null;
  dietary_type: string | null;
  servings: number | null;
  image_url: string | null;
}