export default async function handler(req, res) {

 const symbol = req.query.symbol || "NIFTY"

 try {

 const response = await fetch(
 `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`,
 {
 headers:{
 "User-Agent":"Mozilla/5.0",
 "Accept-Language":"en-US",
 "Referer":"https://www.nseindia.com"
 }
 }
 )

 const data = await response.json()

 const spot = data.records.underlyingValue

 const strikes = data.records.data

 const atmStrike =
 strikes.reduce((prev, curr) =>
 Math.abs(curr.strikePrice-spot) <
 Math.abs(prev.strikePrice-spot) ? curr : prev
 ).strikePrice

 const atmData =
 strikes.find(s=>s.strikePrice==atmStrike)

 const ce = atmData.CE.lastPrice
 const pe = atmData.PE.lastPrice

 res.json({
 spot,
 atmStrike,
 ce,
 pe,
 straddle: ce+pe
 })

 } catch(e){

 res.json({
 error:"NSE fetch failed"
 })

 }

}
