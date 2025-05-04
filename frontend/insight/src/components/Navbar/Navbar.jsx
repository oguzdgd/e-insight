import { NavLink } from "react-router"
import styles from "../Navbar/Navbar.module.scss"

const Navbar = () => {
  return (


    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <NavLink to={"/"} className={styles.logoName}>E-Insight</NavLink>
      </div>

      <div className={styles.navLinks}>
        <NavLink to={"/"}  className={({ isActive }) => isActive ? styles.activeLink : ""}>Ana Sayfa</NavLink>
        <NavLink to={"/analyzer"}  className={({ isActive }) => isActive ? styles.activeLink : ""}>Ürün Analizi</NavLink>
      </div>

    </nav>


  )
}

export default Navbar