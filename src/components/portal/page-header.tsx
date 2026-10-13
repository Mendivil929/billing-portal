export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-7">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      {description ? <p className="mt-1.5 text-sm text-slate-600">{description}</p> : null}
    </div>
  );
}
