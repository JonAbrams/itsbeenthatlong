export interface Movie {
  id: number;
  title: string;
  year: number;
  posterPath: string;
}

export interface MovieResponse {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}
