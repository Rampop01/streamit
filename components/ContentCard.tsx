'use client';

import { Content } from '@/lib/types';
import Link from 'next/link';
import { Zap, Eye, User, Play, FileText } from 'lucide-react';

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <Link href={`/content/${content.id}`}>
      <div className="content-card relative cursor-pointer group h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video overflow-hidden flex-shrink-0">
          <img
            src={content.thumbnailUrl || '/placeholder.svg'}
            alt={content.title}
            className="content-card-image w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Play/Read overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-stacks-orange/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-stacks-orange/30">
              {(content.contentType || 'video') === 'article' ? (
                <FileText className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              )}
            </div>
          </div>

          {/* Price badge */}
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-stacks-orange/40 text-stacks-orange font-bold text-sm">
              <Zap className="w-3.5 h-3.5 fill-stacks-orange" />
              {content.priceInSTX} STX
            </div>
          </div>

          {/* Category */}
          {content.category && (
            <div className="absolute top-3 left-3 z-10">
              <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md border border-white/15 text-white/90">
                {content.category}
              </div>
            </div>
          )}
        </div>

        {/* Content info */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-base line-clamp-2 text-white group-hover:text-stacks-orange transition-colors duration-300">
            {content.title}
          </h3>

          <p className="text-sm text-white/50 line-clamp-2 leading-relaxed mt-3">
            {content.description}
          </p>

          {/* Creator and stats — pushed to bottom */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-stacks-orange/20 border border-stacks-orange/30 flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-stacks-orange" />
              </div>
              <p className="text-sm font-medium text-white/80 truncate max-w-[120px]">
                {content.creatorName}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-white/40 flex-shrink-0">
              <Eye className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">{content.views}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
