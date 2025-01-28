import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Sarah Chen",
    username: "@chefathome",
    body: "Pantry Palette transformed how I cook! The ingredient tracking is a game-changer - no more forgotten items expiring in my fridge.",
    img: "https://avatar.vercel.sh/sarahchen",
  },
  {
    name: "Marcus Rodriguez",
    username: "@foodiedev",
    body: "Finally, an app that understands home cooking! The recipe suggestions based on my pantry items have saved me countless trips to the store.",
    img: "https://avatar.vercel.sh/marcusrodriguez",
  },
  {
    name: "Emma Thompson",
    username: "@healthyeats",
    body: "Love how it helps me plan meals around what I already have. The UI is beautiful and intuitive - exactly what I needed in my kitchen!",
    img: "https://avatar.vercel.sh/emmathompson",
  },
  {
    name: "David Park",
    username: "@cuisinemaster",
    body: "The shopping list feature synced with recipes is brilliant. It's like having a sous chef helping me stay organized!",
    img: "https://avatar.vercel.sh/davidpark",
  },
  {
    name: "Priya Patel",
    username: "@spicekitchen",
    body: "This app has helped me reduce food waste significantly. The expiration date reminders are so helpful!",
    img: "https://avatar.vercel.sh/priyapatel",
  },
  {
    name: "Tom Wilson",
    username: "@newcook",
    body: "As a beginner cook, this app gives me confidence in the kitchen. The recipe recommendations are always spot-on!",
    img: "https://avatar.vercel.sh/tomwilson",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-80 cursor-pointer overflow-hidden rounded-xl border p-6 mx-4",
        "border-primary/20 bg-orange-50/30 hover:bg-orange-50/50",
        "dark:border-secondary/20 dark:bg-secondary/5 dark:hover:bg-secondary/10",
        "transform transition-all duration-300 hover:scale-105"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <img 
          className="rounded-full border-2 border-primary/20" 
          width="48" 
          height="48" 
          alt="" 
          src={img} 
        />
        <div className="flex flex-col">
          <figcaption className="text-base font-semibold text-primary">
            {name}
          </figcaption>
          <p className="text-sm font-medium text-primary/60">{username}</p>
        </div>
      </div>
      <blockquote className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {body}
      </blockquote>
    </figure>
  );
};

export function Testimonials() {
  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          Loved by Home Chefs
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of happy cooks who have transformed their kitchen experience with Pantry Palette
        </p>
      </div>
      
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg">
        <Marquee className="[--duration:40s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse className="[--duration:35s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
      </div>
    </div>
  );
}