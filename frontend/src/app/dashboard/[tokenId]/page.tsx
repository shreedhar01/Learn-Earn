"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets"

export default function ChartBox() {
    const params = useParams()
    const {tokenId} = params
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    return (
        <div className="regural">
            <div className="w-full md:w-7xl">

            <div className="md:w-75/100 h-[600px] border rounded">
                {mounted && <AdvancedRealTimeChart symbol={`BINANCE:${tokenId}USDT`} key="chart" autosize theme="dark" />}
            </div>
            </div>
        </div>
    )
}
