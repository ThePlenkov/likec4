import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import DevApp from './DevApp'
import './main.css'
import DevEmbeded from './DevEmbeded'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DevEmbeded />
    {/* <DevApp /> */}
  </StrictMode>
)
