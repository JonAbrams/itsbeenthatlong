import { GetServerSideProps } from 'next';
import { ReactNode } from 'react';

import { getByTitleId } from './api/titleQuery';
import { getMovieFromYear } from './api/otherMovies';

import Home from './index';

interface MoviePageProps {
  chosenMovie: Movie;
  otherMovie: Movie;
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
  return (
    <Home initialChosenMovie={chosenMovie} initialOtherMovie={otherMovie} />
  );
}
