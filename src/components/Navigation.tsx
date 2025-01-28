import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, ShoppingCart, Book, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <nav className="fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex flex-col h-full justify-between p-4">
        <div className="flex flex-col space-y-4">
          <Link
            to="/"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive("/")
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
          >
            <Home size={24} />
            <span className="text-lg">Home</span>
          </Link>
          <Link
            to="/recipes"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive("/recipes")
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
          >
            <Book size={24} />
            <span className="text-lg">Recipes</span>
          </Link>
          <Link
            to="/pantry"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive("/pantry")
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
          >
            <Home size={24} />
            <span className="text-lg">Pantry</span>
          </Link>
          <Link
            to="/shopping-list"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive("/shopping-list")
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
          >
            <ShoppingCart size={24} />
            <span className="text-lg">Shopping List</span>
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-secondary w-full mt-auto"
        >
          <LogOut size={24} />
          <span className="text-lg">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;