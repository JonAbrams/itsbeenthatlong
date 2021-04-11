// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import 'isomorphic-fetch';

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
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?primary_release_year=${movieYear}&sort_by=revenue.desc&api_key=${process.env['TMDB_API_KEY']}`,
  ).then((res) => res.json());
  const [movie] = [response.results[0]].map(({ title, release_date }) => ({
    title,
    releaseDate: release_date,
  }));
  res.json(movie);
};
