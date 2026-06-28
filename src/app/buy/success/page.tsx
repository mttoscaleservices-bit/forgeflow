import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BuySuccessPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Thank you for your purchase. The ZIP file is available for download below.
        </p>
        <div className="space-y-3">
          <a href="https://github.com/mttoscaleservices-bit/forgeflow" target="_blank" rel="noopener noreferrer">
            <Button className="w-full" variant="gradient">Download from GitHub</Button>
          </a>
          <br />
          <Link href="/">
            <Button className="w-full" variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
