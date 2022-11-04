import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Container } from 'renderer/components'
import styles from 'renderer/components/ClientsArray/styles.module.sass'
import { useWindowStore } from 'renderer/store'
import { SocketContext } from 'shared/constants'
import { VentesArray } from '../../components/VentesArray'
import { useNavigate } from 'react-router-dom'

// The "App" comes from the context bridge in preload/index.ts
const { App } = window;
/*const func = async () => {
  const response = await App.clients()
  console.log(response) // Affichera 'pong'
}*/

export function VentesScreen() {
  //const navigate = useNavigate()
  const store = useWindowStore().about;
  const socket = useContext(SocketContext);
  const [ventesFromDB, setArray] = useState([])
  const [lock, setLock] = useState(true);

  const handleSearch = (event) => {
    socket.emit("querySearchVentes",event.target.value, function (response) {
      setArray(response);
    });
  };

  function lockArray() {
      setLock(!lock);
  }
  
  const addVentes = useCallback((response) => {
    let check = false;
      setArray(ventesFromDB.map(item => {
        if (item.id == response.id){ 
          check = true;
          return response;
        }
        return item;
      }))
      if(!check){
        setArray(ventesFromDB => [...ventesFromDB, response]);
      }
  }, [ventesFromDB]);

  const deleteRowByIndex = useCallback((response) => {
    setArray(ventesFromDB => {
      return ventesFromDB.filter((value, i) => i != response);
    });
  }, [ventesFromDB]);

  const deleteRowById = useCallback((response) => {
    setArray(ventesFromDB => {
      return ventesFromDB.filter((value) => value.id != response.id);
    });
  }, [ventesFromDB]);


  useEffect(() => {
    //App.sayHelloFromBridge()
    socket.emit("getVentes",999, function (response) {
        setArray(response);
        console.log(response);
    });

    App.whenAboutWindowClose(({ message }) => {
      console.log(message);
      store.setAboutWindowState(false);
    })
  }, [socket])

  useEffect(() => {
    socket.on("addVentes", addVentes);
    socket.on("deleteRowByIndex", deleteRowByIndex);
    socket.on("deleteRowById", deleteRowById);
    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("addVentes", addVentes);
      socket.off("deleteRowByIndex", deleteRowByIndex);
      socket.off("deleteRowById", deleteRowById);
    };
  }, [ventesFromDB])

  function openAboutWindow() {
    App.createAboutWindow();
    store.setAboutWindowState(true);
  }

  function addEmptyRow(){
    const rowsInput=[{
      id:'',
      nom:'',
      prenom:'',
      adresse:'',
      telephone:''
    }];
    setArray([...ventesFromDB, ...rowsInput]);
  }
  const navigate = useNavigate()
  return (
      <Container>
        <Container>
          <h2>Vos ventes</h2>
          <div className={styles.arrayControls}>
            <Container>
              <input type="text" onChange={handleSearch}></input>
            </Container>
          </div>
          
          <div className={styles.overflow}>
            <VentesArray ventes={ventesFromDB}/>
          </div>
          <Button onClick={() => navigate('/anotherScreen')}>Ajouter</Button>
        </Container>
      </Container>
  )
}
