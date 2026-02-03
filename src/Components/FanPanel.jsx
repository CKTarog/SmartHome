import { PiFanFill } from "react-icons/pi";

const FanPanel = ({fan, setFan, fanspeed, setSpeed, spinSpeed}) => {
    //for speed indicators
    const steps = [1, 2, 3];
    return(
    <div className="rounded-2xl shadow-2xl">
      <h1 className="m-4 text-center text-4xl font-black">FAN MOTOR</h1>

      <div className="flex flex-col justify-center">
        <button className={`w-30 self-center text-white rounded-2xl font-bold p-2 duration-300 hover:scale-110 ${fan ? "bg-amber-400" : "bg-gray-500"}`} onClick={() => setFan(!fan) } >
          {fan ? "ON" : "OFF"}  
        </button>
        <PiFanFill className={`m-10 lg:my-15 h-60 w-60 self-center ${fan ? "animate-spin " : ""}`} style={{ animationDuration: spinSpeed[fanspeed] }}/>
        <div className="m-2 mx-25 flex items-center justify-center">
          <input type="range" min="1" max="3" value={fanspeed} onChange={(e) => setSpeed(Number(e.target.value))} className="appearance-none bg-transparent w-40 
          [&::-webkit-slider-runnable-track]:rounded-full 
          [&::-webkit-slider-runnable-track]:dark:bg-black/25 
          [&::-webkit-slider-runnable-track]:bg-gray-400/25 
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:h-7 
          [&::-webkit-slider-thumb]:w-7
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-amber-400"/>
        </div>
        <div className="flex justify-center space-x-15">
            {steps.map((s) => (
            <div key={s} className={`text-sm font-bold cursor-pointer transition-colors ${s === fanspeed ? "text-amber-400" : "text-gray-400 dark:text-gray-500"}`}>
              {s}
            </div>
          ))}
        </div>
        <p className="mt-2 text-center font-mono text-lg font-bold">SPEED</p>
      </div>
    </div>
    );
}

export default FanPanel;