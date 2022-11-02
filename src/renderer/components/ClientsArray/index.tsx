import React, { useState, useContext, useEffect}  from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Client from "./interfaces";
import styles from './styles.module.sass'
import { SocketContext } from 'shared/constants'

interface ClientProps {
    lock:boolean;
    clients: Client[];

}
export const ClientsArray: React.FC<ClientProps> = ({lock, clients}: ClientProps) => {
    return (
        <>
            <ToastContainer />
            <table className={styles.table}>
                <tbody>
                <tr className={styles.header}>
                    <td>
                        <h4>Id</h4>
                    </td>
                    <td>
                        <h4>Nom</h4>
                    </td>
                    <td>
                        <h4>Prenom</h4>
                    </td>
                    
                    <td>
                        <h4>Adresse</h4>
                    </td>
                    <td>
                        <h4>Telephone</h4>
                    </td>
                </tr>
                {clients &&
                    clients.map((item, index) => {
                        return (
                            <ClientItem lock={lock} index={index} id={item.id} nom={item.nom} prenom={item.prenom} adresse={item.adresse} telephone={item.telephone}></ClientItem>
                        )
                    })
                }
                </tbody>
            </table>
        </>
    )
}


const ClientItem: React.FC<Client> = ({lock, index, id, nom, prenom, adresse, telephone}: Client) => {
    const [idI, setId] = useState(id);
    const [nomI, setNom] = useState(nom);
    const [prenomI, setPrenom] = useState(prenom);
    const [adresseI, setAdresse] = useState(adresse);
    const [telephoneI, setTelephone] = useState(telephone);
    const socket = useContext(SocketContext);

    useEffect(() => {
        setId(id);
        setNom(nom);
        setPrenom(prenom);
        setAdresse(adresse);
        setTelephone(telephone);
      }, [id,nom,prenom,adresse,telephone])


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if(idI && nomI.length<1 && prenomI.length<1 && adresseI.length<1 && telephoneI.length<1){
                console.log("suppression client...");
                socket.emit("deleteClient",{id:idI}, function (response) {
                    if(response){
                        console.log("err");
                        toast.error(response,{
                            closeOnClick: true,
                            theme: "light",
                            pauseOnHover: false
                        });
                    }
                });
            }
            else if(nomI.length>0 || prenomI.length>0 || adresseI.length>0 || telephoneI.length>0){
                console.log("insertion client...");
                socket.emit("insertClient",{index:index,id:idI,nom:nomI,prenom:prenomI,adresse:adresseI,telephone:telephoneI}, function (response) {});
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
                <input type="text" value={prenomI} disabled={(lock)? "disabled":""} onChange={(e) => setPrenom(e.target.value)}  onKeyDown={handleKeyDown} />
            </td>
            <td>
                <input type="text" value={adresseI} disabled={(lock)? "disabled":""} onChange={(e) => setAdresse(e.target.value)}  onKeyDown={handleKeyDown} />
            </td>
            <td>
                <input type="text" value={telephoneI} disabled={(lock)? "disabled":""} onChange={(e) => setTelephone(e.target.value)}  onKeyDown={handleKeyDown} />
            </td>
        </tr>
    )
}