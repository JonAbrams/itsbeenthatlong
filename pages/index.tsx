import Head from 'next/head';
import { useState, ReactNode } from 'react';
import 'purecss';

import styles from '../styles/Home.module.css';
import movieQueryStyles from '../styles/MovieQuery.module.css';
import { MovieQuery } from '../components/MovieQuery';
import { Arrow } from '../components/Arrow';

export default function Home(): ReactNode {
  const [chosenMovie, setChosenMovie] = useState(null);
  const [otherMovie, setOtherMovie] = useState(null);

  const handleClearChosenMovie = () => {
    setChosenMovie(null);
    setOtherMovie(null);
  };

  const handleMovieClick = async (movie: Record<string, string>) => {
    setChosenMovie(movie);
    const results = await fetch(
      `/api/otherMovies?year=${movie.releaseDate.slice(0, 4)}`,
    ).then((res) => res.json());
    setOtherMovie(results);
  };

  const yearsPassed =
    chosenMovie &&
    new Date().getFullYear() - chosenMovie.releaseDate.slice(0, 4);

  return (
    <div className={styles.container}>
      <Head>
        <title key="title">It's been that long?!</title>
      </Head>

      <main className={styles.main}>
        <h1>
          It's been <b>that</b> long?!
        </h1>
        <MovieQuery
          onClearChosenMovie={handleClearChosenMovie}
          onMovieClick={handleMovieClick}
        />
        {!otherMovie && chosenMovie && <div>Loading…</div>}
        {otherMovie && (
          <div className={styles.results}>
            <div className={styles.now + ' ' + styles.resultEntry}>
              <span>
                <b>Now</b> (2021)
              </span>
            </div>
            <Arrow>{yearsPassed} years</Arrow>
            <div className={styles.resultEntry}>
              <img
                className={movieQueryStyles.poster}
                src={
                  chosenMovie.posterPath &&
                  `https://image.tmdb.org/t/p/w200${chosenMovie.posterPath}`
                }
              />
              <span>
                <b>{chosenMovie.title}</b> (
                {chosenMovie.releaseDate.slice(0, 4)})
              </span>
            </div>
            <Arrow>{yearsPassed} years</Arrow>
            <div className={styles.resultEntry}>
              <img
                className={movieQueryStyles.poster}
                src={
                  otherMovie.posterPath &&
                  `https://image.tmdb.org/t/p/w200${otherMovie.posterPath}`
                }
              />
              <span>
                <b>{otherMovie.title}</b> ({otherMovie.releaseDate.slice(0, 4)})
              </span>
            </div>
          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <div>
          This product uses the{' '}
          <a href="https://developers.themoviedb.org/3/getting-started/introduction">
            TMDb API
          </a>{' '}
          but is not endorsed or certified by{' '}
          <a href="https://www.themoviedb.org/">TMDb</a>.
        </div>
      </footer>
    </div>
  );
}
