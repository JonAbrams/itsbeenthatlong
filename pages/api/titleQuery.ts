// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import 'isomorphic-fetch';

const queryCache: Map<string, Movie[]> = new Map();
const titleCache: Map<number, Movie> = new Map();

export const movieTransformer = ({
  id,
  title,
  poster_path: posterPath,
  release_date,
}: MovieResponse): Movie => ({
  title,
  year: +release_date.slice(0, 4),
  id,
  posterPath,
});

export async function getByTitleId(titleId: number): Promise<Movie> {
  if (titleCache.has(titleId)) return titleCache.get(titleId);

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${titleId}?api_key=${process.env['TMDB_API_KEY']}`,
  );
  if (response.status !== 200) throw 'not found';

  const movie = movieTransformer(await response.json());
  titleCache.set(titleId, movie);
  return movie;
}

export default async function queryTitle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const query = req.query?.q as string;
  if (queryCache.has(query.toLowerCase())) {
    res.json(queryCache.get(query));
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
  queryCache.set(query.toLowerCase(), movies.slice(0, 5));
  movies.forEach((movie: Movie) => {
    titleCache.set(movie.id, movie);
  });
  res.json(queryCache.get(query));
}
