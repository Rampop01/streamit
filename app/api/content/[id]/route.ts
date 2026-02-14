import { NextRequest, NextResponse } from 'next/server';
import {
  paymentMiddleware,
  getPayment,
  STXtoMicroSTX,
} from 'x402-stacks';
import { getContentById } from '@/lib/db';

/**
 * GET /api/content/[id] - Fetch content with payment gate
 *
 * THE x402 PAYMENT FLOW:
 * 1. Client requests without payment signature → 402 response with payment details
 * 2. Client's axios interceptor signs the transaction
 * 3. Client retries with signature → middleware verifies and grants access
 * 4. Server returns unlocked content
 *
 * This endpoint requires payment of content.priceInSTX before returning embedUrl
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await params;
    const content = await getContentById(contentId);

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Preview mode: return content metadata without embedUrl (no payment required)
    const { searchParams } = new URL(req.url);
    if (searchParams.get('preview') === 'true') {
      const { embedUrl, ...preview } = content;
      return NextResponse.json(preview);
    }

    // Create payment middleware configuration
    // This enforces payment requirement for accessing the full content
    const middleware = paymentMiddleware({
      // Convert STX to microSTX (1 STX = 1,000,000 microSTX)
      amount: STXtoMicroSTX(content.priceInSTX),
      // Creator's address receives the payment (payTo is the v2 field name)
      payTo: content.creatorAddress,
      // Use testnet for development
      network: 'testnet',
      // Facilitator that broadcasts transactions
      facilitatorUrl:
        process.env.FACILITATOR_URL ||
        'https://x402-backend-7eby.onrender.com',
      // Payment description shown to user
      description: `Access to "${content.title}"`,
      // Stacks asset type
      asset: 'STX',
    });

    // Apply middleware: handles 402 response and payment verification
    return new Promise<NextResponse>((resolve) => {
      const responseHeaders: Record<string, string> = {};

      // Adapt NextRequest to Express-like request for x402 middleware
      const url = new URL(req.url);
      const expressReq: any = {
        get: (name: string) => req.headers.get(name),
        header: (name: string) => req.headers.get(name),
        headers: Object.fromEntries(req.headers.entries()),
        url: url.pathname + url.search,
        originalUrl: url.pathname + url.search,
        method: req.method,
        path: url.pathname,
        protocol: url.protocol.replace(':', ''),
        ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
        query: Object.fromEntries(url.searchParams.entries()),
        body: null,
      };

      // Mock Express-style response for the middleware
      const res: any = {
        status: (code: number) => {
          return {
            json: (data: any) => {
              resolve(NextResponse.json(data, { status: code, headers: responseHeaders }));
            },
            send: (data: any) => {
              resolve(new NextResponse(typeof data === 'string' ? data : JSON.stringify(data), { status: code, headers: responseHeaders }));
            },
          };
        },
        json: (data: any) => {
          resolve(NextResponse.json(data, { headers: responseHeaders }));
        },
        set: (key: string, value: string) => {
          responseHeaders[key] = value;
          return res;
        },
        setHeader: (key: string, value: string) => {
          responseHeaders[key] = value;
          return res;
        },
      };

      const next = () => {
        // Payment verified! Get payment details from request
        const payment = getPayment(expressReq);

        const headers: Record<string, string> = { ...responseHeaders };
        if (payment) {
          headers['payment-response'] = JSON.stringify({
            transaction: payment.transaction,
            payer: payment.payer,
          });
        }

        // Return content (now unlocked) with payment info
        resolve(
          NextResponse.json(
            {
              ...content,
              paidBy: payment?.payer,
              txId: payment?.transaction,
            },
            { headers }
          )
        );
      };

      middleware(expressReq, res, next);
    });
  } catch (error) {
    console.error('[x402] Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
