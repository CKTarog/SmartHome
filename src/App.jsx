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
    { id: 1, on: false, brightness: 1 },
    { id: 2, on: false, brightness: 1 },
    { id: 3, on: false, brightness: 1 },
    { id: 4, on: false, brightness: 1 },
    { id: 5, on: false, brightness: 1 },
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
  
    //API STUFF
  useEffect(() => {
    fetch('http://localhost/ArduinoStuff/SmartHomeTest/api.php') //CHANGE TO THE LINK TO UR DIRECTORY TO api.php FILE
      .then(res => res.json())
      .then(data => {if (!data) return;
        setSysStatus(data.master === 1);

        setFan(data.dcMotor === 1);
        setSpeed(data.dcMotor_speed || 1);

        // lights
        setLights([
          { id: 1, on: data.led1 === 1, brightness: data.led1_value },
          { id: 2, on: data.led2 === 1, brightness: data.led2_value },
          { id: 3, on: data.led3 === 1, brightness: data.led3_value },
          { id: 4, on: data.led4 === 1, brightness: data.led4_value },
          { id: 5, on: data.led5 === 1, brightness: data.led5_value },
        ]);
      })
      .catch(err => console.error("GET error:", err));
  }, []);

  const updateState = () => {
    const payload = {
      //if master switch is true, return 1 (true), else 0 (false)
      master: sysstatus ? 1 : 0,

      //if led[num] is on, return 1 (true), else 0 (false) & return led brightness to current selected
      led1: lights[0].on ? 1 : 0, led1_value: lights[0].brightness,
      led2: lights[1].on ? 1 : 0, led2_value: lights[1].brightness,
      led3: lights[2].on ? 1 : 0, led3_value: lights[2].brightness,
      led4: lights[3].on ? 1 : 0, led4_value: lights[3].brightness,
      led5: lights[4].on ? 1 : 0, led5_value: lights[4].brightness,
      
      //if fan is true, return 1 (true), else 0 (false) & return motor speed to current fanspeed
      dcMotor: fan ? 1 : 0, dcMotor_speed: fanspeed
    };

    fetch('http://localhost/ArduinoStuff/SmartHomeTest/api.php', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => console.log("POST response:", data))
      .catch(err => console.error("POST error:", err));
  };
  useEffect(() => {
    if (sysstatus !== undefined) {
      updateState();
    }
  }, [sysstatus, fan, fanspeed, lights]);

  return (
      <body className={`${dark ? "dark" : ""} min-h-dvh bg-white text-black dark:bg-gray-700 dark:text-white duration-600`}>
        <Navbar dark={dark} setDark={setDark} toggleDark={toggleDark} sysstatus={sysstatus} setSysStatus={setSysStatus}/>
        {sysstatus ? <></> : <OffOverlay/>}{/*show overlay if systems are off*/}
        <ControlPanel fan={fan} setFan={setFan} fanspeed={fanspeed} setSpeed={setSpeed} spinSpeed={spinSpeed} lights={lights} toggleLight={toggleLight} setBrightness={setBrightness}/>
      </body>
  )
}

export default App
