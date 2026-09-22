import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  page: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
  compact?: boolean
}

const paginasVisiveis = (page: number, totalPages: number) => {
  const inicio = Math.max(1, Math.min(page - 2, totalPages - 4))
  const fim = Math.min(totalPages, inicio + 4)
  return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i)
}

const Pagination = ({ page, totalPages, totalCount, onPageChange, compact = false }: PaginationProps) => {
  if (totalPages <= 1) {
    return totalCount > 0 ? (
      <p className="text-[13px] text-[#A67B66] text-center">{totalCount} {totalCount === 1 ? 'registro' : 'registros'}</p>
    ) : null
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-[13px] text-[#A67B66]">
        Página {page} de {totalPages} • {totalCount} registros
      </p>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="border-[#D5B99A] text-[#5B2814] hover:bg-[#FAF5EE] cursor-pointer"
        >
          <ChevronLeft size={16} /> Anterior
        </Button>
        {!compact && paginasVisiveis(page, totalPages).map((p) => (
          <Button
            type="button"
            key={p}
            size="sm"
            variant={p === page ? 'default' : 'ghost'}
            onClick={() => onPageChange(p)}
            className={p === page
              ? 'bg-[#5B2814] hover:bg-[#4A2010] text-[#F1E1CA] cursor-pointer'
              : 'text-[#7A4B3A] hover:bg-[#FAF5EE] cursor-pointer'}
          >
            {p}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="border-[#D5B99A] text-[#5B2814] hover:bg-[#FAF5EE] cursor-pointer"
        >
          Próximo <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
