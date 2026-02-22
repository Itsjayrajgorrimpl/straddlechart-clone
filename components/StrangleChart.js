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

export default function StrangleChart(){

 const [labels,setLabels]=useState([])
 const [data,setData]=useState([])

 useEffect(()=>{

 const interval=setInterval(async()=>{

 const res=await fetch("/api/nse")
 const json=await res.json()

 const strangle=json.straddle*0.4

 setLabels(prev=>[...prev,new Date().toLocaleTimeString()])

 setData(prev=>[...prev,strangle])

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

 label:"Strangle Premium",

 data

 }

 ]

 }

 }

 />

 )

}
