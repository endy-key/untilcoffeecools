import styles from "./style.module.css";
import Image from "next/image";

export function Header() {
     return (
        <header className={styles.header}>
            <div className={styles.logoArea}>
                <Image src={"/eyecatch.jpg"} alt={"untilcoffeecools logo"} width={700} height={200} priority/>
            </div>
        </header>
    );
}
