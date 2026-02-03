import { RiMoonClearFill } from "react-icons/ri";
import { HiSun } from "react-icons/hi";

const Navbar = ({dark, setDark, sysstatus, setSysStatus }) => {
    return(
        <nav className="flex justify-between rounded-b-md bg-amber-500 p-4 text-white items-center">
            <p className="text-shadow font-black uppercase">Smarthome</p>
            <div className="flex items-center">
            <p className="font-black uppercase">System:</p>
            <button className={`p-1 px-2 text-amber-500 font-bold m-2 rounded-lg hover:scale-105 duration-300 ${sysstatus ? "bg-green-600 text-white shadow-lg shadow-green-400/40" : " bg-gray-200 hover:bg-white animate-pulse" }`} onClick={() => setSysStatus(!sysstatus)}>
                {sysstatus? "ON":"OFF" }
            </button>
            <button className="rounded-full border border-white p-2 hover:scale-105 hover:bg-amber-400 duration-400" onClick={()=> setDark(!dark)}>
                {dark ? <RiMoonClearFill className='text-white'/>: <HiSun className='text-white'/> }
                </button>
            </div>
        </nav>
    );
}

export default Navbar;