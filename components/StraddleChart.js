import {Line} from "react-chartjs-2"
import {useEffect,useState} from "react"
import {
 Chart,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement
} from "chart.js"

Chart.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement
)

export default function StraddleChart(){

 const [labels,setLabels]=useState([])
 const [data,setData]=useState([])

 useEffect(()=>{

 const interval=setInterval(async()=>{

 const res=await fetch(`/api/nse?symbol=${symbol}&expiry=${expiry}`)
 const json=await res.json()

 setLabels(prev=>[...prev,new Date().toLocaleTimeString()])

 setData(prev=>[...prev,json.straddle])

 },5000)

 return()=>clearInterval(interval)

 },[])

 return(

 <Line

 data={

 {

 labels,

 datasets:[
 {

 label:"Straddle Premium",

 data

 }

 ]

 }

 }

 />

 )

}
