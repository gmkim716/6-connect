import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">실시간 채팅 앱</h1>
        <p className="text-gray-600 mb-8">
          Socket.IO를 사용한 실시간 채팅 애플리케이션입니다.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => router.push("/chat")}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            채팅 시작하기
          </button>
          <button
            onClick={() => router.push("/bithumb")}
            className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Bithumb 시세 보기
          </button>
        </div>
      </div>
    </div>
  );
}
