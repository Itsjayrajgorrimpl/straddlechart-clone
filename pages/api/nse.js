let cacheData = null
let cacheTime = 0

export default async function handler(req, res) {

 const symbol = req.query.symbol || "NIFTY"
 const distance = parseInt(req.query.distance || "200")
 const expirySelected = req.query.expiry || ""

 try {

 // CACHE (Prevents NSE blocking)

 if(cacheData && Date.now()-cacheTime<5000){

 return res.json(cacheData)

 }

 // STEP 1 — Get NSE Cookie

 const home = await fetch(
 "https://www.nseindia.com",
 {
 headers:{
 "User-Agent":"Mozilla/5.0",
 "Accept-Language":"en-US"
 }
 }
 )

 const cookies = home.headers.get("set-cookie")


 // STEP 2 — Fetch Option Chain

 const response = await fetch(

 `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`,

 {

 headers:{

 "User-Agent":"Mozilla/5.0",

 "Accept-Language":"en-US",

 "Referer":"https://www.nseindia.com",

 "Cookie":cookies

 }

 }

 )

 const raw = await response.json()

 const spot =
 raw.records.underlyingValue

 const expiries =
 raw.records.expiryDates

 const expiry =
 expirySelected || expiries[0]

 const strikes =
 raw.records.data.filter(
 s=>s.expiryDate==expiry
 )



 // ATM CALCULATION


 const atmStrike =
 strikes.reduce((prev,curr)=>

 Math.abs(curr.strikePrice-spot) <
 Math.abs(prev.strikePrice-spot)
 ? curr
 : prev

 ).strikePrice


 const atmData =
 strikes.find(s=>s.strikePrice==atmStrike)



 const ce =
 atmData?.CE?.lastPrice || 0

 const pe =
 atmData?.PE?.lastPrice || 0



 const straddle =
 ce + pe



 // STRANGLE CALCULATION


 const callStrike =
 atmStrike + distance

 const putStrike =
 atmStrike - distance


 const callData =
 strikes.find(s=>s.strikePrice==callStrike)

 const putData =
 strikes.find(s=>s.strikePrice==putStrike)



 const strangleCE =
 callData?.CE?.lastPrice || 0


 const stranglePE =
 putData?.PE?.lastPrice || 0


 const strangle =
 strangleCE + stranglePE



 const responseData = {

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

 }


 // SAVE CACHE

 cacheData=responseData
 cacheTime=Date.now()


 res.json(responseData)


 } catch(e){

 console.log("NSE ERROR:",e)

 res.json({

 error:true,

 message:"NSE fetch failed"

 })

 }

}
