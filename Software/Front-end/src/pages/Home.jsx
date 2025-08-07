import { Link } from 'react-router-dom';
import { Heart, Newspaper, HandHeart, Building2, Map, ShoppingBasket } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { cn } from '@/lib/utils';


const features = [
  {
    title: "Support Services",
    description: "Access emergency services, shelter, medical care, and essential resources.",
    icon: Heart,
    href: "/support",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/50",
  },
  {
    title: "Latest News",
    description: "Stay informed with real-time updates and critical information.",
    icon: Newspaper,
    href: "/news",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/50",
  },
  {
    title: "Needs & Wants",
    description: "Connect with people offering or seeking specific assistance.",
    icon: HandHeart,
    href: "/needs-wants",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/50",
  },
  {
    title: "Shop Channel",
    description: "Marketplace for goods and services during emergencies.",
    icon: ShoppingBasket,
    href: "/needs-wants",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
  },
  {
    title: "Support Organizations",
    description: "Find and connect with organizations providing aid and support.",
    icon: Building2,
    href: "/organizations",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
  },
  {
    title: "Resource Map",
    description: "Locate nearby support services and resources on an interactive map.",
    icon: Map,
    href: "/resource-map",
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/50",
  },
];

export default function HomePage() {
  

  return (
    <div className="flex flex-col items-center">
      
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[url('https://imageio.forbes.com/specials-images/imageserve/1219327413/TOPSHOT-LEBANON-POLITICS-ECONOMY-CURRENCY-DEMO/960x0.jpg?format=jpg&width=1440')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Lebanon Crisis Support Platform
              </h1>
              <p className="mx-auto max-w-[700px] text-white md:text-xl">
                Connecting those in need with those who can help during the crisis
              </p>
            </div>
            <div className="space-x-4">
              <Link to="/organizations">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Donate Now
                </Button>
              </Link>
              <Link to="/support">
                <Button size="lg" variant="outline" className="bg-white hover:bg-gray-100 text-gray-900 dark:text-black dark:hover:bg-gray-800 dark:hover:text-white">
                  Request Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.title} to={feature.href}>
              <Card className="h-full transition-transform hover:scale-105">
                <CardHeader>
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", feature.bgColor)}>
                    <feature.icon className={cn("w-6 h-6", feature.color)} />
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
