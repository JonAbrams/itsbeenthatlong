import { GetServerSideProps } from 'next';
import Head from 'next/head';
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
  const movieId = +params?.id;
  if (isNaN(movieId)) return redirectHome;

  try {
    const chosenMovie = await getByTitleId(movieId);
    const year = chosenMovie.year;
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
  const yearsPassed = new Date().getFullYear() - chosenMovie.year;

  async function share() {
    const shareText = `When "${
      chosenMovie.title + ''
    }" was released ${yearsPassed} years ago, "${
      otherMovie.title + ''
    }" was ${yearsPassed} years old at the time.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "It's been that long?!",
          text: shareText,
          url: location.href,
        });
      } catch (e) {
        console.log('Share cancelled?');
      }
    } else {
      open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText,
        )}&url=${encodeURIComponent(
          location.href,
        )}&related=JonathanAbrams&hashtags=itsbeenthatlong`,
        '_blank',
      );
    }
  }

  return (
    <Home>
      <Head>
        <title key="title">It's been that long?! – {chosenMovie.title}</title>
      </Head>
      {!otherMovie ? (
        <div className={styles.message}>
          Whoa, "{chosenMovie.title}" is <b>really</b> old. Try a newer one.
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
              <b>{chosenMovie.title}</b> ({chosenMovie.year})
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
              <b>{otherMovie.title}</b> ({otherMovie.year})
            </span>
          </div>
          <button
            className={styles.shareButton + ' pure-button pure-button-primary'}
            onClick={share}
          >
            Share this result!
          </button>
        </div>
      )}
    </Home>
  );
}
