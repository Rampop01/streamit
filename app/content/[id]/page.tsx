'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { PaymentGate } from '@/components/PaymentGate';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentById } from '@/hooks/useContent';
import { Content } from '@/lib/types';
import { Eye, Share2, ArrowLeft, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ContentPage() {
  const params = useParams();
  const contentId = params.id as string;
  const { data: content, isLoading, error } = useContentById(contentId);
  const [unlockedContent, setUnlockedContent] = useState<Content | null>(null);

  const handleUnlock = (unlockedData: Content) => {
    setUnlockedContent(unlockedData);
    toast.success('Content unlocked! Enjoy your purchase.');
  };

  const handleShare = () => {
    const url = `${window.location.origin}/content/${contentId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background relative">
        <Navbar />
        <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center glass-card rounded-2xl p-12"
          >
            <div className="icon-glow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-stacks-orange-light" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Content Not Found
            </h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/">
              <button className="btn-stacks h-10 px-6 rounded-lg text-white font-medium inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Discover</span>
              </button>
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />

      {/* Background effects */}
      <div className="orb orb-orange w-[400px] h-[400px] -top-32 -right-32 opacity-15" />
      <div className="orb orb-amber w-[300px] h-[300px] bottom-20 -left-24 opacity-10" />

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-stacks-orange-light transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Discover
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="w-full aspect-video skeleton-stacks rounded-xl" />
            <Skeleton className="h-10 w-2/3 skeleton-stacks rounded-lg" />
            <Skeleton className="h-20 w-full skeleton-stacks rounded-lg" />
          </div>
        ) : content ? (
          <div className="space-y-8">
            {/* Video or Thumbnail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {unlockedContent ? (
                <div className="rounded-xl overflow-hidden electric-glow">
                  <VideoPlayer embedUrl={unlockedContent.embedUrl} />
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={content.thumbnailUrl || '/placeholder.svg'}
                    alt={content.title}
                    className="w-full aspect-video object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
              )}
            </motion.div>

            {/* Content Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              {content.category && (
                <div className="stacks-badge inline-flex">{content.category}</div>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {content.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-t border-b border-border/30">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Creator</p>
                  <p className="text-foreground font-semibold">
                    {content.creatorName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Views</p>
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Eye className="w-4 h-4" />
                    {content.views}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Price</p>
                  <p className="text-foreground font-semibold gradient-text-stacks">
                    {content.priceInSTX} STX
                  </p>
                </div>

                <button
                  onClick={handleShare}
                  className="btn-outline-glow flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              <p className="text-foreground/80 text-lg leading-relaxed">
                {content.description}
              </p>
            </motion.div>

            {/* Payment or Unlocked */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {unlockedContent ? (
                <div className="glass-card rounded-xl p-6 border-green-500/20 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold">
                      Content Unlocked
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You own this content forever. Enjoy!
                    </p>
                  </div>
                </div>
              ) : (
                <PaymentGate
                  contentId={contentId}
                  price={content.priceInSTX}
                  creatorAddress={content.creatorAddress}
                  title={content.title}
                  onUnlocked={handleUnlock}
                />
              )}
            </motion.div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
