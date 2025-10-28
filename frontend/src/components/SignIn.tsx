import Link from "next/link"
import { Button } from "./ui/button"

export function SignIn() {
    return (
        <Link href="/sign-in">
            <Button size="sm" className="border">Sign In with Wallet</Button>
        </Link>
    )
}

export default SignIn