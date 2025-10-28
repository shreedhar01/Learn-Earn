// import { Button } from "./ui/button"
import { ThemeSwitcher } from "./ThemeSwitcher"
import SignIn from "./SignIn"
import Menu from "@/components/Menu"
import Link from "next/link"

export default function Header(){
    return(
        <nav className="flex justify-center min-w-full h-20">
            <div className="flex justify-between items-center w-full md:w-7xl h-20 p-2 md:p-0">
                <Link href="/">
                <h1 className="font-bold text-xl md:text-[24px]">SucceedTrading</h1>
                </Link>
                <Menu/>
            </div>
        </nav>
    )
}