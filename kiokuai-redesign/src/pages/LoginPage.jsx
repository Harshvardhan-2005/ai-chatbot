import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/button";
import Field from "../components/ui/input";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/overview" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success("Welcome back.");

      const destination = location.state?.from?.pathname || "/overview";

      navigate(destination, { replace: true });
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Unable to sign in. Please check your credentials."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Welcome back
          </p>

          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Sign in to KiokuAI
          </h1>

          <p className="text-sm text-muted-foreground">
            Continue building and testing your AI assistants.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <Field
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          New to KiokuAI?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
