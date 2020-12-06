const KrakenClient = require("kraken-api");
// No API key required because we're using the Ticker
const kraken = new KrakenClient("", "");

export default (req, res) => {
  (async () => {
      await kraken.api("Ticker", { pair : 'XXBTZUSD' }).then(({error, result}) => {
        if (error.length > 0) {
          res.statusCode = 502;
          res.json({ success: false, data: error})
        } else {
          res.statusCode = 200
          const price_usd = result.XXBTZUSD.a[0];
          const sats_per_dollar = 100_000_000 / price_usd;
          const sats_per_cent = 1_000_000 / price_usd;
          const cent_per_sat = price_usd * 100 / 100_000_000;
          res.json({ success: true, data: { price_usd, cent_per_sat, sats_per_dollar, sats_per_cent }})
        }
      });
  })();
}

// Doing this because I was getting an error about API resolving without sending a response???
export const config = {
  api: {
    externalResolver: true,
  },
}
