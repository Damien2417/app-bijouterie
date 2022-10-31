export * from './environment'
export * from './platform'
export * from './ipc'

import socketio from 'socket.io-client'
import React from 'react'

export const socket = socketio.connect('http://217.160.174.43:3000')
export const SocketContext = React.createContext()
