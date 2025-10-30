"use client"
// import { Button } from "./ui/button"
import { ThemeSwitcher } from "./ThemeSwitcher"
import SignIn from "./SignIn"
import Menu from "@/components/Menu"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Header() {
    const [isClientVerified, setIsClientVerified] = useState(false)
    
        useEffect(() => {
            // this runs only in the browser
            const verified = localStorage.getItem("wallet-verified") === "true"
            setIsClientVerified(verified)
        }, [])
    return (
        <nav className="flex justify-center min-w-full h-20">
            <div className="flex justify-between items-center w-full md:w-7xl h-20 p-2 md:p-0">
                <Link href={isClientVerified ? "/dashboard":"/"}>
                    <h1 className="font-bold text-xl md:text-[24px]">SucceedTrading</h1>
                </Link>
                <Menu />
            </div>
        </nav>
    )
}