import { useEffect, useState } from "react";
import Header from "../presentational/Header";
import user from "../../assets/user.png";
import { Modal } from "@material-ui/core" 
import styles from "../../Styles/styles.module.css";
import Swal from "sweetalert2";


const idb =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;


  // Creación BD con IndexDB
const insertDataInIndexedDb = () => {

  if (!idb) {
    console.log("Este navegador no es compatible con IndexedDB");
    return;
  }
  const request = idb.open("test-db", 1);
  request.onerror = function (event) {
    console.error("Ocurrió un error con IndexedDB");
    console.error(event);
  };
  request.onupgradeneeded = function (event) {
    console.log(event);
    const db = request.result;

    if (!db.objectStoreNames.contains("userData")) {
      const objectStore = db.createObjectStore("userData", { keyPath: "id" });

      objectStore.createIndex("client", "client", {
        unique: false,
      });
    }
  };

  request.onsuccess = function () {
    console.log("Base de datos abierta con éxito");

  };
};


const Clients = () => {

  const [allUsers, setAllUsers] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cedula, setCedula] = useState('');
  const [estado, setEstado] = useState("");
  const [modal, setModal]=useState(false);




  const abrirCerrarModal =()=>{
    setModal(!modal);
  }


  useEffect(() => {
    insertDataInIndexedDb();
    getAllData();
   
  }, []);

  
  const getAllData = () => {
    const dbPromise = idb.open("test-db", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;

      var tx = db.transaction("userData", "readonly");
      var userData = tx.objectStore("userData");
      const users = userData.getAll();

      users.onsuccess = (query) => {
        setAllUsers(query.srcElement.result);
      };

      tx.oncomplete = function () {
        db.close();
      };
    };
  };

  const handleSubmit = (event) => {
    const dbPromise = idb.open("test-db", 1);
    console.log(addUser, editUser);

    if (fullName && phone && email) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;

        var tx = db.transaction("userData", "readwrite");
        var userData = tx.objectStore("userData");

        console.log(addUser, editUser);
        console.log(addUser, editUser);
        if (addUser) {
          const users = userData.put({
            id: allUsers?.length + 1,
            fullName,
            email,
            cedula,
            phone,
            estado,
            
          });

          console.log("add");
          users.onsuccess = (query) => {
            tx.oncomplete = function () {
              db.close();
            };
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Usuario Agregado',
              showConfirmButton: false,
              timer: 1500,
            })
            setFullName("");
            setEmail("");
            setCedula('');
            setPhone("");
            setEstado('');
            setAddUser(false);
            getAllData();
            event.preventDefault();
          };
          window.location.reload(true);

        } else {
          const users = userData.put({
            id: selectedUser?.id,
            fullName,
            email,
            cedula,
            phone,
            estado,
            
          });
          console.log("edit");

          users.onsuccess = (query) => {
            tx.oncomplete = function () {
              db.close();
            };
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Usuario Actualizado',
              showConfirmButton: false,
              timer: 1500,
            })
            setFullName("");
            setEmail("");
            setCedula('');
            setPhone("");
            setEstado('');
            setEditUser(false);
            getAllData();
            setSelectedUser({});
            event.preventDefault();
          };
          window.location.reload(true);
        }
      };
    } else {
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'Por favor ingrese todos los detalles',
        showConfirmButton: false,
        timer: 1500,
      })
    }
  };

  


  return (

    <div className={styles.gridContainer}>
      <Header></Header>
      
      <div className={styles.subtitulo}>
         <img src={user} alt="user" className={styles.img}/>
         <h3>Panel de Clientes</h3> 
      </div>
         
      <div>
        
        <button
            
            className={styles.btn} 
            onClick={() => {
              setFullName("");
              setEmail("");
              setCedula('');
              setPhone("");
              setEstado('');
              setEditUser(false);
              setAddUser(true);
              abrirCerrarModal();
            }}  
          >
            Nuevo Cliente
          </button>
      </div>


     
      <div>
        
        <table className="table table-bordered">
          
          <tbody>
            {allUsers?.map((user) => {
              return (
                <div className={styles.client}>
                <tr key={user?.id}>
                  <td>{user?.fullName}
                     <tr>{user?.email}</tr>
                  </td>
                  <td>{user?.cedula}
                   <tr>{user?.phone}</tr>
                  </td>
                  <td>{user?.estado}</td>
                  
                  <td>
                    <button
                      align="right"
                      className={styles.btn}
                      onClick={() => {
                        setAddUser(false);
                        setEditUser(true);
                        setSelectedUser(user);
                        setEmail(user?.email);
                        setCedula(user?.cedula);
                        setFullName(user?.fullName);
                        setEstado(user?.estado);
                        setPhone(user?.phone);
                        abrirCerrarModal();
                      }}

                      
                    >
                      Edit
                    </button>{" "}
                    
                  </td>
                </tr>
                </div>
              );
            })}
          </tbody>
        </table>
      </div>


    <Modal open={modal} onClose={abrirCerrarModal}>
      <div className={styles.modal}>
        {editUser || addUser ? (
          <div className="card" style={{ padding: "20px" }}>
            <h3 align="center">{editUser ? "Editar Usuario" : "Nuevo Usuario"}</h3>
            <div className="form-group">
              
              <input
                className={styles.input}
                type="text"
                name="fullName"
                placeholder="Nombre"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
              />
            </div>
            <div className="form-group">
              
              <input
                type="email"
                name="email"
                className={styles.input}
                placeholder="e-mail"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="form-group">
              
              <input
                type="text"
                name="cedula"
                className={styles.input}
                placeholder="Cedula"
                onChange={(e) => setCedula(e.target.value)}
                value={cedula}
              />
            </div>
            <div className="form-group">
              
              <input
                type="text"
                name="phone"
                className={styles.input}
                placeholder="Teléfono"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </div>
            <div className="form-group">
              <select type="text"
                name="estado"
                className={styles.input}
                onChange={(e) => setEstado(e.target.value)}
                value={estado}>

               <option selected="true" disabled="disabled">Estado</option>
                   <option value="Activo">Activo</option>
                   <option value="Inactivo">Inactivo</option>
                   <option value="Pendiente">Pendiente</option>
                   <option value="Desactivado">Desactivado</option>
                </select> 
            </div>
            <div className="form-group">
              <button
                className={styles.btn}
                type="submit"
                onClick={handleSubmit}
              >
                {editUser ? "Editar" : "Agregar"}
              </button> 
              <button className={styles.btn} onClick={()=>abrirCerrarModal()}>Cerrar</button>
            </div>
          </div>
        ) : null} 
      </div>

      </Modal>
    </div>
   
  
  );
};

export default Clients;