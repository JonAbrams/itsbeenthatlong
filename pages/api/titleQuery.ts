// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {NextApiRequest,NextApiResponse} from 'next'
import 'isomorphic-fetch'

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const query = req.query?.q as string
  if (!(query?.length > 2)) {
    res.status(404)
    return;
  }
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${process.env['TMDB_API_KEY']}`)
    .then(res => res.json())
  const movies = (response?.results || []).map(
    ({id, title, release_date: releaseDate}) =>({title, releaseDate, id})
  )
  res.status(200).json(movies.slice(0,5))
}
