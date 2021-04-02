import Head from 'next/head'
import {useState, ReactNode} from 'react'

import styles from '../styles/Home.module.css'
import {MovieQuery} from '../components/MovieQuery'

export default function Home(): ReactNode {
  const [chosenMovie, setChosenMovie] = useState(null)
  const [otherMovie, setOtherMovie] = useState(null)

  const handleClearChosenMovie = () => {
    setChosenMovie(null)
    setOtherMovie(null)
  }

  const handleMovieClick = async (movie) => {
    setChosenMovie(movie)
    const results = await fetch(`/api/otherMovies?year=${movie.releaseDate.slice(0,4)}`).then(res => res.json())
    setOtherMovie(results)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>It's been that long?!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>It's been <b>that</b> long?!</h1>
        <MovieQuery
          onClearChosenMovie={handleClearChosenMovie}
          onMovieClick={handleMovieClick}
        />
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
