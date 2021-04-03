import {useState, ReactNode} from 'react'

import styles from '../styles/MovieQuery.module.css'

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
    if (movieQuery.length === 0) {
      return;
    }
    const results = await fetch(`/api/titleQuery?q=${encodeURIComponent(movieQuery)}`)
      .then(res => res.json());
    setQueryResults(results)
  }

  const handleMovieClick = (movie: Record<string, string>) => {
    setQueryResults([])
    setMovieQuery('')
    onMovieClick(movie)
  }

  return <>
    <form className="pure-form">
      <input placeholder="Name an old movie…" type="search" value={movieQuery} onChange={handleMovieQueryChange} className="pure-input-rounded" />
    </form>
    {queryResults.length > 0 &&
      <div className={styles.container + " pure-menu"}>
        <ul className="pure-menu-list">
          {queryResults.map((movie) =>
            <li key={movie.id} className="pure-menu-item">
              <a onClick={() => handleMovieClick(movie)} className={"pure-menu-link " + styles.link}>
                <b>{movie.title}</b> ({movie.releaseDate.slice(0,4)})
              </a>
            </li>
          )}
        </ul>
      </div>
    }
  </>
}
