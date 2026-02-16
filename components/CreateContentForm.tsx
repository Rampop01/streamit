'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWalletStore } from '@/lib/store';
import { toast } from 'sonner';
import { Upload, Wallet, Loader2, Video, FileText, Eye, PenLine } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentType } from '@/lib/types';
import { ArticleRenderer } from '@/components/ArticleRenderer';
import { connect } from '@stacks/connect';


const createContentSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be at most 1000 characters'),
  embedUrl: z.string().optional(),
  articleBody: z.string().optional(),
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
  const [contentType, setContentType] = useState<ContentType>('video');
  const [articleTab, setArticleTab] = useState<'write' | 'preview'>('write');

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
    } catch { }
    return '';
  };

  const onSubmit = async (data: CreateContentFormData) => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    // Validate based on content type
    if (contentType === 'video' && !data.embedUrl) {
      toast.error('Please enter a video URL');
      return;
    }
    if (contentType === 'article' && !data.articleBody) {
      toast.error('Please write your article content');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          contentType,
          embedUrl: contentType === 'video' ? data.embedUrl : '',
          articleBody: contentType === 'article' ? data.articleBody : undefined,
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
        {/* Content Type Selector */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Content Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setContentType('video')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${contentType === 'video'
                ? 'bg-stacks-orange text-white shadow-lg shadow-stacks-orange/20'
                : 'bg-white/5 border border-border/50 text-muted-foreground hover:text-foreground hover:border-stacks-orange/30'
                }`}
            >
              <Video className="w-4 h-4" />
              Video
            </button>
            <button
              type="button"
              onClick={() => setContentType('article')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${contentType === 'article'
                ? 'bg-stacks-orange text-white shadow-lg shadow-stacks-orange/20'
                : 'bg-white/5 border border-border/50 text-muted-foreground hover:text-foreground hover:border-stacks-orange/30'
                }`}
            >
              <FileText className="w-4 h-4" />
              Article
            </button>
          </div>
        </div>

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
            placeholder="Describe what readers/viewers will learn or experience..."
            rows={3}
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

        {/* Video-specific fields */}
        {contentType === 'video' && (
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
        )}

        {/* Article-specific fields with Write/Preview tabs */}
        {contentType === 'article' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Article Content
              </label>
              <div className="flex rounded-lg overflow-hidden border border-border/50">
                <button
                  type="button"
                  onClick={() => setArticleTab('write')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${articleTab === 'write'
                    ? 'bg-stacks-orange text-white'
                    : 'bg-white/5 text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <PenLine className="w-3 h-3" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setArticleTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${articleTab === 'preview'
                    ? 'bg-stacks-orange text-white'
                    : 'bg-white/5 text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
              </div>
            </div>

            {articleTab === 'write' ? (
              <>
                <Textarea
                  {...register('articleBody')}
                  placeholder={`Write your premium article content here...\n\nFormatting tips:\n## Heading\n**bold text**\n- bullet list\n1. numbered list\n![alt text](https://image-url.com/image.jpg)`}
                  rows={14}
                  className={inputClass}
                />
                {errors.articleBody && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.articleBody.message}</p>
                )}
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Supports markdown: ## Headings, **bold**, - lists, ![images](url). Only visible after payment.
                </p>
              </>
            ) : (
              <div className="rounded-lg border border-border/50 bg-white/5 p-6 min-h-[320px]">
                {watch('articleBody') ? (
                  <ArticleRenderer body={watch('articleBody') || ''} />
                ) : (
                  <p className="text-muted-foreground/50 text-sm italic">
                    Start writing to see the preview...
                  </p>
                )}
              </div>
            )}
          </div>
        )}

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
            {contentType === 'video'
              ? 'Use a direct image URL (https://...). Auto-filled from YouTube links.'
              : 'Use a direct image URL (https://...) as the cover image for your article.'}
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
              <span>Create {contentType === 'video' ? 'Video' : 'Article'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
