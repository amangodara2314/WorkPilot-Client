import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="space-y-6 max-w-md">
        <FileQuestion className="h-24 w-24 mx-auto text-gray-400" />

        <h1 className="text-7xl font-bold text-gray-900">404</h1>

        <h2 className="text-2xl font-semibold tracking-tight">
          Page not found
        </h2>

        <p className="text-gray-500">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or deleted.
        </p>

        <Button asChild size="lg" className="mt-4">
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
