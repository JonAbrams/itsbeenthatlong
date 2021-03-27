import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState, ReactNode, useEffect} from 'react'

export default function Home(): ReactNode {
  const [movieQuery, setMovieQuery] = useState('')
  const [queryResults, setQueryResults] = useState([])
  const [chosenMovie, setChosenMovie] = useState(null)
  const [otherMovie, setOtherMovie] = useState(null)

  const handleMovieQueryChange = async ({target: {value: movieQuery}}) => {
    setMovieQuery(movieQuery)
    setOtherMovie(null)
    if (movieQuery.length > 0) {
      setChosenMovie(null)
    }
    if (movieQuery.length <= 2) {
      setQueryResults([])
      return;
    }
    const results = await fetch(`/api/titleQuery?q=${encodeURIComponent(movieQuery)}`)
      .then(res => res.json());
    setQueryResults(results)
  }
  const handleMovieClick = async (movie) => {
    setChosenMovie(movie)
    setMovieQuery('')
    setQueryResults([])
    const results = await fetch(`/api/otherMovies?year=${movie.releaseDate.slice(0,4)}`).then(res => res.json())
    setOtherMovie(results)
  }

  useEffect(() => {
    (async function() {

    })()
  }, [movieQuery])

  return (
    <div className={styles.container}>
      <Head>
        <title>It's been that long?!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>It's been <b>that</b> long?!</h1>
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
        {!otherMovie && chosenMovie && <div>Loading…</div>}
        {otherMovie &&
          <div className="other-movies">
            <div><b>Now</b> (2021) to <b>{chosenMovie.title}</b> ({chosenMovie.releaseDate.slice(0,4)}) is the same as…</div>
            <span><b>{chosenMovie.title}</b> ({chosenMovie.releaseDate.slice(0,4)}) to </span>
            <b>{otherMovie.title}</b> ({otherMovie.releaseDate.slice(0,4)})
          </div>
        }
      </main>
    </div>
  )
}
