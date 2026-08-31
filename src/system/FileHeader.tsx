import "./FileHeader.css";

export default function FileHeader({
  index,
  total,
  title,
}: {
  index: string;
  total?: string;
  title: string;
}) {
  return (
    <div className="file-header">
      <span className="file-header__index">
        {index}
        {total ? <span className="file-header__total"> / {total}</span> : null}
      </span>
      <span className="file-header__rule" />
      <span className="file-header__title">{title}</span>
    </div>
  );
}
