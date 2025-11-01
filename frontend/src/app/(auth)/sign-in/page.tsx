"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";
import { getNonce, verifySignature, getCurrentUser, logout } from "@/action/auth";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WalletButton() {
    const { publicKey, signMessage, connected } = useWallet();
    const [user, setUser] = useState<string | null>(null);
    const router = useRouter()

    useEffect(() => {
        (async () => {
            const u = await getCurrentUser();
            if (u) setUser(u);
        })();
    }, []);

    const handleLogin = async () => {
        if (!publicKey || !signMessage) return alert("Wallet not connected");
        const pk = publicKey.toBase58();

        const nonce = await getNonce(pk);
        const message = new TextEncoder().encode(nonce);
        const signature = await signMessage(message);
        const encoded = bs58.encode(signature);

        const result = await verifySignature(pk, encoded);
        if (result.success) {
            router.push("/dashboard")
            localStorage.setItem("wallet-verified", "true");
            setUser(pk);
        }
    };

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem("wallet-verified")
        setUser(null);
    };

    return (
        <main className="regural min-h-[80vh] gap-4 ">
            <div className="flex flex-col border p-4 py-5 gap-4 rounded ">
                <div className="flex-col  gap-2 ">
                    <p className="text-neutral-500">Connect Your Wallet</p>
                    <WalletMultiButton className="w-full" />
                </div>
                {connected && !user && (
                    <div>
                        <p className="text-neutral-500">Verify your wallet</p>
                        <Button
                            onClick={handleLogin}
                            className="px-4 py-2 bg-green-600 text-white rounded w-full"
                        >
                            Verify Wallet
                        </Button>
                    </div>
                )}
                {user && (
                    <>
                        <Link href="/dashboard">
                            <p className="text-neutral-500">Navigate to Dashboard</p>
                            <Button className="w-full px-4 py-2 bg-green-600 text-white rounded">
                                Go to Dashboard
                            </Button>
                        </Link>
                        {/* <p className="text-neutral-500">Connect Your Wallet</p> */}
                        <Button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Logout
                        </Button>
                    </>
                )}
            </div>
        </main>
    );
}
