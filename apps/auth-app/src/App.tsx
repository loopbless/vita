import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import { TRpcProvider } from './components/TRpcProvider'
import { Toaster, SonnerToaster } from '@vita/components'

function App() {
  const RouterView = useRoutes(routes)
  return (
    <TRpcProvider>
      <Suspense fallback={<p>Loading...</p>}>{RouterView}</Suspense>
      <Toaster />
      <SonnerToaster />
    </TRpcProvider>
  )
}

export default App
