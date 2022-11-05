import { useEffect, useState, useContext, useCallback } from 'react'
import { SocketContext } from 'shared/constants'
import styles from 'renderer/components/ClientsArray/styles.module.sass'
import { Container, ClientsArray, Button, Image} from 'renderer/components'
import { useWindowStore } from 'renderer/store'
import TablePagination from '@mui/material/TablePagination';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

// The "App" comes from the context bridge in preload/index.ts
const { App } = window;
/*const func = async () => {
  const response = await App.clients()
  console.log(response) // Affichera 'pong'
}*/

export function ClientScreen() {
  //const navigate = useNavigate()
  const store = useWindowStore().about;
  const socket = useContext(SocketContext);
  const [clientsFromDB, setArray] = useState([])
  const [lock, setLock] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalRows, setTotal] = useState(0);
  const [searching, setSearching] = useState("");

  const handleSearch = (event) => {
    setSearching(event.target.value);
    socket.emit("querySearchClients",{text:event.target.value,limit:rowsPerPage,offset:page*rowsPerPage}, function (response) {
      setArray(response);
      if(response[0])
        setTotal(response[0].total);
    });
  };

  function lockArray() {
      setLock(!lock);
  }
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  

  useEffect(() => {
    let method="getClients";
    if(searching){
      method = "querySearchClients";
    }
    socket.emit(method,{text:searching,limit:rowsPerPage,offset:page*rowsPerPage}, function (response) {
        setArray(response);
        if(response[0])
          setTotal(response[0].total);
    });
  }, [page,rowsPerPage])


  const addClient = useCallback((response) => {
    let check = false;
    let temp = clientsFromDB.map(item => {
    if (item.id == response.id){ 
        check = true;
        return response;
      }
      return item;
    })

    if(!check){
      if(clientsFromDB.length<rowsPerPage)
        setArray(clientsFromDB => [...clientsFromDB, response]);
      setTotal(totalRows+1);
    }
    else{
      setArray(temp);
    }
  }, [clientsFromDB]);

  const deleteRowByIndex = useCallback((response) => {
    setArray(clientsFromDB => {
      return clientsFromDB.filter((value, i) => i != response);
    });
    if(clientsFromDB.length == 0 && page>0)
      setPage(page-1);
  }, [clientsFromDB]);

  const deleteRowById = useCallback((response) => {
    let temp = clientsFromDB.filter((value) => value.id != response.id);
    setArray(temp);
    if(temp.length == 0 && page>0)
      setPage(page-1);
    setTotal(totalRows-1);
  }, [clientsFromDB]);

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

  useEffect(() => {
    //App.sayHelloFromBridge()
    App.whenAboutWindowClose(({ message }) => {
      console.log(message);
      store.setAboutWindowState(false);
    })
  }, [socket])

  

  function openAboutWindow() {
    App.createAboutWindow();
    store.setAboutWindowState(true);
  }
  function defaultLabelDisplayedRows({ from, to, count }) { return `${from}–${to} de ${count !== -1 ? count : `plus de ${to}`}`; }

  function addEmptyRow(){
    const rowsInput=[{
      id:'',
      nom:'',
      prenom:'',
      adresse:'',
      telephone:''
    }];
    setArray([...clientsFromDB, ...rowsInput]);
  }
  return (
      <Container>
        <Container>
          <h2>Vos clients</h2>
          <div className={styles.arrayControls}>
            <Container>
              <input type="text" placeholder="Recherche..." onChange={handleSearch}></input>
              <div className={styles.icon} onClick={(lockArray)}>{lock ? "🔒" : "🔓"}</div>
            </Container>
          </div>
          
          <div className={styles.overflow}>
            <ClientsArray lock={lock} clients={clientsFromDB}/>
            <TablePagination
              component="div"
              count={totalRows}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={"Lignes par page:"}
              labelDisplayedRows={defaultLabelDisplayedRows}
            />
          </div>
          <Fab onClick={addEmptyRow} style={{backgroundColor: "#4459E8",color:"white"}}>
            <AddIcon />
          </Fab>
          <Button onClick={addEmptyRow}>Ajouter</Button>
          
        </Container>
      </Container>
  )
}
