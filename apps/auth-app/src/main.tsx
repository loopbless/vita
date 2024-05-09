import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@unocss/reset/tailwind.css'
import App from './App.tsx'
import 'uno.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
