import { APILoader } from '@googlemaps/extended-component-library/react'
import { MapProvider } from './context/MapContext'
import { InputErrorsProvider } from './context/InputErrorsContext'
import { BrowserRouter } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import ResetInputErrors from './components/ResetInputErrors'
import Header from './components/Header'
import Router from './components/router/Router'

const App = () => {
  const API_KEY = import.meta.env.VITE_MAP_API_KEY;

  return (
    <APILoader apiKey={API_KEY}>
      <MapProvider>
        <InputErrorsProvider>
          <BrowserRouter>
            <ScrollToTop />
            <ResetInputErrors />
            <Header />
            <Router />
          </BrowserRouter>
        </InputErrorsProvider>
      </MapProvider>
    </APILoader>
  )
}

export default App
