import LightPanel from "./LightPanel";
import FanPanel from "./FanPanel";

const ControlPanel = ({fan, setFan, fanspeed, setSpeed, spinSpeed, lights, toggleLight, setBrightness}) => {
    return(
    <>
        <h1 className="m-2 mt-8 text-center text-4xl font-black text-amber-400 uppercase md:text-6xl">Control Panel</h1>
        <article className="m-8 flex flex-col justify-center space-y-10 lg:grid lg:grid-cols-2 lg:gap-8">
            <LightPanel lights={lights} toggleLight={toggleLight} setBrightness={setBrightness}/>
            <FanPanel fan={fan} setFan={setFan}  fanspeed={fanspeed} setSpeed={setSpeed} spinSpeed={spinSpeed}/>
        </article>
    </>
    );
}

export default ControlPanel;