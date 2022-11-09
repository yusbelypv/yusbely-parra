import React from "react";
import { Link } from "react-router-dom";
import developer from "../../assets/developer.png";
import styles from "../../Styles/styles.module.css";





const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <img src={developer} alt="developer" className={styles.img2}/>
      <p className={styles.titulo}>Evaluación Frontend</p>
      <p className={styles.made}>Realizado: por Yusbely Parra</p>
      <Link to="/Clients">
        {" "}
        <button className={styles.btn}>Ingresar</button>
      </Link>
     
    </div>  
    
    
  );
};

export default Home;