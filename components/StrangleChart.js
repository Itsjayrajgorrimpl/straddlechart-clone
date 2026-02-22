import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

import {
 Chart,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Tooltip,
 Legend
} from "chart.js";

Chart.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Tooltip,
 Legend
);

export default function StrangleChart() {

 const [symbol,setSymbol]=useState("NIFTY")
 const [distance,setDistance]=useState(200)

 const [expiry,setExpiry]=useState("")
 const [expiries,setExpiries]=useState([])

 const [labels,setLabels]=useState([])
 const [values,setValues]=useState([])

 const [spot,setSpot]=useState(0)
 const [atmStrike,setAtmStrike]=useState(0)
 const [callStrike,setCallStrike]=useState(0)
 const [putStrike,setPutStrike]=useState(0)

 const [error,setError]=useState(false)
 const [loading,setLoading]=useState(true)



 const fetchData = async()=>{

 try{

 setError(false)

 const res = await fetch(
 `/api/nse?symbol=${symbol}&distance=${distance}&expiry=${expiry}`
 )

 const json = await res.json()

 if(json.error){

 setError(true)
 return

 }

 setLoading(false)

 setSpot(json.spot)

 setExpiries(json.expiries)

 setAtmStrike(json.atmStrike)

 setCallStrike(json.callStrike)

 setPutStrike(json.putStrike)

 if(!expiry && json.expiries.length>0){

 setExpiry(json.expiries[0])

 }

 const time =
 new Date().toLocaleTimeString()

 setLabels(prev=>{

 const updated=[...prev,time]

 return updated.slice(-150)

 })

 setValues(prev=>{

 const updated=[...prev,json.strangle]

 return updated.slice(-150)

 })


 }catch(e){

 setError(true)

 }

 }



 useEffect(()=>{

 fetchData()

 const interval =
 setInterval(fetchData,5000)

 return ()=>clearInterval(interval)

 },[symbol,distance,expiry])



 if(error)

 return(

 <div style={{padding:"20px"}}>

 NSE data unavailable

 </div>

 )



 if(loading)

 return(

 <div style={{padding:"20px"}}>

 Loading market data...

 </div>

 )



 const chartData={

 labels,

 datasets:[

 {

 label:"OTM Strangle Premium",

 data:values,

 tension:0.3

 }

 ]

 }



 return(

 <div style={{padding:"20px"}}>



 <h2>Live Strangle Chart</h2>



 {/* SELECTORS */}



 <div
 style={{
 display:"flex",
 gap:"10px",
 flexWrap:"wrap",
 marginBottom:"10px"
 }}
 >


 <select
 value={symbol}
 onChange={(e)=>{

 setSymbol(e.target.value)

 setLabels([])

 setValues([])

 }}
 >

 <option>NIFTY</option>

 <option>BANKNIFTY</option>

 <option>FINNIFTY</option>

 </select>



 <select
 value={distance}
 onChange={(e)=>{

 setDistance(e.target.value)

 setLabels([])

 setValues([])

 }}
 >

 <option value="100">±100</option>

 <option value="200">±200</option>

 <option value="300">±300</option>

 <option value="500">±500</option>

 </select>



 <select
 value={expiry}
 onChange={(e)=>{

 setExpiry(e.target.value)

 setLabels([])

 setValues([])

 }}
 >

 {

 expiries.map(x=>(

 <option key={x}>{x}</option>

 ))

 }

 </select>



 </div>



 {/* MARKET INFO */}



 <div style={{marginBottom:"10px"}}>

 Spot: {spot}

 </div>



 <div style={{marginBottom:"10px"}}>

 ATM Strike: {atmStrike}

 </div>



 <div style={{marginBottom:"10px"}}>

 Call Strike: {callStrike}

 </div>



 <div style={{marginBottom:"10px"}}>

 Put Strike: {putStrike}

 </div>



 {/* CHART */}



 <div style={{height:"400px"}}>

 <Line
 data={chartData}
 options={{
 responsive:true,
 maintainAspectRatio:false
 }}
 />

 </div>



 </div>

 )

  }
