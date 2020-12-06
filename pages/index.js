import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home({ data }) {
  const sats_per_cent = data.data.sats_per_cent.toFixed(2);
  const cents_per_sat = data.data.cent_per_sat.toFixed(2);
  const yes_or_no = sats_per_cent < 1 ? "Yes" : "No";
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Sat cent parity?</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {yes_or_no}
        </h1>

        <p className={styles.description}>
          One cent is worth ≈ {`${sats_per_cent} sats`}
          <br />
          One sat is worth ≈ {`${cents_per_sat} cents`}
        </p>
        <p className={styles.description}>
        </p>
      </main>
    </div>
  )
}

const KrakenClient = require("kraken-api");
// No API key required because we're using the Ticker
const kraken = new KrakenClient("", "");

export async function getStaticProps(context) {
  const data = await kraken.api("Ticker", { pair : 'XXBTZUSD' }).then(({error, result}) => {
    if (error.length > 0) {
      return { success: false, data: error};
    } else {
      const price_usd = result.XXBTZUSD.a[0];
      const sats_per_dollar = 100_000_000 / price_usd;
      const sats_per_cent = 1_000_000 / price_usd;
      const cent_per_sat = price_usd * 100 / 100_000_000;
      return { success: true, data: { price_usd, cent_per_sat, sats_per_dollar, sats_per_cent }};
    }
  });

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }, // will be passed to the page component as props
    revalidate: 1
  }
}
