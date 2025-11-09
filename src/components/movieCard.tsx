import { Link } from "react-router-dom"

type MovieCardProps = {
  id: number
  title: string
  posterPath: string | null
  voteAverage: number
  releaseDate?: string
  onClick?: (id: number) => void 
}

export default function MovieCard({id,title,posterPath,voteAverage,releaseDate}:MovieCardProps){


  return(
  <Link to={`/movie/${id}`}>
    <div className="sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    <div className="rounded-lg overflow-hidden border bg-white dark:bg-zinc-900 cursor-pointer " aria-label={title}>
      <img className="w-full h-full object-cover" src={`https://image.tmdb.org/t/p/w342${posterPath}`} alt={title}/>
        <div className="p-2">
          <div className="font-medium text-sm md:text-base line-clamp-1">{title}</div>
            <div className="text-[11px] md:text-xs opacity-70">
              ⭐ {Number.isFinite(voteAverage) ? voteAverage.toFixed(1) : 'N/A'} • {releaseDate ?? '—'}
          </div>
        </div>
    </div>
    </div>
  </Link>
  )

}