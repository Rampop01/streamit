'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWalletStore } from '@/lib/store';
import { toast } from 'sonner';
import { Upload, Wallet, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const createContentSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be at most 1000 characters'),
  embedUrl: z.string().url('Please enter a valid URL'),
  thumbnailUrl: z.string().url('Please enter a valid image URL (https://...)'),
  priceInSTX: z
    .number()
    .min(0.01, 'Price must be at least 0.01 STX')
    .max(1000000, 'Price is too high'),
  creatorName: z
    .string()
    .min(2, 'Creator name must be at least 2 characters')
    .max(50, 'Creator name must be at most 50 characters'),
  category: z.string().optional(),
});

type CreateContentFormData = z.infer<typeof createContentSchema>;

interface CreateContentFormProps {
  onSuccess?: (contentId: string) => void;
}

export function CreateContentForm({ onSuccess }: CreateContentFormProps) {
  const { address } = useWalletStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateContentFormData>({
    resolver: zodResolver(createContentSchema),
  });

  const embedUrl = watch('embedUrl');

  // Auto-extract YouTube thumbnail when video URL changes
  const extractYouTubeThumbnail = (url: string) => {
    try {
      const parsed = new URL(url);
      let videoId = '';
      if (parsed.hostname.includes('youtube.com')) {
        videoId = parsed.searchParams.get('v') || '';
      } else if (parsed.hostname.includes('youtu.be')) {
        videoId = parsed.pathname.slice(1);
      }
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    } catch {}
    return '';
  };

  const onSubmit = async (data: CreateContentFormData) => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          creatorAddress: address,
          priceInSTX: Number(data.priceInSTX),
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMsg = 'Failed to create content';
        try {
          const parsed = JSON.parse(text);
          errorMsg = parsed.error || errorMsg;
        } catch {
          errorMsg = `Server error (${response.status})`;
        }
        throw new Error(errorMsg);
      }

      const newContent = await response.json();
      reset();
      toast.success('Content created successfully!');
      onSuccess?.(newContent.id);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create content'
      );
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      const { connect } = await import('@stacks/connect');
      const result = await connect();
      const stxAddress = result.addresses.find(
        (a) => a.symbol === 'STX'
      );
      if (stxAddress) {
        useWalletStore.getState().setAddress(stxAddress.address);
        toast.success('Wallet connected!');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect. Install Leather or Xverse wallet.');
    }
  };

  if (!address) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-xl p-10 text-center"
      >
        <div className="icon-glow w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5">
          <Wallet className="w-6 h-6 text-stacks-orange-light" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-sm text-muted-foreground mb-6">
          You need to connect a wallet to create content
        </p>
        <button
          onClick={handleConnectWallet}
          className="btn-stacks h-11 px-6 rounded-lg text-white font-semibold flex items-center justify-center gap-2 mx-auto"
        >
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </button>
      </motion.div>
    );
  }

  const inputClass =
    'bg-white/5 border-border/50 focus:border-stacks-orange/50 focus:ring-stacks-orange/20 text-sm placeholder:text-muted-foreground/50';

  return (
    <div className="glass-card rounded-xl p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Content Title
          </label>
          <Input
            {...register('title')}
            placeholder="My Amazing Content"
            className={inputClass}
          />
          {errors.title && (
            <p className="text-red-400 text-xs mt-1.5">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Description
          </label>
          <Textarea
            {...register('description')}
            placeholder="Describe what viewers will learn or experience..."
            rows={4}
            className={inputClass}
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1.5">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Category (Optional)
          </label>
          <Input
            {...register('category')}
            placeholder="e.g., Education, Entertainment, Tutorial"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Video URL
          </label>
          <Input
            {...register('embedUrl', {
              onChange: (e) => {
                const thumb = extractYouTubeThumbnail(e.target.value);
                if (thumb) {
                  setValue('thumbnailUrl', thumb);
                }
              },
            })}
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            className={inputClass}
          />
          {errors.embedUrl && (
            <p className="text-red-400 text-xs mt-1.5">{errors.embedUrl.message}</p>
          )}
          <p className="text-[10px] text-muted-foreground mt-1.5">
            YouTube or Vimeo links are supported. Thumbnail auto-fills for YouTube.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Thumbnail URL
          </label>
          <Input
            {...register('thumbnailUrl')}
            placeholder="https://example.com/thumbnail.jpg"
            className={inputClass}
          />
          {errors.thumbnailUrl && (
            <p className="text-red-400 text-xs mt-1.5">
              {errors.thumbnailUrl.message}
            </p>
          )}
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Use a direct image URL (https://...). Auto-filled from YouTube links.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Price (STX)
          </label>
          <Input
            {...register('priceInSTX', { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="10"
            className={inputClass}
          />
          {errors.priceInSTX && (
            <p className="text-red-400 text-xs mt-1.5">
              {errors.priceInSTX.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Creator Name
          </label>
          <Input
            {...register('creatorName')}
            placeholder="Your Name"
            className={inputClass}
          />
          {errors.creatorName && (
            <p className="text-red-400 text-xs mt-1.5">
              {errors.creatorName.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn-stacks w-full h-12 rounded-lg text-white text-base font-semibold flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Create Content</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
