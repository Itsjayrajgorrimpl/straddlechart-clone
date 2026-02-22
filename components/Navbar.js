import Link from "next/link"

export default function Navbar(){

 return(

 <div className="nav">

 <Link href="/">Home</Link>

 <Link href="/straddle">Straddle</Link>

 <Link href="/strangle">Strangle</Link>

 </div>

 )

}
