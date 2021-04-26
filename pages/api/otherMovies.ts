// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import 'isomorphic-fetch';

import { movieTransformer } from './titleQuery';

const movieYearCache: Map<number, Movie> = new Map();

export async function getMovieFromYear(
  movieYear: number,
): Promise<Movie | null> {
  if (movieYearCache.has(movieYear)) {
    return movieYearCache.get(movieYear);
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?primary_release_year=${movieYear}&sort_by=revenue.desc&api_key=${process.env['TMDB_API_KEY']}`,
  ).then((res) => res.json());

  if (response.results.length === 0) return null;

  const movie = movieTransformer(response.results[0]);
  movieYearCache.set(movieYear, movie);
  return movie;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const year = +req.query?.year;
  if (!year) {
    res.status(404);
    return;
  }
  const nowYear = new Date().getFullYear();
  const movieYear = year - (nowYear - year);
  const movie = await getMovieFromYear(movieYear);
  if (!movie) {
    res.status(404).send('Not found');
    return;
  }
  res.json(movie);
};
