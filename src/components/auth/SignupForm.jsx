import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import GoogleAuthButton from "./GoogleAuthButton";
import { useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

export function SignupForm({ className, ...props }) {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const navigate = useNavigate();
  const { API } = useGlobalContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(API + "/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }
      sessionStorage.setItem("accessToken", JSON.stringify(data.token));

      if (redirect) {
        navigate(redirect);
      } else {
        navigate("/workshop/" + data.user.currentWorkshop);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your name, email and password below to create your account
        </p>
      </div>
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md text-sm text-center">
          {error}
        </div>
      )}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Tony Stark"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <GoogleAuthButton type={"register"} />
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link
          to={`/auth/login${redirect === "" ? "" : `?redirect=${redirect}`}`}
          className="underline underline-offset-4"
        >
          Login
        </Link>
      </div>
    </form>
  );
}
