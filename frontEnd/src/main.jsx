import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainRoutes from './app/MainRoutes';
import {Provider} from 'react-redux';
import {store} from './app/store'
import {BrowserRouter} from 'react-router-dom'
import ErrorBoundary from './components/common/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
          <MainRoutes/>
      </BrowserRouter>
    </Provider>
    </ErrorBoundary>
  </StrictMode>
)

// import React from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// const rootElement = document.getElementById('root')
// if (rootElement) {
//   createRoot(rootElement).render(
//     <div style={{ fontSize: '32px', textAlign: 'center', marginTop: '50px' }}>
//       ✅ Hello is working!
//     </div>
//   )
// } else {
//   console.error('❌ No root element found')
// }
