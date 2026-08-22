import { useState } from "react";

import Button from "../ui/button";
import Field from "../ui/input";
import Select from "../ui/select";
import Textarea from "../ui/textarea";

const EMPTY_FORM = {
  title: "",
  source_type: "text",
  content: "",
};

function getInitialFormData(knowledge) {
  if (!knowledge) return EMPTY_FORM;

  return {
    title: knowledge.title ?? "",
    source_type: knowledge.source_type ?? "text",
    content: knowledge.content ?? "",
  };
}

function KnowledgeForm({ knowledge, onSubmit, onCancel, isSubmitting = false }) {
  const [formData, setFormData] = useState(() => getInitialFormData(knowledge));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: formData.title.trim(),
      source_type: formData.source_type,
      content: formData.content.trim(),
    };

    await onSubmit(payload);
  };

  return (
    <form className="flex flex-col gap-4 p-5" onSubmit={handleSubmit}>
      <Field
        label="Title"
        name="title"
        type="text"
        placeholder="e.g. Product Documentation"
        value={formData.title}
        onChange={handleChange}
        minLength={1}
        maxLength={255}
        disabled={isSubmitting}
        required
        autoFocus
      />

      <Select
        label="Source type"
        name="source_type"
        value={formData.source_type}
        onChange={handleChange}
        disabled={isSubmitting}
      >
        <option value="text">Text</option>
        <option value="url">URL</option>
        <option value="file">File</option>
      </Select>

      <Textarea
        label="Content"
        name="content"
        placeholder="Add the knowledge content used to ground this assistant..."
        value={formData.content}
        onChange={handleChange}
        rows={7}
        minLength={1}
        disabled={isSubmitting}
        required
      />

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button type="submit" isLoading={isSubmitting}>
          {knowledge ? "Update knowledge" : "Add knowledge"}
        </Button>
      </div>
    </form>
  );
}

export default KnowledgeForm;
