// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import 'isomorphic-fetch';

const titleCache = {};

export const movieTransformer = ({
  id,
  title,
  poster_path: posterPath,
  release_date: releaseDate,
}: MovieResponse): Movie => ({
  title,
  releaseDate,
  id,
  posterPath,
});

export async function getByTitleId(titleId: string): Promise<Movie> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${titleId}?api_key=${process.env['TMDB_API_KEY']}`,
  );
  if (response.status !== 200) throw 'not found';
  return movieTransformer(await response.json());
}

export default async function queryTitle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const query = req.query?.q as string;
  if (titleCache[query]) {
    res.json(titleCache[query]);
    return;
  }
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      query,
    )}&api_key=${process.env['TMDB_API_KEY']}`,
  ).then((res) => res.json());

  let movies = response.results.filter(({ release_date }) => release_date);
  movies.sort((a, b) => {
    return b.vote_count - a.vote_count;
  });
  movies = movies.map(movieTransformer);
  titleCache[query] = movies.slice(0, 5);
  res.json(titleCache[query]);
}
