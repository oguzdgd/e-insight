import { Button } from "../../components/atoms/Button"
import styles from "../HomePage/HomePage.module.scss"
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
    const navigate = useNavigate()
    return (
        <main className={styles.homeContainer}>

            <section className={styles.bannerContainer}>

                <div className={styles.bannerImage}>
                    <img src="banner-photo.png" alt="Banner" />
                </div>

                <div className={styles.bannerText}>
                    <h2>E-Insight nedir? Ne işe yarar?</h2>
                    <p>Bu platform, ürün yorumlarını analiz ederek size daha bilinçli alışveriş yapma imkanı sunar.</p>
                    <Button onClick={() => navigate('/analyzer')}>Hemen Dene</Button>
                </div>
            </section>

            <section className={styles.bannerContainer}>

                <div className={styles.bannerImage}>
                    <img src="whyUse.png" alt="Banner" />
                </div>

            </section>

        </main>
    )
}

export default HomePage