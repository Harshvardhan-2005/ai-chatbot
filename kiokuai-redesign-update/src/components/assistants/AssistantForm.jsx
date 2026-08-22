import { useState } from "react";

import Button from "../ui/button";
import Field from "../ui/input";
import Switch from "../ui/switch";
import Textarea from "../ui/textarea";

const INITIAL_FORM_STATE = {
  name: "",
  description: "",
  model_name: "",
  is_active: true,
};

function getInitialFormState(assistant) {
  if (!assistant) {
    return INITIAL_FORM_STATE;
  }

  return {
    name: assistant.name ?? "",
    description: assistant.description ?? "",
    model_name: assistant.model_name ?? "",
    is_active: assistant.is_active ?? true,
  };
}

function AssistantForm({ assistant = null, onSubmit, onCancel, isSubmitting = false }) {
  const [formData, setFormData] = useState(() => getInitialFormState(assistant));
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(assistant);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    const name = formData.name.trim();
    const description = formData.description.trim();
    const modelName = formData.model_name.trim();

    if (name.length < 3) {
      nextErrors.name = "Name must contain at least 3 characters.";
    }

    if (name.length > 100) {
      nextErrors.name = "Name cannot exceed 100 characters.";
    }

    if (description.length < 5) {
      nextErrors.description = "Description must contain at least 5 characters.";
    }

    if (description.length > 500) {
      nextErrors.description = "Description cannot exceed 500 characters.";
    }

    if (modelName.length < 2) {
      nextErrors.model_name = "Model name must contain at least 2 characters.";
    }

    if (modelName.length > 50) {
      nextErrors.model_name = "Model name cannot exceed 50 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      model_name: formData.model_name.trim(),
    };

    if (isEditing) {
      payload.is_active = formData.is_active;
    }

    await onSubmit(payload);
  };

  return (
    <form className="flex flex-col gap-4 p-5" onSubmit={handleSubmit}>
      <Field
        label="Assistant name"
        name="name"
        type="text"
        placeholder="Customer Support Assistant"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        maxLength={100}
        autoFocus
      />

      <Textarea
        label="Description"
        name="description"
        placeholder="Describe what this assistant is designed to do."
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        helperText={
          errors.description ? undefined : `${formData.description.length}/500 characters`
        }
        maxLength={500}
        rows={4}
      />

      <Field
        label="Model name"
        name="model_name"
        type="text"
        placeholder="llama-3.3-70b-versatile"
        value={formData.model_name}
        onChange={handleChange}
        error={errors.model_name}
        helperText={
          errors.model_name ? undefined : "Enter the model identifier used by your backend."
        }
        maxLength={50}
      />

      {isEditing ? (
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">Active assistant</p>
            <p className="text-xs text-muted-foreground">
              Allow this assistant to remain active in the workspace.
            </p>
          </div>

          <Switch
            checked={formData.is_active}
            onChange={(checked) =>
              setFormData((current) => ({ ...current, is_active: checked }))
            }
          />
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? "Save changes" : "Create assistant"}
        </Button>
      </div>
    </form>
  );
}

export default AssistantForm;
