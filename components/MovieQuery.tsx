import { useState, FunctionComponent } from 'react';
import Link from 'next/link';

import styles from '../styles/MovieQuery.module.css';

let lastQueryDate = new Date();

export const MovieQuery: FunctionComponent = () => {
  const [movieQuery, setMovieQuery] = useState('');
  const [queryResults, setQueryResults] = useState<Movie[]>([]);

  const handleMovieQueryChange = async ({ target: { value: movieQuery } }) => {
    setMovieQuery(movieQuery);
    if (movieQuery.length === 0) {
      setQueryResults([]);
      return;
    }
    const queryDate = new Date();
    lastQueryDate = queryDate;
    const results = await fetch(
      `/api/titleQuery?q=${encodeURIComponent(movieQuery)}`,
    ).then((res) => res.json());
    // Only read results if this is indeed the most recent query.
    if (lastQueryDate !== queryDate) return;
    setQueryResults(results);
  };

  const resetQuery = () => {
    setQueryResults([]);
    setMovieQuery('');
  };

  return (
    <>
      <form
        className={styles.form + ' pure-form'}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          placeholder="Name an old movie…"
          aria-label="Search for an old movie"
          type="search"
          value={movieQuery}
          onChange={handleMovieQueryChange}
          className={styles.input + ' pure-input-rounded'}
        />
      </form>
      {queryResults.length > 0 && (
        <div className={styles.container + ' pure-menu'}>
          <ul className="pure-menu-list">
            {queryResults.map((movie) => (
              <li key={movie.id} className="pure-menu-item">
                <Link href={`/${movie.id}`}>
                  <a
                    className={'pure-menu-link ' + styles.link}
                    onClick={resetQuery}
                  >
                    <img
                      className={styles.poster}
                      src={
                        movie.posterPath &&
                        `https://image.tmdb.org/t/p/w200${movie.posterPath}`
                      }
                    />
                    <span className={styles.title}>
                      <b>{movie.title}</b> ({movie.year})
                    </span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
