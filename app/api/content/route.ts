import { NextRequest, NextResponse } from 'next/server';
import { getAllContent, addContent } from '@/lib/db';
import { Content } from '@/lib/types';

/**
 * GET /api/content - Returns all published content
 * This endpoint is public and doesn't require payment
 */
export async function GET(req: NextRequest) {
  try {
    const content = await getAllContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error('[x402] Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content - Create new content
 * Requires: title, description, embedUrl, thumbnailUrl, priceInSTX, creatorAddress, creatorName
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const { title, description, embedUrl, thumbnailUrl, priceInSTX, creatorAddress, creatorName } =
      body;

    if (
      !title ||
      !description ||
      !embedUrl ||
      !thumbnailUrl ||
      !priceInSTX ||
      !creatorAddress ||
      !creatorName
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (priceInSTX <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Create content entry
    const newContent = await addContent({
      title,
      description,
      embedUrl,
      thumbnailUrl,
      priceInSTX: Number(priceInSTX),
      creatorAddress,
      creatorName,
      category: body.category || undefined,
    });

    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error('[x402] Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
