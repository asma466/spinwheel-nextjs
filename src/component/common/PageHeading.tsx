export const PageHeading = ({ title, subtitle }: any) => {
  return (
    <div>
      <h1 className="heading-xl">{title}</h1>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};
