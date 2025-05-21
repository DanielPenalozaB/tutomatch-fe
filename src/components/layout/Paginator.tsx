type PaginatorProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Paginator({ page, totalPages, onChange }: PaginatorProps) {
  return (
    <div className="flex gap-2 my-4">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span>Página {page} de {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        Siguiente
      </button>
    </div>
  );
}