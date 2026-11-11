import { useState } from 'react'
import TermsOfService from './TermsOfService.jsx'
import SupportPage from './Support.jsx'
import './App.css'

const ranks = [
  { id: 'qwery-plus', name: 'Qwery+', price: 9.99, originalPrice: 14.99, homes: 5, shardsPerSecond: 2, key: '1 Amethyst Key' },
]

const shardPacks = [
  { id: 'shards-500', amount: 500, price: 4.99 },
  { id: 'shards-2500', amount: 2500, price: 9.99 },
  { id: 'shards-5500', amount: 5500, price: 19.99, bonus: '10% extra' },
  { id: 'shards-12000', amount: 12000, price: 39.99, bonus: '20% extra' },
  { id: 'shards-32000', amount: 32000, price: 79.99, bonus: '28% extra' },
  { id: 'shards-70000', amount: 70000, price: 149.99, bonus: '40% extra' },
]

const crateKeys = [
  { id: 'key-common', name: 'Common Key', price: 2.99, color: '#91df18', image: '/keys/common-key.png?v=5', description: 'Receive one Common crate key.' },
  { id: 'key-prime', name: 'Prime Key', price: 4.99, color: '#44b8ff', image: '/keys/prime-key.png?v=5', description: 'Receive one Prime crate key.' },
  { id: 'key-crimson', name: 'Crimson Key', price: 6.99, color: '#ff4747', image: '/keys/crimson-key.png?v=6', description: 'Receive one Crimson crate key.' },
  { id: 'key-gold', name: 'Gold Key', price: 8.99, color: '#ffd331', image: '/keys/gold-key.png?v=5', description: 'Receive one Gold crate key.' },
  { id: 'key-amethyst', name: 'Amethyst Key', price: 10.99, color: '#c56aff', image: '/keys/amethyst-key.png?v=5', description: 'Receive one Amethyst crate key.' },
]

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(price)

function getLineTotal(item, quantity = item.quantity) {
  const priceInCents = Math.round(item.price * 100)
  const extraKeyCents = item.type === 'key' ? quantity - 1 : 0
  return (priceInCents * quantity + extraKeyCents) / 100
}

function CrateKeyIcon({ image, name, size = 'medium' }) {
  return <img className={`crate-key-icon crate-key-${size}`} src={image} alt={name} />
}

function CrystalIcon({ size = 'medium' }) {
  return (
    <svg
      className={`crystal-icon crystal-${size}`}
      viewBox="0 0 160 110"
      role="img"
      aria-label="Purple shard crystals"
    >
      <g className="crystal-left">
        <path className="crystal-outline" d="m18 73 13-27 18-3 15 18-5 24-22 13-20-9Z" />
        <path className="crystal-facet-light" d="m31 46 18-3-7 27-24 3Z" />
        <path className="crystal-facet-mid" d="m42 70 25-9-5 24-22 13Z" />
        <path className="crystal-facet-dark" d="m18 73 24-3 0 23-20-9Z" />
      </g>
      <g className="crystal-right">
        <path className="crystal-outline" d="m99 66 13-30 23-6 15 22-7 27-24 14-20-8Z" />
        <path className="crystal-facet-light" d="m112 36 23-6-10 31-26 5Z" />
        <path className="crystal-facet-mid" d="m125 61 25-9-7 27-24 14Z" />
        <path className="crystal-facet-dark" d="m99 66 26-5 0 32-20-8Z" />
      </g>
      <g className="crystal-main">
        <path className="crystal-outline" d="m73 9 26 10 17 28-8 35-28 21-28-17-10-31 13-34Z" />
        <path className="crystal-facet-light" d="m73 9 26 10-19 31-28 5 13-34Z" />
        <path className="crystal-facet-mid" d="m99 19 17 28-36 3Z" />
        <path className="crystal-facet-bright" d="m65 30 8-21 7 52-28 25-10-31Z" />
        <path className="crystal-facet-dark" d="m52 86 28-25 28 21-28 21Z" />
        <path className="crystal-facet-mid" d="m80 61 36-14-8 35-28 21Z" />
        <path className="crystal-shine" d="m62 28 7-11m30 7 9 14m-51 43 7 9" />
      </g>
      <g className="crystal-sparkles">
        <path d="M20 33v10m-5-5h10m108 37v10m-5-5h10M91 4v7m-4-3h8" />
      </g>
    </svg>
  )
}

function CheckoutFlow({
  step,
  setStep,
  items,
  total,
  updateQuantity,
  addToCart,
  onCancel,
}) {
  const [platform, setPlatform] = useState('Java')
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [email, setEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [paymentNotice, setPaymentNotice] = useState('')

  async function continueFromUsername(event) {
    event.preventDefault()
    const enteredUsername = username.trim()
    const cleanUsername = platform === 'Bedrock'
      ? `.${enteredUsername.replace(/^\.+/, '')}`
      : enteredUsername
    const isValidJavaName = /^[A-Za-z0-9_]{3,16}$/.test(cleanUsername)
    if (platform === 'Java' && !isValidJavaName) {
      setUsernameError('Enter a valid Java username (3–16 letters, numbers, or underscores).')
      return
    }
    if (platform === 'Bedrock' && !/^\.[A-Za-z0-9_ ]{3,16}$/.test(cleanUsername)) {
      setUsernameError('Enter a valid Bedrock gamertag. Use 3–16 letters, numbers, spaces, or underscores.')
      return
    }

    if (platform === 'Java') {
      setIsCheckingUsername(true)
      try {
        const response = await fetch(`/api/minecraft-profile?username=${encodeURIComponent(cleanUsername)}`)
        if (!response.ok) {
          throw new Error(`Profile lookup failed with HTTP ${response.status}`)
        }
        const profile = await response.json()
        if (!profile.exists || typeof profile.username !== 'string') {
          setUsernameError('That Java username was not found. Check the spelling and try again.')
          return
        }
      } catch {
        setUsernameError('Could not verify the Java account right now. Please try again in a moment.')
        return
      } finally {
        setIsCheckingUsername(false)
      }
    }

    setUsername(cleanUsername)
    setUsernameError('')
    setStep(2)
  }

  function showPaymentNotice(event) {
    event.preventDefault()
    setPaymentNotice('Secure checkout is not connected yet. No payment details have been collected and no payment was made.')
  }

  function itemDisplayName(item) {
    if (item.type === 'rank') {
      return `${item.name} (30 days)${item.key ? ` · Includes ${item.key}` : ''}`
    }
    if (item.type === 'key') return item.name
    return item.name
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <a className="checkout-brand" href="/" aria-label="QwerySMP store">
          <img src="/qwery-logo.jpg" alt="" />
          <span>QWERY<span>SMP</span></span>
        </a>
        <nav className="checkout-steps" aria-label="Checkout progress">
          {['You might like', 'Make Payment', 'Order Confirmed'].map((label, index) => (
            <span className={step === index + 1 ? 'checkout-step is-current' : 'checkout-step'} key={label}>
              {index > 0 && <span className="step-divider">›</span>}
              {label}
            </span>
          ))}
        </nav>
        <button className="cancel-checkout" type="button" onClick={onCancel}>Cancel</button>
      </header>

      {step === 1 && (
        <main className="player-step">
          <div className="player-step-brand">
            <img src="/qwery-logo.jpg" alt="QwerySMP" />
            <h1>Store</h1>
            <p>Upgrade your experience on QwerySMP</p>
            <span>Qwerysmp.xyz</span>
          </div>
          <form className="username-card" onSubmit={continueFromUsername}>
            <h2>Enter your Minecraft Username</h2>
            <div className="username-card-content">
              <div className="platform-picker" role="group" aria-label="Minecraft edition">
                {['Java', 'Bedrock'].map((edition) => (
                  <button
                    className={platform === edition ? 'platform-option is-selected' : 'platform-option'}
                    key={edition}
                    type="button"
                    aria-pressed={platform === edition}
                    onClick={() => {
                      setUsername((current) => edition === 'Bedrock'
                        ? (current && !current.startsWith('.') ? `.${current}` : current)
                        : current.replace(/^\./, ''))
                      setPlatform(edition)
                      setUsernameError('')
                    }}
                  >
                    <span aria-hidden="true">{edition === 'Java' ? '▣' : '🎮'}</span>
                    {edition.toUpperCase()}
                  </button>
                ))}
              </div>
              <label className="sr-only" htmlFor="minecraft-username">Minecraft username</label>
              <div className="username-input-row">
                <input
                  autoComplete="off"
                  id="minecraft-username"
                  maxLength={platform === 'Java' ? 16 : 17}
                  placeholder={platform === 'Java' ? 'Enter your username' : '.YourGamertag'}
                  value={username}
                  onChange={(event) => {
                    const value = event.target.value
                    setUsername(platform === 'Bedrock' && value && !value.startsWith('.')
                      ? `.${value}`
                      : value)
                    setUsernameError('')
                  }}
                  aria-invalid={Boolean(usernameError)}
                  aria-describedby={usernameError ? 'username-error' : undefined}
                />
                <button type="submit" disabled={isCheckingUsername}>
                  {isCheckingUsername ? 'Checking…' : 'Continue'} <span aria-hidden="true">›</span>
                </button>
              </div>
              {usernameError && <p className="form-error" id="username-error" role="alert">{usernameError}</p>}
              <p className="username-help">
                {platform === 'Java'
                  ? 'We’ll check your username against Minecraft’s profile service.'
                  : 'Bedrock players need a . before their gamertag on this server. We’ll add it for you; account ownership cannot be checked here.'}
              </p>
            </div>
          </form>
        </main>
      )}

      {step === 2 && (
        <main className="review-step">
          <section className="review-summary">
            <div className="review-player">
              <img src="/qwery-logo.jpg" alt="" />
              <div><strong>{username}&apos;s order</strong><span>{platform} Edition</span></div>
            </div>
            <div className="review-items">
              {items.map((item) => (
                <article className="review-item" key={item.id}>
                  <div className="review-item-icon">
                    {item.type === 'key'
                      ? <CrateKeyIcon image={item.image} name={item.name} size="small" />
                      : <CrystalIcon size="small" />}
                  </div>
                  <div className="review-item-description">
                    <strong>{itemDisplayName(item)}</strong>
                    <span>{formatPrice(item.price)}{item.period ? ' every month' : ' one-time'} · Qty {item.quantity}</span>
                  </div>
                  <div className="review-item-controls">
                    <strong>{formatPrice(getLineTotal(item))}</strong>
                    <div className="quantity-control">
                      <button type="button" aria-label={`Remove one ${item.name}`} onClick={() => updateQuantity(item.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" aria-label={`Add one ${item.name}`} onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                </article>
              ))}
              <label className="coupon-field">
                <span>Coupon / Gift Card</span>
                <input placeholder="Coupon codes will be available at checkout" disabled />
              </label>
              <div className="review-total">
                <p><span>Subtotal</span><strong>{formatPrice(total)}</strong></p>
                <p className="review-total-due"><span>To pay now</span><strong>{formatPrice(total)}</strong></p>
              </div>
              <button className="text-back-button" type="button" onClick={() => setStep(1)}>← Edit Minecraft username</button>
            </div>
          </section>

          <section className="recommendations">
            <p className="recommendation-title">You might like</p>
            {shardPacks.filter((pack) => !items.some((item) => item.id === pack.id)).slice(0, 3).map((pack) => (
              <article className="recommendation-item" key={pack.id}>
                <div className="recommendation-icon"><CrystalIcon size="small" /></div>
                <div><strong>{pack.amount.toLocaleString()} Shards</strong><span>{formatPrice(pack.price)}</span></div>
                <button type="button" onClick={() => addToCart(pack.id)}>Add</button>
              </article>
            ))}
            <button className="continue-payment-button" type="button" onClick={() => { setPaymentNotice(''); setStep(3) }}>
              Continue to Payment
            </button>
          </section>
        </main>
      )}

      {step === 3 && (
        <main className="payment-step">
          <section className="payment-form-section">
            <p className="payment-form-kicker">ORDER FOR {username.toUpperCase()}</p>
            <form onSubmit={showPaymentNotice}>
              <label className="checkout-field">
                <span>Email Address</span>
                <input type="email" autoComplete="email" placeholder="Enter your email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>

              <fieldset className="payment-methods">
                <legend>Choose a payment method</legend>
                <div className="payment-method-grid">
                  {['Credit / Debit Card', 'Google Pay', 'PayPal', 'Paysafecard'].map((method) => (
                    <button
                      className={paymentMethod === method ? 'payment-method is-selected' : 'payment-method'}
                      key={method}
                      type="button"
                      aria-pressed={paymentMethod === method}
                      onClick={() => { setPaymentMethod(method); setPaymentNotice('') }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                <p className="secure-provider-note">Payment options will be provided by a secure payment processor. This store does not collect card numbers.</p>
              </fieldset>

              <label className="checkout-field">
                <span>Full Name</span>
                <input autoComplete="name" placeholder="Enter your full name" />
              </label>

              <label className="terms-consent">
                <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} required />
                <span>I agree to the <a href="/?page=terms-of-service" target="_blank" rel="noreferrer">Terms of Service</a>.</span>
              </label>

              {paymentNotice && <p className="payment-notice" role="status">{paymentNotice}</p>}
              <button className="pay-button" type="submit" disabled={!paymentMethod}>
                Continue to secure payment · {formatPrice(total)}
              </button>
              <p className="payment-disclaimer">Checkout is not connected yet. No payment will be taken.</p>
            </form>
          </section>

          <aside className="payment-order-summary">
            <h2>Order summary</h2>
            <p className="payment-recipient">{username} · {platform}</p>
            {items.map((item) => (
              <div className="payment-summary-item" key={item.id}>
                <span>{itemDisplayName(item)} × {item.quantity}</span>
                <strong>{formatPrice(getLineTotal(item))}</strong>
              </div>
            ))}
            <div className="payment-summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
            <button type="button" className="text-back-button" onClick={() => setStep(2)}>← Back to order</button>
          </aside>
        </main>
      )}
    </div>
  )
}

function Storefront() {
  const [cart, setCart] = useState({})
  const [selectedKeyQuantities, setSelectedKeyQuantities] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(0)
  const [copyMessage, setCopyMessage] = useState('Click to copy server address')

  const cartItems = [
    ...ranks
      .filter((rank) => cart[rank.id])
      .map((rank) => ({ ...rank, type: 'rank', period: '/ month', quantity: cart[rank.id] })),
    ...crateKeys
      .filter((key) => cart[key.id])
      .map((key) => ({ ...key, type: 'key', quantity: cart[key.id] })),
    ...shardPacks
      .filter((pack) => cart[pack.id])
      .map((pack) => ({ ...pack, type: 'shards', name: `${pack.amount.toLocaleString()} Shards`, quantity: cart[pack.id] })),
  ]
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  const cartTotal = cartItems.reduce((total, item) => total + getLineTotal(item), 0)

  function addToCart(productId, quantity = 1) {
    setCart((current) => ({ ...current, [productId]: (current[productId] || 0) + quantity }))
    setCartOpen(true)
  }

  function updateSelectedKeyQuantity(keyId, amount) {
    setSelectedKeyQuantities((current) => ({
      ...current,
      [keyId]: Math.max(1, (current[keyId] || 1) + amount),
    }))
  }

  function updateQuantity(productId, amount) {
    setCart((current) => {
      const quantity = (current[productId] || 0) + amount
      if (quantity <= 0) {
        const next = { ...current }
        delete next[productId]
        return next
      }
      return { ...current, [productId]: quantity }
    })
  }

  async function copyServerAddress() {
    try {
      await navigator.clipboard.writeText('Qwerysmp.xyz')
      setCopyMessage('Copied! Paste it into Minecraft to join.')
    } catch {
      setCopyMessage('Copy unavailable — enter Qwerysmp.xyz in Minecraft.')
    }
  }

  if (checkoutStep > 0) {
    return (
      <CheckoutFlow
        step={checkoutStep}
        setStep={setCheckoutStep}
        items={cartItems}
        total={cartTotal}
        updateQuantity={updateQuantity}
        addToCart={(productId) => setCart((current) => ({ ...current, [productId]: (current[productId] || 0) + 1 }))}
        onCancel={() => setCheckoutStep(0)}
      />
    )
  }

  return (
    <div className="storefront">
      <header className="store-header">
        <a className="brand" href="#" aria-label="QwerySMP store home">
          <img src="/qwery-logo.jpg" alt="" />
          <span>QWERY<span className="brand-accent">SMP</span></span>
        </a>
        <button className="server-address" type="button" onClick={copyServerAddress} title={copyMessage}>
          <span className="online-dot" />
          <span className="server-address-text">Qwerysmp.xyz</span>
          <span className="copy-hint">{copyMessage}</span>
        </button>
        <button className="cart-button" type="button" onClick={() => setCartOpen(true)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L21 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
          <span>Basket</span><span className="cart-count">{cartCount}</span>
        </button>
      </header>

      <main className="store-main">
        <section className="store-intro">
          <div className="intro-logo">
            <img src="/qwery-logo.jpg" alt="QwerySMP logo" />
          </div>
          <p className="server-kicker"><span className="online-dot" /> THE OFFICIAL SERVER STORE</p>
          <h1>Store</h1>
          <p className="intro-subtitle">Upgrade your experience on QwerySMP</p>
          <button className="join-address" type="button" onClick={copyServerAddress}>
            Qwerysmp.xyz <span aria-hidden="true">↗</span>
          </button>
        </section>

        <section className="shop-section ranks-section" aria-labelledby="ranks-title">
          <div className="section-title-row">
            <h2 id="ranks-title">Ranks</h2>
            <p>Find your next upgrade.</p>
          </div>
          <div className={`rank-grid${ranks.length === 1 ? ' rank-grid-single' : ''}`}>
            {ranks.map((rank) => (
              <article className={`rank-card${rank.bestValue ? ' rank-card-best-value' : ''}`} key={rank.id}>
                <div className="rank-card-heading">
                  <h3>{rank.name.replace(/\++$/, '')}<span>{rank.name.match(/\++$/)?.[0]}</span></h3>
                  {rank.bestValue && <span className="rank-tag">BEST VALUE</span>}
                </div>
                <ul className="rank-perks">
                  <li><span>Rank included</span><strong>{rank.name}</strong></li>
                  <li><span>Homes</span><strong>{rank.homes}</strong></li>
                  <li><span>Shard generation</span><strong><span className="perk-highlight">{rank.shardsPerSecond} shards</span> / second</strong></li>
                  {rank.key && <li><span>Included key</span><strong className="perk-highlight">{rank.key}</strong></li>}
                </ul>
                <button type="button" className="purchase-button" onClick={() => addToCart(rank.id)}>
                  <span className="rank-price-display">
                    <span className="rank-price-main">
                      <strong>{formatPrice(rank.price)}</strong><span>EUR</span><em>/month</em>
                    </span>
                    <del>{formatPrice(rank.originalPrice)}</del>
                  </span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="shop-section crate-keys-section" aria-labelledby="crate-keys-title">
          <div className="crate-keys-heading">
            <p>OPEN SOMETHING LEGENDARY</p>
            <h2 id="crate-keys-title">Crate Keys</h2>
          </div>
          <div className="crate-key-grid">
            {crateKeys.map((key) => (
              <article
                className="crate-key-card"
                key={key.id}
                style={{ '--key-color': key.color }}
              >
                <div className="crate-key-art">
                  <CrateKeyIcon image={key.image} name={key.name} />
                </div>
                <h3>{key.name}</h3>
                <p>{key.description}</p>
                <div className="crate-key-bottom">
                  <div className="crate-key-price">
                    <strong>{formatPrice(getLineTotal({ ...key, type: 'key' }, selectedKeyQuantities[key.id] || 1))}</strong>
                    <span>ONE-TIME</span>
                  </div>
                  <div className="crate-key-actions">
                    <div className="key-quantity-control" aria-label={`${key.name} quantity`}>
                      <button
                        type="button"
                        aria-label={`Remove one ${key.name}`}
                        disabled={(selectedKeyQuantities[key.id] || 1) <= 1}
                        onClick={() => updateSelectedKeyQuantity(key.id, -1)}
                      >−</button>
                      <span aria-live="polite">{selectedKeyQuantities[key.id] || 1}</span>
                      <button
                        type="button"
                        aria-label={`Add one ${key.name}`}
                        onClick={() => updateSelectedKeyQuantity(key.id, 1)}
                      >+</button>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(key.id, selectedKeyQuantities[key.id] || 1)}
                    >View &amp; buy</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="shop-section shards-section" aria-labelledby="shards-title">
          <div className="section-title-row">
            <h2 id="shards-title">Shards</h2>
            <p>Just after shards? Pick a one-time pack.</p>
          </div>
          <div className="shard-grid">
            {shardPacks.map((pack, index) => (
              <article className="shard-card" key={pack.id}>
                {pack.bonus && <span className="bonus-tag">{pack.bonus}</span>}
                <div className={`shard-art shard-art-${index + 1}`}><CrystalIcon size={index > 2 ? 'large' : 'medium'} /></div>
                <h3>{pack.amount.toLocaleString()} <span>Shards</span></h3>
                <button className="shard-price-button" type="button" onClick={() => addToCart(pack.id)}>
                  <strong>{formatPrice(pack.price)}</strong>
                </button>
              </article>
            ))}
          </div>
        </section>

        <p className="checkout-note">Digital items are delivered in-game after a completed purchase.</p>
      </main>

      <footer className="store-footer">
        <div className="footer-secret">
          <a className="footer-brand" href="#">QwerySMP</a>
          <p className="footer-secret-message">Discount Code <strong>QWERY</strong> for 10%</p>
        </div>
        <p>Not affiliated with Mojang or Microsoft.</p>
        <nav aria-label="Footer links">
          <a href="/?page=support">Support</a>
          <a href="/?page=terms-of-service">Terms of service</a>
        </nav>
      </footer>

      {cartOpen && (
        <div className="cart-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setCartOpen(false)
        }}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="cart-header">
              <div><p className="card-overline">QWERY SMP</p><h2 id="cart-title">Your basket <span>({cartCount})</span></h2></div>
              <button className="close-button" type="button" aria-label="Close basket" onClick={() => setCartOpen(false)}>×</button>
            </div>
            {cartItems.length ? (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => {
                    const productId = item.id
                    return (
                      <div className="cart-item" key={productId}>
                        <div className="cart-item-art">
                          {item.type === 'key'
                            ? <CrateKeyIcon image={item.image} name={item.name} size="small" />
                            : item.type === 'rank'
                              ? <img className="qwery-rank-icon" src="/qs-rank-icon.png" alt="QwerySMP QS logo" />
                            : <CrystalIcon size="small" />}
                        </div>
                        <div className="cart-item-info">
                          <h3>{item.name}</h3>
                          <p>{formatPrice(item.price)}{item.period ? ' / month' : ''}</p>
                          {item.key && <p className="cart-item-included">Includes {item.key}</p>}
                          <div className="quantity-control">
                            <button type="button" aria-label={`Remove one ${item.name}`} onClick={() => updateQuantity(productId, -1)}>−</button>
                            <span>{item.quantity}</span>
                            <button type="button" aria-label={`Add one ${item.name}`} onClick={() => updateQuantity(productId, 1)}>+</button>
                          </div>
                        </div>
                        <strong>{formatPrice(getLineTotal(item))}</strong>
                      </div>
                    )
                  })}
                </div>
                <div className="cart-summary">
                  <p><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></p>
                  <small>Checkout is not connected yet. No payment will be taken.</small>
                  <button
                    className="checkout-button"
                    type="button"
                    onClick={() => { setCartOpen(false); setCheckoutStep(1) }}
                  >
                    Go to checkout
                  </button>
                </div>
              </>
            ) : (
              <div className="cart-empty">
                <CrystalIcon size="medium" />
                <p>Your basket is empty. Choose a rank or shard pack to get started.</p>
                <button type="button" onClick={() => setCartOpen(false)}>Back to the store</button>
              </div>
            )}
          </aside>
        </div>
      )}

    </div>
  )
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '')
  const page = new URLSearchParams(window.location.search).get('page')
  if (path === '/terms-of-service' || page === 'terms-of-service') return <TermsOfService />
  if (path === '/support' || page === 'support') return <SupportPage />
  return <Storefront />
}

export default App
