import styles from "./style.module.css";

export function Footer() {
    return (
        <footer className={styles.footer}>
            &copy; {new Date().getFullYear()} untilcoffeecools
        </footer>
    );
}
