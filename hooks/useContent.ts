'use client';

import { useState, useEffect } from 'react';
import { Content } from '@/lib/types';

/**
 * Hook to fetch and cache content data
 * Used on discovery page and content detail pages
 */
export function useContent() {
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/content');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        setContent(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, isLoading, error };
}

/**
 * Hook to fetch single content by ID
 */
export function useContentById(id: string | null) {
  const [data, setData] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/content/${id}?preview=true`);
        if (!response.ok) throw new Error('Content not found');
        const contentData = await response.json();
        setData(contentData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  return { data, isLoading, error };
}
