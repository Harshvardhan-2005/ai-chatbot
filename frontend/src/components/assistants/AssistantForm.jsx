import { useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";

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

function AssistantForm({
  assistant = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() =>
    getInitialFormState(assistant),
  );

  const [errors, setErrors] = useState({});

  const isEditing = Boolean(assistant);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
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
      nextErrors.description =
        "Description must contain at least 5 characters.";
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

    if (!validate()) {
      return;
    }

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
    <form className="assistant-form" onSubmit={handleSubmit}>
      <Input
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

      <div className="form-field">
        <label className="form-label" htmlFor="assistant-description">
          Description
        </label>

        <textarea
          id="assistant-description"
          name="description"
          className={[
            "form-textarea",
            errors.description ? "form-textarea--error" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          placeholder="Describe what this assistant is designed to do."
          value={formData.description}
          onChange={handleChange}
          maxLength={500}
          rows={5}
        />

        {errors.description ? (
          <p className="form-error">{errors.description}</p>
        ) : (
          <p className="form-helper">
            {formData.description.length}/500 characters
          </p>
        )}
      </div>

      <Input
        label="Model name"
        name="model_name"
        type="text"
        placeholder="llama-3.3-70b-versatile"
        value={formData.model_name}
        onChange={handleChange}
        error={errors.model_name}
        helperText="Enter the model identifier used by your backend."
        maxLength={50}
      />

      {isEditing ? (
        <label className="assistant-form__status">
          <div>
            <strong>Active assistant</strong>

            <span>Allow this assistant to remain active in the workspace.</span>
          </div>

          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
        </label>
      ) : null}

      <div className="assistant-form__actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
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
