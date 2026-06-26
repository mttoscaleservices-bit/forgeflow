import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose dark:prose-invert space-y-4 text-zinc-600 dark:text-zinc-400">
          <p>Last updated: June 2026</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, including your name and email address. We also collect payment information through Stripe, which is processed securely by Stripe and never stored on our servers.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">2. How We Use Your Information</h2>
          <p>We use your information to provide and maintain our service, process payments, send service updates, and improve our product. We never sell your personal data to third parties.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">3. Cookies</h2>
          <p>We use essential cookies for authentication and optional analytics cookies to understand usage patterns. You can disable analytics cookies in your browser settings.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">4. Data Security</h2>
          <p>We implement industry-standard security measures including encryption in transit and at rest. Your password is hashed and never stored in plain text.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">5. Contact</h2>
          <p>For privacy inquiries, contact us at privacy@forgeflow.app</p>
          <div className="pt-8">
            <Link href="/" className="text-violet-600 hover:text-violet-700 font-medium">&larr; Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
