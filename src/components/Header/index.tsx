import styles from "./style.module.css";
import Image from "next/image";

export function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logoArea}>
                <Image src={"/logo.png"} alt={"untilcoffeecools logo"} width={120} height={60} priority/>
            </div>
        </header>
    );
}
