/// <reference types="next" />
/// <reference types="next/types/global" />

interface Movie {
  title: string;
  releaseDate: string;
  id: number;
  posterPath: string;
}

interface MovieResponse {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}
