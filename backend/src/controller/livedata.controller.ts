import WebSocket from "ws";
import type { Request, Response } from "express";
import axios from "axios";

// All clients connected via SSE
const clients: Response[] = [];

// Binance WS connection
let ws: WebSocket | null = null;

const mostFrequentData = [
    "BTCUSDT", "ETHUSDT", "BNBUSDT", "LTCUSDT", "XRPUSDT", "TRXUSDT",
    "NEOUSDT", "QTUMUSDT", "ADAUSDT", "TUSDUSDT", "IOTAUSDT", "XLMUSDT",
    "ONTUSDT", "ETCUSDT", "ICXUSDT", "VETUSDT", "USDCUSDT", "LINKUSDT",
    "ONGUSDT", "HOTUSDT", "ZILUSDT", "ZRXUSDT", "FETUSDT", "BATUSDT",
    "ZECUSDT", "IOSTUSDT", "CELRUSDT", "DASHUSDT", "THETAUSDT", "ENJUSDT",
    "ATOMUSDT", "TFUELUSDT", "ONEUSDT", "ALGOUSDT", "DOGEUSDT", "DUSKUSDT",
    "ANKRUSDT", "WINUSDT", "COSUSDT", "MTLUSDT"
];

const mostFrequentDataLiveData = ["btcusdt@aggTrade", "ethusdt@aggTrade", "bnbusdt@aggTrade", "ltcusdt@aggTrade", "xrpusdt@aggTrade", "trxusdt@aggTrade", "neousdt@aggTrade", "qtumusdt@aggTrade", "adausdt@aggTrade", "tusdusdt@aggTrade", "iotausdt@aggTrade", "xlmusdt@aggTrade", "ontusdt@aggTrade", "etcusdt@aggTrade", "icxusdt@aggTrade", "vetusdt@aggTrade", "usdcusdt@aggTrade", "linkusdt@aggTrade", "ongusdt@aggTrade", "hotusdt@aggTrade", "zilusdt@aggTrade", "zrxusdt@aggTrade", "fetusdt@aggTrade", "batusdt@aggTrade", "zecusdt@aggTrade", "iostusdt@aggTrade", "celrusdt@aggTrade", "dashusdt@aggTrade", "thetausdt@aggTrade", "enjusdt@aggTrade", "atomusdt@aggTrade", "tfuelusdt@aggTrade", "oneusdt@aggTrade", "algousdt@aggTrade", "dogeusdt@aggTrade", "duskusdt@aggTrade", "ankrusdt@aggTrade", "winusdt@aggTrade", "cosusdt@aggTrade", "mtlusdt@aggTrade"]

// Connect to Binance WS (once)
function connectBinanceWS() {
    if (ws) return; // already connected

    ws = new WebSocket(process.env.BINANCE_WS_STREAM_API || "");

    ws.onopen = () => {
        console.log("Connected to Binance WS");

        const message = {
            "method": "SUBSCRIBE",
            "params": mostFrequentDataLiveData
            ,
            "id": 1
        };

        ws?.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
        let text: string;
        if (typeof event.data === "string") {
            text = event.data;
        } else if (event.data instanceof ArrayBuffer) {
            // Node/Browser compatible: use Buffer if running under Node
            text = Buffer.from(event.data).toString("utf8");
        } else if (Array.isArray(event.data)) {
            // data could be Buffer[] (node ws)
            text = Buffer.concat((event.data as Buffer[]).map((b) => Buffer.from(b))).toString("utf8");
        } else {
            // Treat as Buffer (Node)
            text = (event.data as Buffer).toString("utf8");
        }

        const data = JSON.parse(text);

        // Broadcast data to all connected clients
        clients.forEach((client) => {
            client.write(`data: ${JSON.stringify(data)}\n\n`);
        });
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
        console.log("WebSocket closed");
        clients.forEach((client) => {
            client.write(`event: close\ndata: WebSocket closed\n\n`);
            client.end();
        });
        ws = null;
    };
}

// SSE endpoint
export function streamLiveData(req: Request, res: Response) {
    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Add client to list
    clients.push(res);

    // Connect to Binance WS if not connected
    connectBinanceWS();

    // Remove client on disconnect
    req.on("close", () => {
        const index = clients.indexOf(res);
        if (index !== -1) clients.splice(index, 1);
        console.log("Client disconnected from SSE");

        // Optional: close WS if no clients remain
        if (clients.length === 0 && ws) {
            ws.close();
            ws = null;
        }
    });
}

export async function allTickData(req: Request, res: Response) {
  try {
    const url = `${process.env.BINANCE_REST_API}/ticker/24hr?symbols=${encodeURIComponent(
      JSON.stringify(mostFrequentData)
    )}`;

    const response = await axios.get(url);
    // console.log(response)
    const data = response.data;
    // console.log(data)

    const refineData = data.map((item: any) => ({
      symbol: item.symbol.slice(0,-4),
      lastPrice: item.lastPrice,
    }));

    return res.status(200).json(refineData); 
  } catch (error: any) {
    console.error("Error fetching ticker data:", error.message);
    return res.status(500).json({ error: "Failed to fetch ticker data" });
  }
}