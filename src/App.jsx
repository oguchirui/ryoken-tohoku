import { APILoader } from '@googlemaps/extended-component-library/react'
import { MapProvider } from '@/contexts/MapContext'
import { ChangePasswordProvider } from '@/contexts/ChangePasswordContext'
import { InputErrorsProvider } from '@/contexts/InputErrorsContext'
import { HeaderHeightProvider } from '@/contexts/HeaderHeightContext'
import { DeleteModalProvider } from '@/contexts/DeleteModalContext'
import { BrowserRouter } from 'react-router-dom'
import Header from '@/components/Header'
import ChangePasswordModal from '@/components/modals/ChangePasswordModal'
import ScrollToTop from '@/effects/ScrollToTop'
import ResetInputErrors from '@/effects/ResetInputErrors'
import Router from '@/router/Router'

const App = () => {
  const API_KEY = import.meta.env.VITE_MAP_API_KEY;

  return (
    <APILoader apiKey={API_KEY}>
      <MapProvider>
        <ChangePasswordProvider>
          <InputErrorsProvider>
            <HeaderHeightProvider>
              <DeleteModalProvider>
                <BrowserRouter>
                  <Header />
                  <ChangePasswordModal />
                  <ScrollToTop />
                  <ResetInputErrors />
                  <Router />
                </BrowserRouter>
              </DeleteModalProvider>
            </HeaderHeightProvider>
          </InputErrorsProvider>
        </ChangePasswordProvider>
      </MapProvider>
    </APILoader>
  )
}

export default App
