import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import useSWR from "swr";

const KRAKEN_API = "https://api.kraken.com/0/public/Ticker?pair=XBTUSD";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

function PieChart({ percentage, children }) {
  const remainder = 100 - percentage;
  return (
    <div
      className={styles.pie}
      style={{ "--segment1": percentage, "--segment2": remainder }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const { data, error } = useSWR(KRAKEN_API, fetcher, {
    refreshInterval: 10000,
  });
  if (error)
    return <div className={styles.no}>Failed to load price from API</div>;
  if (!data) return <div className={styles.no}>Loading...</div>;

  const price_usd = data.result.XXBTZUSD.c[0];

  console.log("Kraken XBTUSD: ", price_usd);

  const sats_per_dollar = 100_000_000 / price_usd;
  const sats_per_cent = 1_000_000 / price_usd;
  const cent_per_sat = (price_usd * 100) / 100_000_000;

  const sats_per_dollar_display = sats_per_dollar.toFixed(0);
  const sats_per_cent_display = sats_per_cent.toFixed(2);
  const cents_per_sat_display = cent_per_sat.toFixed(2);
  const percentage = (cent_per_sat * 100).toFixed(2);
  const yes_or_no = sats_per_cent < 1;

  return (
    <div className={yes_or_no ? styles.yes : styles.no}>
      <Head>
        <title>sat / cent parity?</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>sat / cent parity?</h1>
        <div style={{ position: "relative", width: 256, height: 256 }}>
          <PieChart percentage={percentage}>
            <div style={{ width: 256, height: 256 }} />
          </PieChart>
          <Image
            priority
            src="/cent.png"
            alt="One cent"
            width={256}
            height={256}
            className={styles.behind}
          />
        </div>
        <h1 className={styles.title}>{yes_or_no ? "yes" : "not yet"}</h1>

        <p className={styles.description}>
          {`we're at ${percentage}%`}
          <br />1 dollar ≈ {`${sats_per_dollar_display} sats`}
          <br />1 cent ≈ {`${sats_per_cent_display} sats`}
          <br />1 sat ≈ {`${cents_per_sat_display} cents`}
          <br />
        </p>
        <p className={styles.description}></p>
      </main>
      <footer className={styles.footer}>
        <p>
          Price is the latest trade on{" "}
          <a href="https://www.kraken.com/">Kraken.</a> It auto-refreshes every
          ten seconds.
        </p>
        <p>BTC is currently ${(1.0 * price_usd).toFixed(0)}</p>
      </footer>
    </div>
  );
}
