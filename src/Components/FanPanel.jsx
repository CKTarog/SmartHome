import { PiFanFill } from "react-icons/pi";

const FanPanel = ({fan, setFan}) => {
    return(
    <div className="rounded-2xl shadow-2xl">
      <h1 className="m-4 text-center text-4xl font-black">FAN MOTOR</h1>
      <div className="flex flex-col flex-wrap justify-center">
        <button className={`w-30 self-center rounded-2xl font-bold p-2 duration-300 hover:scale-110 ${fan ? "bg-amber-600" : "bg-gray-500"}`} onClick={() => setFan(!fan) } >
          {fan ? "ON" : "OFF"}  
        </button>
        <PiFanFill className={`m-10 h-60 w-60 self-center rounded-full ${fan ? "animate-spin " : ""}`}/>
        <div className="m-2 mx-25 flex shrink items-center justify-center">
          <p className="mr-2 h-6 w-6 rounded-full bg-gray-500"></p>
          <input type="range" id="speed" min="0" max="3" className="appearance-none bg-transparent w-full 
          [&::-webkit-slider-runnable-track]:rounded-full 
          [&::-webkit-slider-runnable-track]:bg-black/25 
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:h-7 
          [&::-webkit-slider-thumb]:w-7
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-amber-600"/>
          <p className="ml-2 h-6 w-6 rounded-full bg-gray-200"></p>
        </div>
        <p className="text-center font-mono text-lg font-bold">SPEED</p>
        <p className="text-center font-mono text-2xl font-light">20<span className="text-xs opacity-50">/100</span></p>
      </div>
    </div>
    );
}

export default FanPanel;