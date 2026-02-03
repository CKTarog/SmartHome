import { useState, useEffect } from 'react'
import './App.css'
import {Navbar, ControlPanel, OffOverlay} from './Components';

function App() {
  //toggling dark mode: site will remember previous theme
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  //toggling on/off whole system
  const [sysstatus, setSysStatus] = useState();
  //toggling fan and getting fanspeed value
  const [fan, setFan] = useState();
  const [fanspeed, setSpeed] = useState(1);
  //just for the fan animation, 1 is fast, 5 is slowest
  const spinSpeed = {
    1: "2s",
    2: "1s",
    3: "0.8s",
  };

  //lights and brightness
  const [lights, setLights] = useState([
    { id: 1, on: false, brightness: 50 },
    { id: 2, on: false, brightness: 50 },
    { id: 3, on: false, brightness: 50 },
    { id: 4, on: false, brightness: 50 },
    { id: 5, on: false, brightness: 50 },
  ]);

  //save theme to localstorage
  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  //toggling dark mode
  const toggleDark = () => {
    setDark(prev => !prev);
  }


  //toggle light bulbs
  const toggleLight = (id) => {
  setLights(prev =>
    prev.map(light =>
      light.id === id
        ? { ...light, on: !light.on }
        : light
      )
    );
  };

  //setting brightness
  const setBrightness = (id, value) => {
  setLights(prev =>
    prev.map(light =>
      light.id === id
        ? { ...light, brightness: value }
        : light
      )
    );
  };

  //if system status is off, turn off fan and all lights
  useEffect(() => {
    if (!sysstatus) {
      setFan(false);
      setLights(prev =>
        prev.map(light => ({ ...light, on: false }))
      );
    }
  }, [sysstatus]);

  return (
      <section className={`${dark ? "dark" : ""} relative min-h-dvh bg-white text-black dark:bg-gray-700 dark:text-white duration-600 `}>
        <Navbar dark={dark} setDark={setDark} toggleDark={toggleDark} sysstatus={sysstatus} setSysStatus={setSysStatus}/>
        {sysstatus ? <></> : <OffOverlay/>}{/*show overlay if systems are off*/}
        <ControlPanel fan={fan} setFan={setFan} fanspeed={fanspeed} setSpeed={setSpeed} spinSpeed={spinSpeed} lights={lights} toggleLight={toggleLight} setBrightness={setBrightness}/>
      </section>
  )
}

export default App
