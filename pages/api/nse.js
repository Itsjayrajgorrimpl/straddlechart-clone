let cache = null
let cacheTime = 0

export default async function handler(req, res) {

 const symbol = req.query.symbol || "NIFTY"
 const distance = parseInt(req.query.distance || "200")
 const expirySelected = req.query.expiry || ""

 try {

 // CACHE (5 sec)

 if(cache && Date.now()-cacheTime < 5000){

 return res.json(cache)

 }


 // DIRECT NSE REQUEST


 const response = await fetch(

 `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`,

 {

 headers:{

 "accept":"application/json",

 "accept-language":"en-US,en;q=0.9",

 "user-agent":
 "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",

 "referer":
 "https://www.nseindia.com/option-chain"

 }

 }

 )


 if(!response.ok){

 throw new Error("NSE blocked request")

 }


 const raw = await response.json()


 const spot =
 raw.records.underlyingValue


 const expiries =
 raw.records.expiryDates


 const expiry =
 expirySelected || expiries[0]


 const strikes =
 raw.records.data.filter(
 x=>x.expiryDate===expiry
 )


 // ATM STRIKE


 const atm =
 strikes.reduce((a,b)=>{

 return Math.abs(b.strikePrice-spot)
 <
 Math.abs(a.strikePrice-spot)

 ? b : a

 })


 const atmStrike =
 atm.strikePrice


 const ce =
 atm?.CE?.lastPrice || 0


 const pe =
 atm?.PE?.lastPrice || 0


 const straddle =
 ce+pe



 // STRANGLE


 const callStrike =
 atmStrike + distance


 const putStrike =
 atmStrike - distance


 const callData =
 strikes.find(x=>x.strikePrice===callStrike)


 const putData =
 strikes.find(x=>x.strikePrice===putStrike)


 const strangleCE =
 callData?.CE?.lastPrice || 0


 const stranglePE =
 putData?.PE?.lastPrice || 0


 const strangle =
 strangleCE + stranglePE



 const result={

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


 cache=result
 cacheTime=Date.now()


 res.json(result)



 } catch(e){

 console.log(e)

 res.json({
 error:true
 })

 }

}
