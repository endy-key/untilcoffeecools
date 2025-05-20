export function Footer({ className }: { className: string }) {
    return (
        <footer className={`p-6 text-center text-gray-500 ${className}`}>
            &copy; {new Date().getFullYear()} untilcoffeecools
        </footer>
    );
}
