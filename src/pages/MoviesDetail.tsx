import { useParams } from "react-router-dom";
import { useGetMovieFullQuery} from "../features/api/moviesApi";


export default function MoviesDetail(){
const {id} = useParams();
const movieId= Number(id);
const skip = !id || Number.isNaN(movieId);

const{data,isLoading,isError}=useGetMovieFullQuery(movieId,{skip});

if (skip) return <div>ID inválido</div>;

  if (isLoading) return <div className="p-6 text-center">Cargando película...</div>;
  if (isError) return <div className="p-6 text-center">Error al cargar los detalles.</div>;

  const director = data?.credits?.crew.find(c => c.job === "Director")?.name;
  const cast = data?.credits?.cast?.slice(0, 6) || [];

return(
  <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Imagen del póster */}
        <img
          src={
            data?.poster_path
              ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
              : "/placeholder.jpg"
          }
          alt={data?.title}
          className="w-full md:w-1/3 rounded-lg shadow-lg object-cover"
        />

        {/* Información principal */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{data?.title}</h1>
          <p className="text-sm opacity-70 mb-4">
            {data?.release_date?.slice(0, 4)} • ⭐ {data?.vote_average?.toFixed(1)} / 10
          </p>

          {data?.runtime && (
            <p className="text-sm mb-2">
              Duración: {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
            </p>
          )}

          {data?.genres && (
            <p className="text-sm mb-4">
              Géneros: {data.genres.map(g => g.name).join(" • ")}
            </p>
          )}

          <p className="text-base mb-4">{data?.overview || "Sin sinopsis disponible."}</p>

          {director && (
            <p className="text-sm italic mb-2">
              🎬 Dirigida por: <span className="font-medium">{director}</span>
            </p>
          )}
        </div>
      </div>

      {/* Reparto principal */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Reparto principal</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cast.map(actor => (
            <div key={actor.id} className="text-center">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : "/placeholder.jpg"
                }
                alt={actor.name}
                className="w-full h-56 object-cover rounded-md mb-2"
              />
              <p className="text-sm font-medium">{actor.name}</p>
              <p className="text-xs opacity-70">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


}