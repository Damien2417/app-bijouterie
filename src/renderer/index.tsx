import ReactDom from 'react-dom/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom';

import { WindowStoreProvider } from './store'
import { AppRoutes } from './routes'
import { SocketContext, socket } from 'shared/constants'

import 'resources/styles/globals.sass'

ReactDom.createRoot(document.querySelector('app') as HTMLElement).render(
  <SocketContext.Provider value={socket}>
    <React.StrictMode>
      <WindowStoreProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      </WindowStoreProvider>
    </React.StrictMode>
  </SocketContext.Provider>

)
