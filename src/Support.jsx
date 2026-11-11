import { useEffect } from 'react'
import './Support.css'

const discordInvite = 'https://discord.com/invite/rDrf2qgHE'

function SupportPage() {
  useEffect(() => {
    document.title = 'Support | QwerySMP'
  }, [])

  return (
    <div className="support-page">
      <header className="support-header">
        <a className="support-brand" href="/" aria-label="QwerySMP store home">
          <img src="/qwery-logo.jpg" alt="" />
          <span>QWERY<span>SMP</span></span>
        </a>
        <a className="support-back-link" href="/">← Back to store</a>
      </header>

      <main className="support-main">
        <p className="support-kicker">QWERY SMP · HELP CENTER</p>
        <h1>Need a hand?</h1>
        <p className="support-intro">
          Join our Discord and open a support ticket so the QwerySMP team can help you.
        </p>

        <section className="support-card" aria-labelledby="support-card-title">
          <div className="support-icon" aria-hidden="true">
            <svg viewBox="0 0 20 19">
              <use href="/icons.svg#discord-icon" />
            </svg>
          </div>
          <h2 id="support-card-title">Create a support ticket</h2>
          <ol>
            <li>Join the QwerySMP Discord server.</li>
            <li>Open a support ticket in the server and tell us how we can help.</li>
          </ol>
          <a
            className="support-discord-button"
            href={discordInvite}
          >
            Join the Discord <span aria-hidden="true">↗</span>
          </a>
          <p className="support-safety-note">
            Never share your password or full payment details in a support ticket.
          </p>
        </section>
      </main>

      <footer className="support-footer">
        <a href="/">QwerySMP Store</a>
        <span>Not affiliated with Mojang or Microsoft.</span>
      </footer>
    </div>
  )
}

export default SupportPage
