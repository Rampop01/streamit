import fs from 'fs/promises';
import path from 'path';
import { Content } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

// Ensure data directory and files exist
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(CONTENT_FILE);
    } catch {
      // File doesn't exist, create with initial empty array
      await fs.writeFile(CONTENT_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('[x402] Failed to initialize data directory:', error);
  }
}

// Retrieve all content from database
export async function getAllContent(): Promise<Content[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(CONTENT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[x402] Failed to read content:', error);
    return [];
  }
}

// Get single content by ID
export async function getContentById(id: string): Promise<Content | null> {
  const content = await getAllContent();
  return content.find((c) => c.id === id) || null;
}

// Add new content to database
export async function addContent(
  content: Omit<Content, 'id' | 'createdAt' | 'views'>
): Promise<Content> {
  await ensureDataDir();
  const allContent = await getAllContent();

  // Generate unique ID using timestamp + random string
  const newContent: Content = {
    ...content,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    createdAt: Date.now(),
    views: 0,
  };

  allContent.push(newContent);
  await fs.writeFile(CONTENT_FILE, JSON.stringify(allContent, null, 2));

  return newContent;
}

// Update content (for incrementing views, etc)
export async function updateContent(id: string, updates: Partial<Content>): Promise<Content | null> {
  await ensureDataDir();
  const allContent = await getAllContent();

  const index = allContent.findIndex((c) => c.id === id);
  if (index === -1) return null;

  allContent[index] = { ...allContent[index], ...updates };
  await fs.writeFile(CONTENT_FILE, JSON.stringify(allContent, null, 2));

  return allContent[index];
}
