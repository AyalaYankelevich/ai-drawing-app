
type Props = {
  size?: number; // px
  className?: string;
  label?: string;
};

export function Spinner({ size = 18, className = "", label }: Props) {
  return (
    <span className={`spinnerWrap ${className}`} aria-label={label ?? "Loading"}>
      <span
        className="spinner"
        style={{ width: size, height: size }}
      />
      {label ? <span className="spinnerLabel">{label}</span> : null}
    </span>
  );
}
