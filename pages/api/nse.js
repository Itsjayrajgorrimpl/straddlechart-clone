export default async function handler(req, res) {

 const symbol = req.query.symbol || "NIFTY"
 const distance = parseInt(req.query.distance || "200")
 const expirySelected = req.query.expiry || ""

 try {

 // FREE NSE PROXY API

 const response = await fetch(

 `https://api.allorigins.win/raw?url=https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`

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
 x=>x.expiryDate===expiry
 )


 // ATM

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
 error:true
 })

 }

}
