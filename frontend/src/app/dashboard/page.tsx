"use client"
import { useWallet } from "@solana/wallet-adapter-react"
import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"

interface dataProps {
    "symbol": string,
    "lastPrice": string
}

interface tradeProps{
    "symbol":string,
    "type":string,
    "quantity":string,
    "total":string
}



function page() {
    const { publicKey } = useWallet()
    const [data, setData] = useState<dataProps[]>([])
    const [fusdt, setfusdt] = useState()
    const [trade, setTrade] = useState<tradeProps[]>([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fdata = await axios.get<dataProps[]>(process.env.NEXT_PUBLIC_LIST_CRYPTO_DATA_API || "")
                setData(fdata.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            if (!publicKey) return;
            try {
                const fData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/user/${publicKey?.toString()}`)
                setfusdt(fData.data.data["fusd_balance"])
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [publicKey])

    useEffect(() => {
        const fetchData = async () => {
            if (!publicKey) return;
            try {
                const trade = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/trade/${publicKey?.toString()}`)
                setTrade(trade.data.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [publicKey])
    return (
        <div className="regural">
            <div className="w-full md:w-7xl pb-2">
                <div className="flex flex-col md:flex-row gap-8 w-full justify-between">
                    <div className="flex flex-col gap-8 md:w-1/2">
                        <div className="bg-green-600 p-2 rounded w-25/100">
                            <p ><span className="font-bold text-3xl">{fusdt}</span> USDT</p>
                            <p>Your balance</p>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <p className="text-xl font-medium">Your Trade</p>
                            <div className="flex gap-2 justify-between w-full border rounded p-2 bg-green-500">
                                <p>Token</p>
                                <p>Type</p>
                                <p>Quantity</p>
                                <p>Price</p>
                            </div>
                            { 
                                trade?.map((item, index) => 
                                    <div key={index} className="flex justify-between w-full border rounded p-2">
                                        <p>{item.symbol}</p>
                                        <p>{item.type}</p>
                                        <p>{item.quantity}</p>
                                        <p>{item.total}</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-1 md:w-1/2">
                        <div className="flex justify-between bg-green-600 rounded p-2 ">
                            <p className="font-bold">Crypto</p>
                            <p className=""> <span className="font-bold">Prices </span>(in usdt)</p>
                        </div>
                        {
                            data.map((item, index) => (
                                <Link
                                    key={item.symbol ?? index}
                                    href={`/dashboard/${item.symbol}`}
                                >
                                    <div className="flex justify-between bg-green-500 hover:bg-green-300 rounded p-2">
                                        <p className="font-bold">{item.symbol}</p>
                                        <p>{item.lastPrice}</p>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page