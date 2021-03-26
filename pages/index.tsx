import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState, ReactNode, useEffect} from 'react'

export default function Home(): ReactNode {
  const [movieA, setMovieA] = useState('');

  const handleMovieAChange = ({target: {value}}) => setMovieA(value);

  useEffect(() => {
    if (!movieA) return;
    console.log("movieA changed", movieA)
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
      </main>
    </div>
  )
}
