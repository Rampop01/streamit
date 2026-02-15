'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { CreateContentForm } from '@/components/CreateContentForm';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function CreatePage() {
  const router = useRouter();
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSuccess = (contentId: string) => {
    setSubmittedId(contentId);
    setTimeout(() => {
      router.push(`/content/${contentId}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />

      {/* Background effects */}
      <div className="orb orb-orange w-[400px] h-[400px] -top-32 -left-32 opacity-15" />
      <div className="orb orb-amber w-[300px] h-[300px] bottom-20 -right-24 opacity-15" />

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Create <span className="gradient-text-fire">Premium Content</span>
          </h1>
          <p className="text-muted-foreground">
            Share your content with the world and earn STX payments
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CreateContentForm onSuccess={handleSuccess} />
        </motion.div>

        {submittedId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 glass-card rounded-xl p-5 border-green-500/20 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-400">
                Content created successfully!
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                Redirecting to your content
                <ArrowRight className="w-3 h-3 animate-pulse" />
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
