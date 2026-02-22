export default async function handler(req, res) {

 const symbol = req.query.symbol || "NIFTY"
 const distance = 200

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

 const straddle = ce+pe

 // REAL STRANGLE

 const callStrike = atmStrike + distance
 const putStrike = atmStrike - distance

 const callData =
 strikes.find(s=>s.strikePrice==callStrike)

 const putData =
 strikes.find(s=>s.strikePrice==putStrike)

 const strangleCE = callData?.CE?.lastPrice || 0
 const stranglePE = putData?.PE?.lastPrice || 0

 const strangle =
 strangleCE + stranglePE

 res.json({

 spot,
 atmStrike,

 ce,
 pe,

 straddle,

 callStrike,
 putStrike,

 strangleCE,
 stranglePE,

 strangle

 })

 } catch(e){

 res.json({
 error:"NSE error"
 })

 }

}
