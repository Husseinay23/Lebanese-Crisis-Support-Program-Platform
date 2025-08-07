import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Newspaper, HandHeart, Building2, Map, LogIn, Sun, Moon, LayoutDashboard, Shield, ShoppingBasket } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from "@/components/ui/Button";
import { useAuth } from "../contexts/AuthContext"; 


// Define routes for the Navbar
const routes = [
  { label: "Home", icon: Home, href: "/", color: "text-sky-500" },
  { label: "Support", icon: Heart, href: "/support", color: "text-red-500" },
  { label: "News", icon: Newspaper, href: "/news", color: "text-yellow-500" },
  { label: "Needs & Wants", icon: HandHeart, href: "/needs-wants", color: "text-green-500" },
  { label: "Shop Channel", icon: ShoppingBasket, href: "/shop-channel", color: "text-blue-500" },
  { label: "Organizations", icon: Building2, href: "/organizations", color: "text-purple-500" },
  { label: "Resource Map", icon: Map, href: "/resource-map", color: "text-pink-500" },
  { label: "Login", icon: LogIn, href: "/login", color: "text-blue-500" },
];

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth(); // Get user from AuthContext
  const [userRole, setUserRole] = useState(null);

 

 
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-4 lg:space-x-6">
          {routes.map((route) => {
            // Hide login button when authenticated
            

            return (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "flex items-center gap-x-2 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === route.href
                    ? "text-black dark:text-white"
                    : "text-muted-foreground"
                )}
              >
                <route.icon className={cn("h-4 w-4", route.color)} />
                <span className="hidden md:block">{route.label}</span>
              </Link>
            );
          })}

          {/* Conditionally render the Dashboard link based on user role */}
          {userRole && (
            <>
              {userRole === 'user' && (
                <Link
                  to="/dashboard"
                  className={cn(
                    "flex items-center gap-x-2 text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === "/dashboard"
                      ? "text-black dark:text-white"
                      : "text-muted-foreground"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4 text-orange-500" />
                  <span className="hidden md:block">Dashboard</span>
                </Link>
              )}

              {userRole === 'admin' && (
                <Link
                  to="/admin"
                  className={cn(
                    "flex items-center gap-x-2 text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === "/admin"
                      ? "text-black dark:text-white"
                      : "text-muted-foreground"
                  )}
                >
                  <Shield className="h-4 w-4 text-red-500" />
                  <span className="hidden md:block">Admin Dashboard</span>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            aria-label="Toggle Theme"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-blue-500" />
            ) : (
              <Sun className="h-5 w-5 text-yellow-500" />
            )}
          </Button>
        </div>
      </nav>
    </header>
  );
}
