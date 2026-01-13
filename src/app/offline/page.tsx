"use client"

import Link from "next/link";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background text-foreground">
      <div className="bg-slate-900/50 p-6 rounded-full mb-6">
        <WifiOff className="w-16 h-16 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold mb-2">İnternet Bağlantısı Yoxdur</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Bu səhifəni görmək üçün internet bağlantısı tələb olunur. Lakin əvvəlcədən yüklənmiş səhifələrə daxil ola bilərsiniz.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Ana Səhifəyə Qayıt
          </Link>
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Yenidən Cəhd Et
        </Button>
      </div>
    </div>
  );
}
