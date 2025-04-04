import { useEffect, useState } from "react";

interface TickerData {
  symbol: string;
  price: string;
  timestamp: string;
}

export default function Bithumb() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [tickerData, setTickerData] = useState<TickerData[]>([]);
  const [status, setStatus] = useState<string>("연결 대기중...");

  useEffect(() => {
    const ws = new WebSocket("wss://pubwss.bithumb.com/pub/ws");

    ws.onopen = () => {
      console.log("Bithumb 웹소켓 서버에 연결되었습니다");
      setStatus("연결됨");

      // BTC 시세 구독 요청
      const subscribeMessage = {
        type: "ticker",
        symbols: ["BTC_KRW"],
        tickTypes: ["24H"],
      };
      ws.send(JSON.stringify(subscribeMessage));
    };

    ws.onclose = () => {
      console.log("Bithumb 웹소켓 서버와 연결이 끊어졌습니다");
      setStatus("연결 끊김");
    };

    ws.onerror = (error) => {
      console.error("웹소켓 에러:", error);
      setStatus("에러 발생");
    };

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "ticker") {
          setTickerData((prev) =>
            [
              {
                symbol: parsedData.symbol,
                price: parsedData.content.closePrice,
                timestamp: new Date().toISOString(),
              },
              ...prev,
            ].slice(0, 10)
          ); // 최근 10개 데이터만 보여줌
        }
      } catch (error) {
        console.error("데이터 파싱 에러:", error);
      }
    };

    setWs(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold mb-4">Bithumb 실시간 시세</h1>
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1 rounded ${
              status === "연결됨" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {status}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  심볼
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  시간
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickerData.map((data, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Number(data.price).toLocaleString()} KRW
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
