import React from 'react'
import {  NavigateFunction } from 'react-router-dom'
import { SideBarContainer, SideBarButton, Image } from 'renderer/components'

export function SideBar({ navigate } : NavigateFunction) {
  return (
    <SideBarContainer>
        <nav>
          <SideBarButton onClick={() => navigate('clients')}>
            <Image srcImage='userIcon.png'> </Image>
            &nbsp;&nbsp;Clients
          </SideBarButton>
          <SideBarButton onClick={() => navigate('anotherScreen')}>
            <Image srcImage='userIcon.png'> </Image>
            &nbsp;&nbsp;Ventes
          </SideBarButton>
        </nav>
    </SideBarContainer>
  )
}
