import { NavLink } from "react-router"
import styles from "../Navbar/Navbar.module.scss"
import { Button } from './../atoms/Button';
import useModeStore from './../../stores/modeStore';

const Navbar = () => {
  const {mode,setMode}=useModeStore();
  return (


    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <NavLink to={"/"} className={styles.logoName}>E-Insight</NavLink>
      </div>

      <div className={styles.navLinks}>
        <NavLink to={"/"}  className={({ isActive }) => isActive ? styles.activeLink : ""}>Ana Sayfa</NavLink>
        <NavLink to={"/analyzer"}  className={({ isActive }) => isActive ? styles.activeLink : ""}>Ürün Analizi</NavLink>
      </div>

      <div className={styles.modeButon}>
          <Button onClick={()=>setMode(mode==="user" ? "seller" :"user")}>
            {mode ==="user"? "Kullanıcı Modu" : "Satıcı Modu"}
           
          </Button>
           
      </div>

    </nav>


  )
}

export default Navbar