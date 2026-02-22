import { Line } from "react-chartjs-2"
import { useEffect, useState } from "react"

import {
 Chart,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Tooltip,
 Legend
} from "chart.js"

Chart.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Tooltip,
 Legend
)

export default function StrangleChart(){

 const [symbol,setSymbol]=useState("NIFTY")
 const [distance,setDistance]=useState(200)

 const [expiry,setExpiry]=useState("")
 const [expiries,setExpiries]=useState([])

 const [labels,setLabels]=useState([])
 const [values,setValues]=useState([])

 const [spot,setSpot]=useState(0)

 const fetchData=async()=>{

 const res=await fetch(
 `/api/nse?symbol=${symbol}&distance=${distance}&expiry=${expiry}`
 )

 const json=await res.json()

 if(json.error) return

 setSpot(json.spot)

 setExpiries(json.expiries)

 if(!expiry)
 setExpiry(json.expiries[0])

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

 }

 useEffect(()=>{

 fetchData()

 const interval=
 setInterval(fetchData,5000)

 return()=>clearInterval(interval)

 },[symbol,distance,expiry])


 const chartData={

 labels,

 datasets:[
 {

 label:"Strangle Premium",

 data:values,

 tension:0.3

 }

 ]

 }

 return(

 <div style={{padding:"20px"}}>

 <h2>Live Strangle Chart</h2>


 {/* SELECTORS */}


 <div style={{display:"flex",gap:"10px"}}>


 <select
 value={symbol}
 onChange=e=>setSymbol(e.target.value)
 >

 <option>NIFTY</option>

 <option>BANKNIFTY</option>

 <option>FINNIFTY</option>

 </select>


 <select
 value={distance}
 onChange=e=>
 setDistance(e.target.value)
 >

 <option value="100">±100</option>

 <option value="200">±200</option>

 <option value="300">±300</option>

 <option value="500">±500</option>

 </select>


 <select
 value={expiry}
 onChange=e=>
 setExpiry(e.target.value)
 >

 {

 expiries.map(x=>(

 <option key={x}>{x}</option>

 ))

 }

 </select>


 </div>


 <div style={{marginTop:"10px"}}>

 Spot: {spot}

 </div>


 <Line data={chartData}/>


 </div>

 )

}
