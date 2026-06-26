import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <div className="prose dark:prose-invert space-y-4 text-zinc-600 dark:text-zinc-400">
          <p>Last updated: June 2026</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">1. Acceptance of Terms</h2>
          <p>By using ForgeFlow, you agree to these terms. If you do not agree, do not use the service.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">2. Subscriptions and Billing</h2>
          <p>Paid plans are billed monthly or annually as selected. You can cancel anytime through the customer portal. Refunds are handled on a case-by-case basis.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">3. User Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">4. Limitation of Liability</h2>
          <p>ForgeFlow is provided &quot;as is&quot; without warranty of any kind. We are not liable for any damages arising from the use of our service.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">5. Changes</h2>
          <p>We reserve the right to modify these terms at any time. Users will be notified of material changes via email.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">6. Contact</h2>
          <p>For questions about these terms, contact us at legal@forgeflow.app</p>
          <div className="pt-8">
            <Link href="/" className="text-violet-600 hover:text-violet-700 font-medium">&larr; Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
