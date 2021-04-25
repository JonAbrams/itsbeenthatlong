import { GetServerSideProps } from 'next';
import { ReactNode } from 'react';

import { getByTitleId } from './api/titleQuery';
import { getMovieFromYear } from './api/otherMovies';

import { Home } from './index';
import styles from '../styles/Home.module.css';
import movieQueryStyles from '../styles/MovieQuery.module.css';
import { Arrow } from '../components/Arrow';

interface MoviePageProps {
  chosenMovie: Movie;
  otherMovie?: Movie;
}

const redirectHome = { redirect: { destination: '/', permanent: false } };
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const movieId = params?.id;
  if (typeof movieId !== 'string') return redirectHome;

  try {
    const chosenMovie = await getByTitleId(movieId);
    const year = +chosenMovie.releaseDate.slice(0, 4);
    const nowYear = new Date().getFullYear();
    const movieYear = year - (nowYear - year);
    const otherMovie = await getMovieFromYear(movieYear);
    return { props: { chosenMovie, otherMovie } };
  } catch (e) {
    return redirectHome;
  }
};

export default function MoviePage({
  chosenMovie,
  otherMovie,
}: MoviePageProps): ReactNode {
  const yearsPassed =
    chosenMovie &&
    new Date().getFullYear() - +chosenMovie.releaseDate.slice(0, 4);

  console.log({ chosenMovie, otherMovie });
  return (
    <Home>
      {!otherMovie ? (
        <div className={styles.message}>
          Whoa, that movie really <b>is</b> old. Try a newer one.
        </div>
      ) : (
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
              <b>{chosenMovie.title}</b> ({chosenMovie.releaseDate.slice(0, 4)})
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
    </Home>
  );
}
