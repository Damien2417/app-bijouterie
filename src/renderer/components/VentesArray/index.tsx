import React, { useState, useContext, useEffect}  from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Vente from "./interfaces";
import styles from './styles.module.sass'
import { SocketContext } from 'shared/constants'

interface VentesProps {
    ventes: Vente[];
}
export const VentesArray: React.FC<VentesProps> = ({ventes}: VentesProps) => {
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
                        <h4>Nom article</h4>
                    </td>
                    <td>
                        <h4>Nom client</h4>
                    </td>
                    <td>
                        <h4>Prenom client</h4>
                    </td>
                    <td>
                        <h4>Quantité</h4>
                    </td>
                    <td>
                        <h4>Date</h4>
                    </td>
                </tr>
                {ventes &&
                    ventes.map((item, index) => {
                        return (
                            <VenteItem index={index} id={item.id} nomArticle={item.nomArticle} clientNom={item.clientNom} clientPrenom={item.clientPrenom}  quantite={item.quantite} date={item.date}></VenteItem>
                        )
                    })
                }
                </tbody>
            </table>
        </>
    )
}


const VenteItem: React.FC<Vente> = ({index, id, nomArticle, clientNom, clientPrenom, quantite, date}: Vente) => {
    const [idI, setId] = useState(id);
    const [nomArticleI, setnomArticle] = useState(nomArticle);
    const [clientNomI, setclientNom] = useState(clientNom);
    const [clientPrenomI, setclientPrenom] = useState(clientPrenom);
    const [quantiteI, setQuantite] = useState(quantite);
    const [dateI, setDate] = useState(date);
    const socket = useContext(SocketContext);

    useEffect(() => {
        setId(id);
        setnomArticle(nomArticle);
        setclientNom(clientNom);
        setclientPrenom(clientPrenom);
        setQuantite(quantite);
        setDate(date);
      }, [id,nomArticle,clientNom,quantite,date])


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if(idI && nomArticleI.length<1 && clientNomI.length<1 && clientPrenomI.length<1 && quantiteI.toString().length<1 && dateI.length<1){
                console.log("suppression vente...");
                socket.emit("deleteVente",{id:idI}, function (response) {
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
            else if(nomArticleI.length>0 || clientNomI.length>0 || clientPrenomI.length>0 || quantiteI.length>0 || dateI.length>0){
                console.log("insertion vente...");
                socket.emit("insertVente",{index:index,id:idI,nomArticle:nomArticleI,clientNom:clientNomI,clientPrenom:clientPrenomI,quantite:quantiteI,date:dateI}, function (response) {
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
                <input type="text" value={nomArticleI} disabled={"disabled"} onChange={(e) => setnomArticle(e.target.value)} onKeyDown={handleKeyDown} />
            </td>
            <td>
                <input type="text" value={clientNomI} disabled={"disabled"} onChange={(e) => setclientNom(e.target.value)}  onKeyDown={handleKeyDown} />
            </td>
            <td>
                <input type="text" value={clientPrenomI} disabled={"disabled"} onChange={(e) => setclientPrenom(e.target.value)}  onKeyDown={handleKeyDown} />
            </td>
            <td>
                <input type="text" value={quantiteI} disabled={"disabled"} onChange={(e) => setQuantite(e.target.value)}  onKeyDown={handleKeyDown} />
            </td>
            <td>
                <input type="text" value={dateI} disabled={"disabled"} onChange={(e) => setDate(e.target.value)}  onKeyDown={handleKeyDown} />
            </td>
        </tr>
    )
}