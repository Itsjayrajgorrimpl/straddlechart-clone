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

 const [labels, setLabels] = useState([]);
 const [values, setValues] = useState([]);

 const [spot,setSpot]=useState(0)
 const [callStrike,setCallStrike]=useState(0)
 const [putStrike,setPutStrike]=useState(0)

 useEffect(()=>{

 const fetchData = async ()=>{

 try{

 const res = await fetch("/api/nse");

 const json = await res.json();

 if(json.error) return;

 const time =
 new Date().toLocaleTimeString();

 setLabels(prev=>{

 const updated=[...prev,time]

 return updated.slice(-100)

 })

 setValues(prev=>{

 const updated=[...prev,json.strangle]

 return updated.slice(-100)

 })

 setSpot(json.spot)

 setCallStrike(json.callStrike)

 setPutStrike(json.putStrike)

 }catch(e){

 console.log("Fetch error")

 }

 }

 fetchData()

 const interval =
 setInterval(fetchData,5000)

 return ()=>clearInterval(interval)

 },[])

 const chartData = {

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

 <div style={{marginBottom:"10px"}}>

 Spot: {spot}

 </div>

 <div style={{marginBottom:"10px"}}>

 Call Strike: {callStrike}

 </div>

 <div style={{marginBottom:"10px"}}>

 Put Strike: {putStrike}

 </div>

 <Line data={chartData} />

 </div>

 )

}
