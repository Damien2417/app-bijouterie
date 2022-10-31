import React, { useState, useContext}  from "react";
import Client from "./interfaces";
import styles from './styles.module.sass'
import { SocketContext } from 'shared/constants'

interface ClientProps {
    client: Client[];
}
export const ClientsArray: React.FC<ClientProps> = ({clients}: ClientProps) => {
    return (
       
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
                            <ClientItem index={index} id={item.id} nom={item.nom} prenom={item.prenom} adresse={item.adresse}  telephone={item.telephone}></ClientItem>
                        )
                    })
                }
                </tbody>
            </table>
       
    )
}


const ClientItem: React.FC<Client> = ({index, id, nom, prenom, adresse, telephone}: Client) => {
    const [nomI, setNom] = useState(nom);
    const [prenomI, setPrenom] = useState(prenom);
    const [adresseI, setAdresse] = useState(adresse);
    const [telephoneI, setTelephone] = useState(telephone);
    const socket = useContext(SocketContext);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            socket.emit("insertClient",{index:index,id:id,nom:nomI,prenom:prenomI,adresse:adresseI,telephone:telephoneI}, function (response) {})
        }
      }

    return <tr>
        <td>
            <h5>{id}</h5>
        </td>
        <td>
            <input type="text" value={nomI} onChange={(e) => setNom(e.target.value)} onKeyDown={handleKeyDown} />
        </td>
        <td>
            <input type="text" value={prenomI} onChange={(e) => setPrenom(e.target.value)}  onKeyDown={handleKeyDown} />
        </td>
        <td>
            <input type="text" value={adresseI} onChange={(e) => setAdresse(e.target.value)}  onKeyDown={handleKeyDown} />
        </td>
        <td>
            <input type="text" value={telephoneI} onChange={(e) => setTelephone(e.target.value)}  onKeyDown={handleKeyDown} />
        </td>
    </tr>
}