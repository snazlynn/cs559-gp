import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <iframe
        title="main"
        src="../for_students/main.html"
        class="includebox includebox-standard"
        width="100%"
        height="100%"
        scrolling="no"
        frameborder="0"
        id="box-iframe-main"
    ></iframe>
    </>
  )
}

export default App
