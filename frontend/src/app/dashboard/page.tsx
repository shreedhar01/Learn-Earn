"use client"
import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"

interface dataProps {
    "symbol": string,
    "lastPrice": string
}



function page() {
    const [data, setData] = useState<dataProps[]>([])
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
    return (
        <div className="regural">
            <div className="w-full md:w-7xl pb-2">
                <div className="flex flex-col gap-y-1 md:w-1/2">
                    <div className="flex justify-between bg-green-600 rounded p-2 ">
                        <p className="font-bold">Crypto</p>
                        <p className=""> <span className="font-bold">Prices </span>(in usdt)</p>
                    </div>
                    {
                        data.map((item, index) => (
                            <Link href={`/dashboard/${item.symbol}`}>
                                <div key={item.symbol ?? index} className="flex justify-between bg-green-500 hover:bg-green-300 rounded p-2">
                                    <p className="font-bold">{item.symbol}</p>
                                    <p>{item.lastPrice}</p>
                                </div>
                            </Link>
                        ))
                    }
                </div>

            </div>
        </div>
    )
}

export default page