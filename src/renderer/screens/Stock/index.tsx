import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Container } from 'renderer/components'
import styles from 'renderer/components/ClientsArray/styles.module.sass'
import { useWindowStore } from 'renderer/store'
import { SocketContext } from 'shared/constants'
import { StockArray } from '../../components/StockArray'

// The "App" comes from the context bridge in preload/index.ts
const { App } = window;
/*const func = async () => {
  const response = await App.clients()
  console.log(response) // Affichera 'pong'
}*/

export function StockScreen() {
  //const navigate = useNavigate()
  const store = useWindowStore().about;
  const socket = useContext(SocketContext);
  const [stockFromDB, setArray] = useState([])
  const [lock, setLock] = useState(true);

  const handleSearch = (event) => {
    socket.emit("querySearchStock",event.target.value, function (response) {
      setArray(response);
    });
  };

  function lockArray() {
      setLock(!lock);
  }
  
  const addStock = useCallback((response) => {
    let check = false;
      setArray(stockFromDB.map(item => {
        if (item.id == response.id){ 
          check = true;
          return response;
        }
        return item;
      }))
      if(!check){
        setArray(stockFromDB => [...stockFromDB, response]);
      }
  }, [stockFromDB]);

  const deleteRowByIndex = useCallback((response) => {
    setArray(stockFromDB => {
      return stockFromDB.filter((value, i) => i != response);
    });
  }, [stockFromDB]);

  const deleteRowById = useCallback((response) => {
    setArray(stockFromDB => {
      return stockFromDB.filter((value) => value.id != response.id);
    });
  }, [stockFromDB]);


  useEffect(() => {
    //App.sayHelloFromBridge()
    socket.emit("getStock",999, function (response) {
        setArray(response);
    });

    App.whenAboutWindowClose(({ message }) => {
      console.log(message);
      store.setAboutWindowState(false);
    })
  }, [socket])

  useEffect(() => {
    socket.on("addStock", addStock);
    socket.on("deleteRowByIndex", deleteRowByIndex);
    socket.on("deleteRowById", deleteRowById);
    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("addStock", addStock);
      socket.off("deleteRowByIndex", deleteRowByIndex);
      socket.off("deleteRowById", deleteRowById);
    };
  }, [stockFromDB])

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
    setArray([...stockFromDB, ...rowsInput]);
  }
  return (
      <Container>
        <Container>
          <h2>Votre stock</h2>
          <div className={styles.arrayControls}>
            <Container>
              <input type="text" onChange={handleSearch}></input>
              <div className={styles.icon} onClick={(lockArray)}>{lock ? "🔒" : "🔓"}</div>
            </Container>
          </div>
          
          <div className={styles.overflow}>
            <StockArray lock={lock} stock={stockFromDB}/>
          </div>
          <Button onClick={addEmptyRow}>Ajouter</Button>
        </Container>
      </Container>
  )
}
