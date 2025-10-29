"use client"
import Link from "next/link"
import { Button } from "./ui/button"

export function SignIn() {
    const isClientVerified = localStorage.getItem("wallet-verified") === "true";
    let message = isClientVerified ? "LogOut" : "Sign In with Wallet"
    return (
        <Link href="/sign-in">
            <Button size="sm" className="border">{message}</Button>
        </Link>
    )
}

export default SignIn