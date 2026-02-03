import { RiMoonClearFill } from "react-icons/ri";
import { HiSun } from "react-icons/hi";
import { SiHomebridge } from "react-icons/si";

const Navbar = ({dark, toggleDark, sysstatus, setSysStatus }) => {
    return(
        <nav className="flex justify-between rounded-b-md bg-amber-500 p-4 text-white items-center">
            <div className="flex items-center text-lg *:m-1">
            <SiHomebridge/>
            <p className="text-shadow font-black uppercase">Smarthome</p>
            </div>
            <div className="flex items-center">
            <p className="font-black uppercase">System:</p>
            <button className={`p-1 px-2 text-amber-500 font-bold m-2 rounded-lg hover:scale-105 duration-300 ${sysstatus ? "bg-green-600 text-white shadow-lg shadow-green-400/40" : " bg-gray-200 hover:bg-white animate-pulse" }`} onClick={() => setSysStatus(!sysstatus)}>
                {sysstatus? "ON":"OFF" }
            </button>
            <button className="rounded-full border border-white p-2 hover:scale-105 hover:bg-white duration-400 hover:fill-amber-500" onClick={toggleDark}>
                {dark ? <RiMoonClearFill className='text-white h-5 w-5'/>: <HiSun className='text-white h-5 w-5'/> }
                </button>
            </div>
        </nav>
    );
}

export default Navbar;