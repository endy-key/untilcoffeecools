import Image from "next/image";

export function Header() {
     return (
        <header className="p-6 border-b border-black">
            <div className="flex items-center justify-center">
                <Image src={"/eyecatch.jpg"} alt={"untilcoffeecools logo"} width={500} height={150} priority/>
            </div>
        </header>
    );
}
