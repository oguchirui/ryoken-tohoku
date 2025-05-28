import { APILoader } from '@googlemaps/extended-component-library/react'
import { MapProvider } from './context/MapContext'
import { ChangePasswordProvider } from './context/ChangePasswordContext'
import { InputErrorsProvider } from './context/InputErrorsContext'
import { BrowserRouter } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import ResetInputErrors from './components/ResetInputErrors'
import ChangePasswordModal from './components/ChangePasswordModal'
import Header from './components/Header'
import Router from './components/router/Router'

const App = () => {
  const API_KEY = import.meta.env.VITE_MAP_API_KEY;

  return (
    <APILoader apiKey={API_KEY}>
      <MapProvider>
        <ChangePasswordProvider>
          <InputErrorsProvider>
            <BrowserRouter>
              <ScrollToTop />
              <ResetInputErrors />
              <ChangePasswordModal />
              <Header />
              <Router />
            </BrowserRouter>
          </InputErrorsProvider>
        </ChangePasswordProvider>
      </MapProvider>
    </APILoader>
  )
}

export default App
