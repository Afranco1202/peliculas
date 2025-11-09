type PaginatorProps = {
  page: number
  totalPages: number
  isFetching?: boolean
  onPrev: () => void
  onNext: () => void
}



export default function Paginator({
  page,
  totalPages,
  isFetching = false,
  onPrev,
  onNext,
}: PaginatorProps) {
  const isFirst = page <= 1
  const isLast = page >= Math.max(1, totalPages)

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst || isFetching}
          aria-label="Página anterior"
          className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        <span className="text-sm opacity-80 select-none">
          Página {page} de {Math.max(1, totalPages)}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={isLast || isFetching}
          aria-label="Página siguiente"
          className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>

      {isFetching && (
        <div className="text-sm opacity-70">Actualizando…</div>
      )}
    </div>
  )
}
