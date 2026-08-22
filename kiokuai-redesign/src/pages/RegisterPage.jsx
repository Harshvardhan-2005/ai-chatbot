import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/button";
import Field from "../components/ui/input";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

function RegisterPage() {
  const navigate = useNavigate();

  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
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

    if (formData.username.trim().length < 3) {
      nextErrors.username = "Username must contain at least 3 characters.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (formData.password.length < 8) {
      nextErrors.password = "Password must contain at least 8 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success("Account created. You can now sign in.");

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to create your account."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Get started
          </p>

          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Create your KiokuAI account
          </h1>

          <p className="text-sm text-muted-foreground">
            Start creating assistants and grounding them with your knowledge.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="harshvardhan"
            autoComplete="username"
          />

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
            helperText={errors.password ? undefined : "Use at least 8 characters."}
            placeholder="Create a password"
            autoComplete="new-password"
          />

          <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
