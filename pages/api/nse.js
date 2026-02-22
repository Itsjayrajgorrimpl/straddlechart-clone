export default async function handler(req, res) {

 const symbol = req.query.symbol || "NIFTY"
 const distance = parseInt(req.query.distance || "200")
 const expirySelected = req.query.expiry || ""

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

 const raw = await response.json()

 const spot = raw.records.underlyingValue

 const strikes = raw.records.data

 const expiries = raw.records.expiryDates

 const expiry =
 expirySelected || expiries[0]

 const filtered =
 strikes.filter(
 s=>s.expiryDate==expiry
 )

 // ATM Strike

 const atmStrike =
 filtered.reduce((prev,curr)=>

 Math.abs(curr.strikePrice-spot) <
 Math.abs(prev.strikePrice-spot)
 ? curr
 : prev

 ).strikePrice

 const atmData =
 filtered.find(s=>s.strikePrice==atmStrike)

 const ce =
 atmData?.CE?.lastPrice || 0

 const pe =
 atmData?.PE?.lastPrice || 0

 const straddle =
 ce + pe


 // STRANGLE

 const callStrike =
 atmStrike + distance

 const putStrike =
 atmStrike - distance

 const callData =
 filtered.find(s=>s.strikePrice==callStrike)

 const putData =
 filtered.find(s=>s.strikePrice==putStrike)

 const strangleCE =
 callData?.CE?.lastPrice || 0

 const stranglePE =
 putData?.PE?.lastPrice || 0

 const strangle =
 strangleCE + stranglePE


 res.json({

 symbol,

 spot,

 expiries,

 expiry,

 atmStrike,

 ce,

 pe,

 straddle,

 distance,

 callStrike,

 putStrike,

 strangleCE,

 stranglePE,

 strangle

 })

 } catch(e){

 res.json({
 error:"NSE fetch error"
 })

 }

}
