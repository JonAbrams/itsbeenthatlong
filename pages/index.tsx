import Head from 'next/head';
import { FunctionComponent } from 'react';
import 'purecss';

import styles from '../styles/Home.module.css';
import { MovieQuery } from '../components/MovieQuery';

export const Home: FunctionComponent = ({ children }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title key="title">It's been that long?!</title>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VXYMCPN2WN"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-VXYMCPN2WN');`,
          }}
        />
      </Head>

      <main className={styles.main}>
        <h1>
          It's been <b>that</b> long?!
        </h1>
        <MovieQuery />
        {children}
      </main>
      <footer className={styles.footer}>
        <div>
          Created and maintained by{' '}
          <a href="https://www.twitter.com/JonathanAbrams">Jon Abrams</a>
        </div>
        <div>
          Hosting provided by <a href="https://vercel.com/">Vercel</a>.
        </div>
        <div>
          This product uses the{' '}
          <a href="https://developers.themoviedb.org/3/getting-started/introduction">
            TMDb API
          </a>{' '}
          but is not endorsed or certified by{' '}
          <a href="https://www.themoviedb.org/">TMDb</a>.
        </div>
      </footer>
    </div>
  );
};

export default Home;
