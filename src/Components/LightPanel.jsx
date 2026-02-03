import { IoMdBulb } from "react-icons/io"; //lowest  brightness
import { TbBulbFilled } from "react-icons/tb"; //highest brightness
import { IoBulb } from "react-icons/io5"; //bulb

const LightPanel = ({ lights, toggleLight, setBrightness}) => {
    return (
    <div className="rounded-2xl shadow-2xl">
      <h1 className="m-4 text-center text-4xl font-black">LIGHTS</h1>

      <div className="flex flex-wrap justify-center">
        {lights.map(light => (
          <div key={light.id} className={`m-4 rounded-2xl p-4 shadow-lg duration-500 hover:shadow-amber-600/30`}>
            <IoBulb onClick={() => toggleLight(light.id)} className={`m-8 h-20 w-20 cursor-pointer rounded-full duration-400 hover:scale-105 ${light.on ? "opacity-100 text-amber-400 drop-shadow-lg drop-shadow-amber-200/40" : "opacity-40 hover:opacity-100"}`}/>
            <p className="text-center text-lg font-black uppercase">Light {light.id}</p>
            <div className="m-1 flex items-center justify-center">
              <IoMdBulb className="mr-1 h-3 w-3 opacity-70" />
              <input type="range" min="0" max="4" value={light.brightness} onChange={(e) =>setBrightness(light.id, Number(e.target.value)) } className="w-22 bg-transparent appearance-none
              [&::-webkit-slider-runnable-track]:rounded-full 
            [&::-webkit-slider-runnable-track]:bg-black/25 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-amber-600"/>
              <TbBulbFilled className="ml-1 h-3 w-3" />
            </div>
            <p className="text-center font-mono text-xs font-extralight">Brightness</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LightPanel;