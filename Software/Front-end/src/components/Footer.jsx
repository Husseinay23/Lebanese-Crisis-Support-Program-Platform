import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2024 Lebanon Crisis Support Platform. All rights reserved.
        </p>
      
      </div>
    </footer>
  );
}