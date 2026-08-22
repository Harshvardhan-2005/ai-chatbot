function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>

        {description ? (
          <p className="max-w-xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export default PageHeader;
