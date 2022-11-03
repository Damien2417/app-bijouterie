import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext, useCallback } from 'react'
import { SocketContext } from 'shared/constants'
import styles from 'renderer/components/ClientsArray/styles.module.sass'
import { Container, ClientsArray, Button, Image} from 'renderer/components'
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
  const [lock, setLock] = useState(true);

  const handleSearch = (event) => {
    socket.emit("querySearch",event.target.value, function (response) {
      setArray(response)
    })
  };

  function lockArray() {
      setLock(!lock)
  }
  
  const addClient = useCallback((response) => {
    let check = false
      setArray(clientsFromDB.map(item => {
        if (item.id == response.id){ 
          check = true
          return response
        }
        return item
      }))
      if(!check){
        setArray(clientsFromDB => [...clientsFromDB, response]);
      }
  }, [clientsFromDB]);

  const deleteRowByIndex = useCallback((response) => {
    setArray(clientsFromDB => {
      return clientsFromDB.filter((value, i) => i !== response)
    })
  }, [clientsFromDB]);

  const deleteRowById = useCallback((response) => {
    setArray(clientsFromDB => {
      return clientsFromDB.filter((value) => value.id !== response.id)
    })
  }, [clientsFromDB]);


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

  useEffect(() => {
    socket.on("addClient", addClient);
    socket.on("deleteRowByIndex", deleteRowByIndex);
    socket.on("deleteRowById", deleteRowById);
    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("addClient", addClient);
      socket.off("deleteRowByIndex", deleteRowByIndex);
      socket.off("deleteRowById", deleteRowById);
    };
  }, [clientsFromDB])

  function openAboutWindow() {
    App.createAboutWindow()
    store.setAboutWindowState(true)
  }

  function addEmptyRow(){
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
          <h2>Vos clients</h2>
          <div className={styles.arrayControls}>
            <Container>
              <input type="text" onChange={handleSearch}></input>
              <div className={styles.icon} onClick={(lockArray)}>{lock ? "🔒" : "🔓"}</div>
            </Container>
          </div>
          
          <div className={styles.overflow}>
            <ClientsArray lock={lock} clients={clientsFromDB}/>
          </div>
          <Button onClick={addEmptyRow}>Ajouter</Button>
        </Container>
      </Container>
  )
}
