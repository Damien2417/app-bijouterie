import { useEffect } from 'react'

import { Container, Heading, ClientsArray} from 'renderer/components'
import { useWindowStore } from 'renderer/store'

// The "App" comes from the context bridge in preload/index.ts
const { App } = window

export function MainScreen() {
  const store = useWindowStore().about
  
  useEffect(() => {
    //App.sayHelloFromBridge()

    App.whenAboutWindowClose(({ message }) => {
      console.log(message)

      store.setAboutWindowState(false)
    })
  }, [])

  function openAboutWindow() {
    App.createAboutWindow()
    store.setAboutWindowState(true)
  }

  return (
      <Container className='main'>
        <Container>
          <Heading>Bonjour, {App.username || 'Yannis'}! 👋</Heading>
            <h2>C'est l'heure de travailler ! ✨</h2>
        </Container>
      </Container>
  )
}
