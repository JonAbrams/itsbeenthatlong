import {useState, ReactNode} from 'react'

type MovieQueryProps = {
  onClearChosenMovie: () => void,
  onMovieClick: (movie: Record<string, string>) => void,
}

export function MovieQuery({onClearChosenMovie, onMovieClick}: MovieQueryProps): ReactNode {
  const [movieQuery, setMovieQuery] = useState('')
  const [queryResults, setQueryResults] = useState([])

  const handleMovieQueryChange = async ({target: {value: movieQuery}}) => {
    setMovieQuery(movieQuery)
    onClearChosenMovie()
    setQueryResults([])
    if (movieQuery.length <= 2) {
      return;
    }
    const results = await fetch(`/api/titleQuery?q=${encodeURIComponent(movieQuery)}`)
      .then(res => res.json());
    setQueryResults(results)
  }

  const handleMovieClick = (movie: Record<string, string>) => {
    setQueryResults([])
    onMovieClick(movie)
  }

  return <>
    <label><div>Which movie were you thinking of?</div>
      <input placeholder="Search…" type="text" value={movieQuery} onChange={handleMovieQueryChange} />
    </label>
    {queryResults.length > 0 &&
      <div className="query-results">
        Choose one:
        {queryResults.map((movie) =>
          <li key={movie.id} onClick={() => handleMovieClick(movie)}><b>{movie.title}</b> ({movie.releaseDate.slice(0,4)})</li>
        )}
      </div>
    }
  </>
}
