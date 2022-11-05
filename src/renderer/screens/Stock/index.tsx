import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Container } from 'renderer/components'
import styles from 'renderer/components/StockArray/styles.module.sass'
import { useWindowStore } from 'renderer/store'
import { SocketContext } from 'shared/constants'
import { StockArray } from '../../components/StockArray'
import TablePagination from '@mui/material/TablePagination';

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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalRows, setTotal] = useState(0);
  const [searching, setSearching] = useState("");

  const handleSearch = (event) => {
    setSearching(event.target.value);
    socket.emit("querySearchStock",{text:event.target.value,limit:rowsPerPage,offset:page*rowsPerPage}, function (response) {
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
    let method="getStock";
    if(searching){
      method = "querySearchStock";
    }
    socket.emit(method,{text:searching,limit:rowsPerPage,offset:page*rowsPerPage}, function (response) {
        setArray(response);
        if(response[0])
          setTotal(response[0].total);
    });
  }, [page,rowsPerPage])


  const addStock = useCallback((response) => {
    let check = false;
    let temp = stockFromDB.map(item => {
    if (item.id == response.id){ 
        check = true;
        return response;
      }
      return item;
    })

    if(!check){
      if(stockFromDB.length<rowsPerPage)
        setArray(stockFromDB => [...stockFromDB, response]);
      setTotal(totalRows+1);
    }
    else{
      setArray(temp);
    }
  }, [stockFromDB]);

  const deleteRowByIndex = useCallback((response) => {
    setArray(stockFromDB => {
      return stockFromDB.filter((value, i) => i != response);
    });
    if(stockFromDB.length == 0 && page>0)
      setPage(page-1);
  }, [stockFromDB]);

  const deleteRowById = useCallback((response) => {
    let temp = stockFromDB.filter((value) => value.id != response.id);
    setArray(temp);
    if(temp.length == 0 && page>0)
      setPage(page-1);
    setTotal(totalRows-1);
  }, [stockFromDB]);

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

  useEffect(() => {
    //App.sayHelloFromBridge()
    App.whenAboutWindowClose(({ message }) => {
      console.log(message);
      store.setAboutWindowState(false);
    })
  }, [socket])

  function defaultLabelDisplayedRows({ from, to, count }) { return `${from}–${to} de ${count !== -1 ? count : `plus de ${to}`}`; }

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
              <input type="text" placeholder="Recherche..." onChange={handleSearch}></input>
              <div className={styles.icon} onClick={(lockArray)}>{lock ? "🔒" : "🔓"}</div>
            </Container>
          </div>
          
          <div className={styles.overflow}>
            <StockArray lock={lock} stock={stockFromDB}/>
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
          <Button onClick={addEmptyRow}>Ajouter</Button>
        </Container>
      </Container>
  )
}
