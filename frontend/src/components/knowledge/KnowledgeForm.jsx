import { useState } from "react";

const EMPTY_FORM = {
  title: "",
  source_type: "text",
  content: "",
};

function getInitialFormData(knowledge) {
  if (!knowledge) {
    return EMPTY_FORM;
  }

  return {
    title: knowledge.title ?? "",
    source_type: knowledge.source_type ?? "text",
    content: knowledge.content ?? "",
  };
}

function KnowledgeForm({
  knowledge,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() => getInitialFormData(knowledge));

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
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
    <form className="knowledge-form" onSubmit={handleSubmit}>
      <div className="knowledge-form__field">
        <label htmlFor="knowledge-title">Title</label>

        <input
          id="knowledge-title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Product Documentation"
          minLength={1}
          maxLength={255}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="knowledge-form__field">
        <label htmlFor="knowledge-source-type">Source type</label>

        <select
          id="knowledge-source-type"
          name="source_type"
          value={formData.source_type}
          onChange={handleChange}
          disabled={isSubmitting}
        >
          <option value="text">Text</option>
          <option value="url">URL</option>
          <option value="file">File</option>
        </select>
      </div>

      <div className="knowledge-form__field">
        <label htmlFor="knowledge-content">Content</label>

        <textarea
          id="knowledge-content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Add the knowledge content used to ground this assistant..."
          rows={9}
          minLength={1}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="knowledge-form__actions">
        <button
          type="button"
          className="knowledge-form__cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="knowledge-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : knowledge
              ? "Update knowledge"
              : "Add knowledge"}
        </button>
      </div>
    </form>
  );
}

export default KnowledgeForm;
