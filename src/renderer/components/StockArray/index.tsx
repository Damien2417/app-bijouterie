import React, { useState, useContext, useEffect}  from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Stock from "./interfaces";
import styles from './styles.module.sass'
import { SocketContext } from 'shared/constants'

interface StockProps {
    lock:boolean;
    stock: Stock[];
}
export const StockArray: React.FC<StockProps> = ({lock, stock}: StockProps) => {
    return (
        <>
            <ToastContainer />
            <table className={styles.table}>
                <tbody>
                <tr className={styles.header}>
                    <td>
                        <h4>N°</h4>
                    </td>
                    <td>
                        <h4>Nom</h4>
                    </td>
                    <td>
                        <h4>Quantité</h4>
                    </td>
                </tr>
                {stock &&
                    stock.map((item, index) => {
                        return (
                            <StockItem lock={lock} index={index} id={item.id} nom={item.nom} quantite={item.quantite}></StockItem>
                        )
                    })
                }
                </tbody>
            </table>
        </>
    )
}


const StockItem: React.FC<Stock> = ({lock, index, id, nom, quantite}: Stock) => {
    const [idI, setId] = useState(id);
    const [nomI, setNom] = useState(nom);
    const [quantiteI, setQuantite] = useState(quantite);
    const socket = useContext(SocketContext);

    useEffect(() => {
        setId(id);
        setNom(nom);
        setQuantite(quantite);
      }, [id,nom,quantite])


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if(idI && nomI.length<1 && quantite.toString().length<1){
                console.log("suppression stock...");
                socket.emit("deleteStock",{id:idI}, function (response) {
                    if(response){
                        if(response.type=="error"){
                            toast.error(response.text,{
                                closeOnClick: true,
                                theme: "light",
                                pauseOnHover: false,
                                autoClose : 3000
                            });
                        }
                        else if(response.type=="success"){
                            toast.success(response.text,{
                                closeOnClick: true,
                                theme: "light",
                                pauseOnHover: false,
                                autoClose : 3000
                            });
                        }
                    }
                });
            }
            else if(nomI.length>0 || quantite.toString().length>0){
                console.log("insertion stock...");
                socket.emit("insertStock",{index:index,id:idI,nom:nomI,quantite:quantiteI}, function (response) {
                    if(response){
                        if(response.type=="error"){
                            toast.error(response.text,{
                                closeOnClick: true,
                                theme: "light",
                                pauseOnHover: false,
                                autoClose : 3000
                            });
                        }
                        else if(response.type=="success"){
                            toast.success(response.text,{
                                closeOnClick: true,
                                theme: "light",
                                pauseOnHover: false,
                                autoClose : 3000
                            });
                        }
                    }
                });
            }
        }
    }

    return (
        <tr>
            <td>
                <h5>{idI}</h5>
            </td>
            <td>
                <input type="text" value={nomI} disabled={(lock)? "disabled":""} onChange={(e) => setNom(e.target.value)} onKeyDown={handleKeyDown} />
            </td>
            <td>
                <input type="number" value={quantiteI} disabled={(lock)? "disabled":""} onChange={(e) => setQuantite(e.target.value)}  onKeyDown={handleKeyDown} />
            </td>
        </tr>
    )
}