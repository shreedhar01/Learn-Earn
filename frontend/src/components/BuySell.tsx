"use client"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { useWallet } from "@solana/wallet-adapter-react"

export function BuySell({ symbol }: { symbol: string }) {
    const { publicKey } = useWallet()
    const [state, setState] = useState("buy")
    const [quantity, setQuantity] = useState<string>("")
    const [usdt, setUsdt] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (!quantity) {
            setUsdt("")
            return
        }

        const delay = setTimeout(async () => {
            try {
                setLoading(true)
                const res = await axios.get(`https://testnet.binance.vision/api/v3/ticker/price?symbol=${symbol.toUpperCase()}USDT`)
                const price = res.data?.price || 1
                const total = parseFloat(quantity) * price
                setUsdt(total.toFixed(2))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }, 600)

        return () => clearTimeout(delay)
    }, [quantity, symbol])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!quantity || !usdt) return alert("Please enter quantity first.")

        try {
            setSubmitting(true)
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/trade`, {
                solana_address: publicKey,
                symbol,
                type: state.toUpperCase(),
                quantity: parseFloat(quantity)
            })

            setError("")
            setMessage(res.data?.message || "Order placed.")
            setQuantity("")
            setUsdt("")
        } catch (err: unknown) {
            const error = err as AxiosError<{message?:string, error?:string}>
            console.error("Trade error:", err)
            const message =
                error.response?.data?.message || // ✅ handles backend {message:"..."}
                error.response?.data?.error ||   // fallback if backend sends "error"
                error.message                    // fallback if network error

            setError(message)
        } finally {
            setSubmitting(false)
        }
    }


    return (
        <div className="border rounded p-2 w-full md:w-25/100 max-w-md h-fit">
            <div className="flex w-full">
                <Button
                    onClick={() => setState("buy")}
                    className="bg-red-500 hover:bg-red-300 py-8 w-1/2"
                >
                    BUY
                </Button>
                <Button
                    onClick={() => setState("sell")}
                    className="bg-green-500 hover:bg-green-300 py-8 w-1/2"
                >
                    SELL
                </Button>
            </div>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>{state === "buy" ? `You Want to Buy ${symbol}` : `You want to sell ${symbol}`}</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    {`Enter a quantity of ${symbol}`}
                                </FieldLabel>
                                <Input
                                    id="checkout-7j9-card-name-43j"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="Quantity"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                    {state === "buy" ? "You should have below USDT" : "You recieve below USDT"}
                                </FieldLabel>
                                <Input
                                    id="checkout-7j9-card-number-uw1"
                                    value={loading ? "Calculating..." : usdt}
                                    placeholder="1234 5678 9012 3456"
                                    required
                                />

                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <Field orientation="horizontal" className="flex justify-between p-2">
                        <Button type="submit" disabled={submitting}
                        className="w-1/2 bg-green-500"
                        >
                            {submitting ? "Processing..." : "Submit"}
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            className="w-1/2 bg-red-500"
                            onClick={() => {
                                setQuantity("")
                                setUsdt("")
                            }}
                        >
                            Cancel
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
            <div className="flex justify-center items-center w-full p-2">
                {
                    error ?
                        <p className="text-red-500">{error}</p> :
                        <p className="text-green-500">{message}</p>
                }
            </div>
        </div>
    )
}
