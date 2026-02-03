import { useState, useEffect } from 'react'
import './App.css'
import {Navbar, ControlPanel, OffOverlay} from './Components';

function App() {
  const [dark, setDark] = useState();
  const [sysstatus, setSysStatus] = useState();
  const [fan, setFan] = useState();
  const [fanspeed, setSpeed] = useState('');
  //lights
  const [lights, setLights] = useState([
    { id: 1, on: false, brightness: 50 },
    { id: 2, on: false, brightness: 50 },
    { id: 3, on: false, brightness: 50 },
    { id: 4, on: false, brightness: 50 },
    { id: 5, on: false, brightness: 50 },
  ]);

  const toggleLight = (id) => {
  setLights(prev =>
    prev.map(light =>
      light.id === id
        ? { ...light, on: !light.on }
        : light
      )
    );
  };

  const setBrightness = (id, value) => {
  setLights(prev =>
    prev.map(light =>
      light.id === id
        ? { ...light, brightness: value }
        : light
      )
    );
  };

  useEffect(() => {
  if (!sysstatus) {
    setFan(false);
    setLights(prev =>
      prev.map(light => ({ ...light, on: false }))
    );
  }
}, [sysstatus]);

  return (
      <section className="relative min-h-dvh bg-gray-700 text-white">
        <Navbar dark={dark} setDark={setDark} sysstatus={sysstatus} setSysStatus={setSysStatus}/>
        {sysstatus ? "" : <OffOverlay/>}
        <ControlPanel fan={fan} setFan={setFan} sysstatus={sysstatus} lights={lights} toggleLight={toggleLight} setBrightness={setBrightness}/>
      </section>
  )
}

export default App
