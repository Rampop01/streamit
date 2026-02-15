'use client';

import { Navbar } from '@/components/Navbar';
import { ContentCard } from '@/components/ContentCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useContent } from '@/hooks/useContent';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';

export default function ExplorePage() {
  const { content, isLoading, error } = useContent();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(
    new Set(content.map((c) => c.category).filter(Boolean))
  ) as string[];

  // Filter content
  const filtered = content.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.creatorName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />

      <div className="orb orb-orange w-[400px] h-[400px] -top-32 -right-32 opacity-15" />
      <div className="orb orb-amber w-[300px] h-[300px] bottom-20 -left-24 opacity-10" />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-2"
        >
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-stacks-orange-light transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Explore <span className="gradient-text-stacks">Content</span>
            </h1>
            <p className="text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}{' '}
              available
            </p>
          </div>
          <Link href="/create">
            <button className="btn-stacks h-10 px-6 rounded-lg text-white text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Create Content
            </button>
          </Link>
        </motion.div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search content, creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-border/50 focus:border-stacks-orange/50 focus:ring-1 focus:ring-stacks-orange/20 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors"
            />
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-stacks-orange text-white'
                    : 'bg-white/5 border border-border/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat ? null : cat)
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-stacks-orange text-white'
                      : 'bg-white/5 border border-border/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Content grid */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 glass-card rounded-xl border-red-500/20 mb-8"
          >
            <p className="font-semibold text-red-400 mb-1">
              Error loading content
            </p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-full aspect-video skeleton-stacks rounded-xl" />
                <Skeleton className="h-4 w-3/4 skeleton-stacks rounded" />
                <Skeleton className="h-4 w-1/2 skeleton-stacks rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                className="h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <ContentCard content={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 glass-card rounded-2xl"
          >
            <div className="icon-glow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-stacks-orange-light" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {search || selectedCategory
                ? 'No matching content'
                : 'No content yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {search || selectedCategory
                ? 'Try a different search or category filter.'
                : 'Be the first creator on PayStream. Share your premium content and start earning STX.'}
            </p>
            {!search && !selectedCategory && (
              <Link href="/create">
                <button className="btn-stacks h-11 px-6 rounded-lg text-white font-semibold inline-flex items-center gap-2">
                  <span>Create Content</span>
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}