import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { SocketContext } from 'shared/constants'
import styles from 'renderer/components/ClientsArray/styles.module.sass'
import { Container, ClientsArray, Button} from 'renderer/components'
import { useWindowStore } from 'renderer/store'

// The "App" comes from the context bridge in preload/index.ts
const { App } = window
/*const func = async () => {
  const response = await App.clients()
  console.log(response) // Affichera 'pong'
}*/

export function ClientScreen() {
  //const navigate = useNavigate()
  const store = useWindowStore().about
  const socket = useContext(SocketContext);

  
  const [clientsFromDB, setArray] = useState([])


  useEffect(() => {
    //App.sayHelloFromBridge()

    socket.emit("getClients",999, function (response) {
        setArray(response)
    })

    App.whenAboutWindowClose(({ message }) => {
      console.log(message)

      store.setAboutWindowState(false)
    })
  }, [socket])

  
  function openAboutWindow() {
    App.createAboutWindow()
    store.setAboutWindowState(true)
  }

  socket.on("addClient", (response) => {
    let check = false
    setArray(clientsFromDB.map(item => {
      if (item.id == response.id){ 
        check = true
        return response
      }
      return item
    }))
    if(!check){
      setArray([...clientsFromDB, ...[response]])
    }
  })

  socket.on("deleteRowByIndex", (response) => {
    setArray(clientsFromDB => {
      return clientsFromDB.filter((value, i) => i !== response)
    })
  })


  socket.on("deleteRowById", (response) => {
    setArray(clientsFromDB => {
      return clientsFromDB.filter((value) => value.id !== response)
    })
  })

  function addClient(){
    const rowsInput=[{
      id:'',
      nom:'',
      prenom:'',
      adresse:'',
      telephone:''
    }]
    setArray([...clientsFromDB, ...rowsInput])
  }


  return (
      <Container>
        <Container>
          <div className={styles.overflow}>
            <h2>Vos clients</h2>
            <ClientsArray clients={clientsFromDB}/>
            <Button onClick={addClient}>Ajouter</Button>
          </div>
        </Container>
      </Container>
  )
}
