import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Gem, BookOpen, Ticket } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <Helmet>
        <title>Sign In — The Olfactory Editorial</title>
      </Helmet>

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left - Benefits */}
          <div className="flex flex-col justify-center">
            <p className="mb-2 text-[10px] tracking-[0.3em] text-[var(--color-accent-gold)]">
              THE CURATOR'S CIRCLE
            </p>
            <h1
              className="mb-6 text-4xl leading-[1.1] text-[var(--color-text-primary)] md:text-5xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Access the
              <br />
              <span className="italic">Editorial Club</span>
            </h1>
            <p className="mb-10 max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Join an elite circle of fragrance enthusiasts and receive curated insights into the
              world of luxury olfaction.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-muted)]">
                  <Gem size={18} className="text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-[var(--color-text-primary)]">
                    Bespoke Curation
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Personalized olfactory profiles designed by our master liquid curators.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-muted)]">
                  <BookOpen size={18} className="text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-[var(--color-text-primary)]">
                    The Manuscript
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    First access to limited edition scent stories and editorial releases.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-muted)]">
                  <Ticket size={18} className="text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-[var(--color-text-primary)]">
                    Private Vernissages
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Invitations to exclusive digital and physical fragrance unveilings globally.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md bg-[var(--color-bg-surface)] p-10">
              <h2
                className="mb-2 text-2xl text-[var(--color-text-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Welcome Back
              </h2>
              <p className="mb-8 text-[10px] tracking-[0.15em] text-[var(--color-text-muted)]">
                ENTER YOUR MANUSCRIPT CREDENTIALS
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-1 block text-[10px] tracking-[0.15em] text-[var(--color-text-muted)]">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="curator@lessenceoire.com"
                    className="w-full border-b border-[var(--color-border)] bg-transparent py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="mb-1 block text-[10px] tracking-[0.15em] text-[var(--color-text-muted)]">
                      PASSWORD
                    </label>
                    <Link to="/forgot-password" className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                      FORGOT?
                    </Link>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border-b border-[var(--color-border)] bg-transparent py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="h-3.5 w-3.5 accent-[var(--color-accent)]"
                  />
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    Keep me signed in to the archives
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full bg-[var(--color-accent)] py-3.5 text-[11px] font-medium tracking-[0.15em] text-[var(--color-text-inverse)] transition-all hover:bg-[var(--color-accent-hover)]"
                >
                  SIGN IN TO THE CLUB
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="mb-4 text-xs text-[var(--color-text-muted)]">or</p>
                <Link
                  to="/register"
                  className="block w-full border border-[var(--color-border)] py-3 text-[11px] tracking-[0.15em] text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)]"
                >
                  APPLY FOR MEMBERSHIP
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
