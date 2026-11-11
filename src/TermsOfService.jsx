import { useEffect } from 'react'
import './TermsOfService.css'

const termsSections = [
  {
    title: '1. Agreement to these terms',
    paragraphs: [
      'These Terms of Service apply to your use of the QwerySMP Minecraft server, its website, and this store. By using these services, you agree to follow these terms and any additional server rules shown in-game or on our official channels.',
    ],
  },
  {
    title: '2. Accounts and eligibility',
    paragraphs: [
      'You are responsible for keeping your Minecraft account secure and for activity carried out through it. Do not share account credentials or use another person’s account without permission. A parent or guardian should review these terms and supervise purchases for anyone under the age required to make those purchases in their country.',
    ],
  },
  {
    title: '3. Fair play and server conduct',
    paragraphs: [
      'Do not cheat, exploit bugs, interfere with the server, harass other players, or attempt to bypass moderation or security measures. Please report bugs and suspected abuse to the QwerySMP staff. We may investigate reports and take proportionate action, including restricting access where reasonably necessary to protect players or the service.',
    ],
  },
  {
    title: '4. Store items and payments',
    paragraphs: [
      'The store currently displays example items and prices. Checkout is not active: this website does not accept or process payments, create orders, or deliver purchases. Adding an item to the basket does not place an order.',
      'If purchases are enabled, the checkout will show the item, total price and currency before you confirm. Any recurring rank, renewal amount, billing period, and cancellation instructions will also be shown before a subscription is started. Digital items such as ranks, shards, and crate keys are for use on QwerySMP only and have no real-world value.',
    ],
  },
  {
    title: '5. Cancellations and consumer rights',
    paragraphs: [
      'When purchases become available, the applicable cancellation, refund, and withdrawal terms will be shown before you buy and handled in accordance with consumer-protection laws that apply to you. Nothing in these terms removes rights that cannot legally be excluded. For order questions, use the Support page to join our Discord and open a ticket.',
    ],
  },
  {
    title: '6. Service availability and moderation',
    paragraphs: [
      'We work to keep QwerySMP available but cannot promise uninterrupted or error-free access. Server features, gameplay, and digital items may change for maintenance, balancing, security, or other operational reasons. We will take reasonable steps to communicate significant changes.',
    ],
  },
  {
    title: '7. Intellectual property and third-party services',
    paragraphs: [
      'QwerySMP names, branding, and original store materials belong to their respective owners. Minecraft and related marks belong to Mojang and Microsoft; QwerySMP is an independent server and is not affiliated with or endorsed by them. Your use of Minecraft remains subject to its own terms.',
    ],
  },
  {
    title: '8. Liability',
    paragraphs: [
      'These terms do not limit liability where it would be unlawful to do so. To the extent permitted by law, QwerySMP is not responsible for indirect losses arising from temporary server interruptions, loss of in-game progress, or events outside our reasonable control.',
    ],
  },
  {
    title: '9. Updates and contact',
    paragraphs: [
      'We may update these terms as the server and store develop. The current version will be posted on this page with its latest update date. For questions, use the Support page to join our Discord and open a ticket.',
    ],
  },
]

function TermsOfService() {
  useEffect(() => {
    document.title = 'Terms of Service | QwerySMP'
  }, [])

  return (
    <div className="terms-page">
      <header className="terms-header">
        <a className="terms-brand" href="/" aria-label="QwerySMP store home">
          <img src="/qwery-logo.jpg" alt="" />
          <span>QWERY<span>SMP</span></span>
        </a>
        <a className="terms-back-link" href="/">← Back to store</a>
      </header>

      <main className="terms-main">
        <p className="terms-kicker">QWERY SMP · STORE POLICIES</p>
        <h1>Terms of Service</h1>
        <p className="terms-updated">Last updated: 11 November 2026</p>
        <p className="terms-intro">
          These terms explain the rules for using the QwerySMP server, website, and store.
        </p>

        <p className="terms-notice" role="note">
          <strong>Store status:</strong> Checkout is not active. No payments, orders, or
          in-game deliveries are being processed through this website.
        </p>

        <div className="terms-content">
          {termsSections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </div>

        <p className="terms-draft-note">
          Before enabling paid checkout, the server operator should add its legal
          business/contact details and governing-law information, and confirm these
          terms comply with the laws that apply to the store.
        </p>
      </main>

      <footer className="terms-footer">
        <a href="/">QwerySMP Store</a>
        <a href="/?page=support">Support</a>
        <span>Not affiliated with Mojang or Microsoft.</span>
      </footer>
    </div>
  )
}

export default TermsOfService
