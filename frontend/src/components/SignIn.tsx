"use client"
import Link from "next/link"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"

export function SignIn() {
    const [isClientVerified, setIsClientVerified] = useState(false)

    useEffect(() => {
        // this runs only in the browser
        const verified = localStorage.getItem("wallet-verified") === "true"
        setIsClientVerified(verified)
    }, [])

    const message = isClientVerified ? "LogOut" : "Sign In with Wallet"

    return (
        <Link href="/sign-in">
            <Button size="sm" className="border">{message}</Button>
        </Link>
    )
}

export default SignIn
