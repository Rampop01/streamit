'use client';

import { Navbar } from '@/components/Navbar';
import { ContentCard } from '@/components/ContentCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useContent } from '@/hooks/useContent';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Layers,
  Lock,
  Sparkles,
  TrendingUp,
  Play,
} from 'lucide-react';

function LightningBolt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.1"
      />
    </svg>
  );
}

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="stat-card rounded-xl p-6 text-center"
    >
      <div className="text-3xl md:text-4xl font-bold gradient-text-stacks mb-1">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="glass-card mirror-card rounded-xl p-6 group cursor-default"
    >
      <div className="icon-glow w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-stacks-orange-light" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}


export default function Page() {
  const { content, isLoading, error } = useContent();

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid hero-grid-fade" />

        {/* Animated orbs — big and bright */}
        <div className="orb orb-orange w-[600px] h-[600px] -top-48 -left-48 opacity-40" />
        <div className="orb orb-amber w-[500px] h-[500px] top-10 -right-40 opacity-35" />
        <div className="orb orb-warm w-[350px] h-[350px] bottom-0 left-1/3 opacity-25" />

        {/* Lightning bolts — bright and glowing */}
        <div className="absolute top-20 left-[10%] lightning-flash" style={{ filter: 'drop-shadow(0 0 12px rgba(252,100,50,0.8))' }}>
          <LightningBolt className="w-12 h-12 text-stacks-orange/70" />
        </div>
        <div className="absolute top-32 left-[30%] lightning-flash" style={{ animationDelay: '1s', filter: 'drop-shadow(0 0 8px rgba(255,167,38,0.7))' }}>
          <LightningBolt className="w-8 h-8 text-stacks-amber/60" />
        </div>
        <div className="absolute top-48 right-[15%] lightning-flash" style={{ animationDelay: '2s', filter: 'drop-shadow(0 0 15px rgba(252,100,50,0.9))' }}>
          <LightningBolt className="w-14 h-14 text-stacks-orange/60" />
        </div>
        <div className="absolute top-64 right-[35%] lightning-flash" style={{ animationDelay: '0.5s', filter: 'drop-shadow(0 0 10px rgba(255,167,38,0.8))' }}>
          <LightningBolt className="w-6 h-6 text-stacks-amber/50" />
        </div>
        <div className="absolute bottom-40 left-[20%] lightning-flash" style={{ animationDelay: '3s', filter: 'drop-shadow(0 0 12px rgba(252,100,50,0.8))' }}>
          <LightningBolt className="w-10 h-10 text-stacks-orange/50" />
        </div>
        <div className="absolute bottom-28 right-[25%] lightning-flash" style={{ animationDelay: '1.5s', filter: 'drop-shadow(0 0 8px rgba(255,112,67,0.7))' }}>
          <LightningBolt className="w-7 h-7 text-stacks-warm/60" />
        </div>
        <div className="absolute top-40 left-[55%] lightning-flash" style={{ animationDelay: '2.5s', filter: 'drop-shadow(0 0 18px rgba(252,100,50,1))' }}>
          <LightningBolt className="w-16 h-16 text-stacks-orange/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
           

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="text-foreground">Stream Payments.</span>
              <br />
              <span className="gradient-text-stacks">Stream Content.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              The first content monetization platform built on{' '}
              <span className="text-stacks-orange-light font-medium">HTTP 402</span>{' '}
              and the{' '}
              <span className="text-stacks-amber font-medium">Stacks blockchain</span>.
              Pay once with STX, unlock forever.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/wallet">
                <button className="btn-stacks h-12 px-8 rounded-lg text-white font-semibold flex items-center gap-2 text-base">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a href="#content">
                <button className="btn-outline-glow h-12 px-8 rounded-lg text-foreground font-medium flex items-center gap-2 text-base">
                  <Play className="w-4 h-4" />
                  <span>Browse Content</span>
                </button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <AnimatedCounter value="HTTP 402" label="Payment Protocol" />
              <AnimatedCounter value="STX" label="Native Currency" />
              <AnimatedCounter value="< 1s" label="Payment Speed" />
              <AnimatedCounter value="100%" label="Creator Revenue" />
            </motion.div>
          </div>
        </div>

        <div className="section-divider" />
      </section>

      {/* FEATURES SECTION */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why <span className="gradient-text-fire">PayStream</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built on the x402 open payment standard, leveraging HTTP 402 and the Stacks blockchain for seamless content monetization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Zap} title="Instant Payments" description="One-click payments powered by x402-stacks. No sign-ups, no subscriptions. Just seamless STX transactions." delay={0} />
            <FeatureCard icon={Lock} title="Wallet-Signed Payments" description="Connect Leather or Xverse — your wallet signs every transaction. No private keys stored in the app." delay={0.1} />
            <FeatureCard icon={Shield} title="HTTP 402 Native" description="The first platform to natively implement the HTTP 402 Payment Required status code for content gating." delay={0.2} />
            <FeatureCard icon={Layers} title="Stacks Blockchain" description="Secured by Bitcoin through the Stacks layer. Every payment is verifiable and immutable." delay={0.3} />
            <FeatureCard icon={Globe} title="Open Protocol" description="Built on the open x402-stacks standard. Interoperable, composable, and ready for the decentralized web." delay={0.4} />
            <FeatureCard icon={TrendingUp} title="Creator-First" description="100% of payments go directly to creators. No intermediaries, no platform fees on content sales." delay={0.5} />
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* HOW IT WORKS — Orange accent section with embers */}
      <section className="relative py-24 how-it-works-bg bg-gradient-to-br from-stacks-orange via-orange-600 to-stacks-orange-dark overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Floating embers */}
        <div className="ember" style={{ left: '10%', bottom: '20%', animationDelay: '0s' }} />
        <div className="ember" style={{ left: '25%', bottom: '10%', animationDelay: '0.8s' }} />
        <div className="ember" style={{ left: '45%', bottom: '30%', animationDelay: '1.6s' }} />
        <div className="ember" style={{ left: '65%', bottom: '5%', animationDelay: '2.4s' }} />
        <div className="ember" style={{ left: '80%', bottom: '15%', animationDelay: '3.2s' }} />
        <div className="ember" style={{ left: '55%', bottom: '25%', animationDelay: '0.4s' }} />
        <div className="ember" style={{ left: '35%', bottom: '35%', animationDelay: '1.2s' }} />
        <div className="ember" style={{ left: '90%', bottom: '20%', animationDelay: '2s' }} />

        {/* Glowing orbs on the orange background */}
        <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-white/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[250px] h-[250px] rounded-full bg-black/20 blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  How It <span className="text-black/80">Works</span>
                </h2>
                <p className="text-white/80 mb-10">
                  PayStream uses the x402-stacks HTTP 402 protocol with wallet-signed STX payments verified on-chain.
                </p>
              </motion.div>

              <div className="space-y-8">
                {[
                  { step: 1, title: 'Connect Your Wallet', desc: 'Connect your Leather or Xverse wallet in one click. No private keys stored in the browser.' },
                  { step: 2, title: 'Browse Premium Content', desc: 'Explore the marketplace and discover content from creators worldwide.' },
                  { step: 3, title: 'Pay with STX', desc: 'Click unlock — the server returns an HTTP 402 with payment details, and your wallet signs the STX transfer.' },
                  { step: 4, title: 'Own Forever', desc: 'Payment is verified on-chain via the Stacks blockchain. Content is yours forever.' },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black/30 border border-white/40 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-black/20">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-white/70">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Protocol Flow Card — solid dark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flow-card-dark rounded-2xl p-8 relative"
            >
              {/* Subtle glow behind the card */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-stacks-orange/20 via-transparent to-stacks-orange/10 blur-sm -z-10" />

              <div className="space-y-4">
                {/* Step 1: Client Request */}
                <div className="flow-step-dark rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stacks-orange/15 border border-stacks-orange/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-stacks-orange-light" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Client Request</div>
                    <div className="text-xs text-white/50 font-mono">GET /api/content/123</div>
                  </div>
                </div>

                {/* Spark connector 1 */}
                <div className="flex justify-center">
                  <div className="spark-connector spark-connector-1" />
                </div>

                {/* Step 2: 402 Payment Required */}
                <div className="flow-step-dark rounded-lg p-4 flex items-center gap-3 !border-yellow-400/25">
                  <div className="w-10 h-10 rounded-lg bg-yellow-400/15 border border-yellow-400/25 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-yellow-300">402 Payment Required</div>
                    <div className="text-xs text-white/50">Server returns payment details</div>
                  </div>
                </div>

                {/* Spark connector 2 */}
                <div className="flex justify-center">
                  <div className="spark-connector spark-connector-2" />
                </div>

                {/* Step 3: Client Signs */}
                <div className="flow-step-dark rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stacks-orange/15 border border-stacks-orange/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-stacks-orange-light" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Wallet Signs & Pays</div>
                    <div className="text-xs text-white/50">Leather/Xverse signs the STX transfer</div>
                  </div>
                </div>

                {/* Spark connector 3 */}
                <div className="flex justify-center">
                  <div className="spark-connector spark-connector-3" />
                </div>

                {/* Step 4: Content Unlocked */}
                <div className="flow-step-dark rounded-lg p-4 flex items-center gap-3 !border-green-400/25">
                  <div className="w-10 h-10 rounded-lg bg-green-400/15 border border-green-400/25 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-green-400">Content Unlocked</div>
                    <div className="text-xs text-white/50">Payment confirmed on Stacks blockchain</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FEATURED CONTENT — show up to 3 items */}
      <section id="content" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Featured <span className="gradient-text-stacks">Content</span>
              </h2>
              <p className="text-muted-foreground">
                Handpicked from the marketplace
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/explore">
                <button className="btn-outline-glow h-10 px-6 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  View All
                </button>
              </Link>
              <Link href="/create">
                <button className="btn-stacks h-10 px-6 rounded-lg text-white text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create
                </button>
              </Link>
            </div>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 glass-card rounded-xl border-red-500/20 mb-8">
              <p className="font-semibold text-red-400 mb-1">Error loading content</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </motion.div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-full aspect-video skeleton-stacks rounded-xl" />
                  <Skeleton className="h-4 w-3/4 skeleton-stacks rounded" />
                  <Skeleton className="h-4 w-1/2 skeleton-stacks rounded" />
                </div>
              ))}
            </div>
          ) : content.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.slice(0, 3).map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="h-full"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ContentCard content={item} />
                  </motion.div>
                ))}
              </div>
              {content.length > 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center mt-10"
                >
                  <Link href="/explore">
                    <button className="btn-outline-glow h-11 px-8 rounded-lg text-sm font-medium inline-flex items-center gap-2">
                      View all {content.length} items
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 glass-card rounded-2xl"
            >
              <div className="icon-glow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-stacks-orange-light" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No content yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Be the first creator on PayStream. Share your premium content and start earning STX.
              </p>
              <Link href="/create">
                <button className="btn-stacks h-11 px-6 rounded-lg text-white font-semibold inline-flex items-center gap-2">
                  <span>Create Content</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stacks-orange to-stacks-amber flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">PayStream</span>
              <span className="text-xs text-muted-foreground">x402 Stacks Challenge</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="https://docs.stacks.co/" target="_blank" rel="noopener noreferrer" className="hover:text-stacks-orange-light transition-colors">Stacks Docs</a>
              <a href="https://explorer.hiro.so/sandbox/faucet?chain=testnet" target="_blank" rel="noopener noreferrer" className="hover:text-stacks-orange-light transition-colors">Get Testnet STX</a>
              <span className="text-border">|</span>
              <span>Built with x402-stacks</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
