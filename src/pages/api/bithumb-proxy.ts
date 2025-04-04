import { NextApiRequest, NextApiResponse } from "next";
import WebSocket from "ws";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const ws = new WebSocket("wss://pubwss.bithumb.com/pub/ws");

  ws.on("open", () => {
    console.log("Connected to Bithumb WebSocket");
    const subscribeMessage = {
      type: "ticker",
      symbols: ["BTC_KRW"],
      tickTypes: ["24H"],
    };
    ws.send(JSON.stringify(subscribeMessage));
  });

  ws.on("message", (data) => {
    try {
      const parsedData = JSON.parse(data.toString());
      if (parsedData.type === "ticker") {
        res.write(`data: ${JSON.stringify(parsedData)}\n\n`);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    res.status(500).json({ message: "WebSocket error" });
  });

  ws.on("close", () => {
    console.log("Disconnected from Bithumb WebSocket");
    res.end();
  });

  req.on("close", () => {
    ws.close();
  });
}
