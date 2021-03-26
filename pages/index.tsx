import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState, ReactNode, useEffect} from 'react'

export default function Home(): ReactNode {
  const [movieA, setMovieA] = useState('')
  const [queryResults, setQueryResults] = useState([])

  const handleMovieAChange = ({target: {value}}) => setMovieA(value)

  useEffect(() => {
    (async function() {
      if (movieA.length <= 2) {
        setQueryResults([])
        return;
      }
      const results = await fetch(`/api/titleQuery?q=${encodeURIComponent(movieA)}`)
        .then(res => res.json());
      setQueryResults(results)
    })()
  }, [movieA])

  return (
    <div className={styles.container}>
      <Head>
        <title>It's been that long?!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>It's been <b>that</b> long?!</h1>
        <label><div>Which movie were you thinking of?</div>
          <input type="text" value={movieA} onChange={handleMovieAChange} />
        </label>
        {queryResults.length > 0 &&
          <div className="query-results">
            {queryResults.map(({title, releaseDate, id}) =>
              <li key={id}>{title} – {releaseDate}</li>
            )}
          </div>
        }
      </main>
    </div>
  )
}
