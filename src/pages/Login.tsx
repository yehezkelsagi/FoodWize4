import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/foodwize-uploads/a432774a-5e28-4c2c-9fb4-343a2771aa17.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay to make the background image darker */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="w-full max-w-md bg-white/95 rounded-xl shadow-2xl p-8 relative">
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-primary text-center">
            Welcome to Foodwise
          </h1>
          <p className="text-center text-gray-600">
            Your personal recipe management companion
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#E8955A',
                  brandAccent: '#D67D42',
                  inputBackground: 'white',
                  inputText: '#333333',
                }
              }
            },
            className: {
              container: 'space-y-4',
              button: 'rounded-lg hover:opacity-90 transition-opacity',
              input: 'rounded-lg border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent',
              label: 'text-sm font-medium text-gray-700',
              message: 'text-sm text-gray-600',
              anchor: 'text-primary hover:text-primary/80 transition-colors'
            }
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Login;