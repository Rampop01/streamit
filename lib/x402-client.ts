// Deprecated: Client-side x402 payment is now handled via @stacks/connect wallet extension
// in PaymentGate.tsx. The x402-stacks middleware still runs server-side in
// app/api/content/[id]/route.ts for 402 responses.
//
// The full x402 flow is preserved:
// 1. Server middleware returns HTTP 402 with payment requirements
// 2. Client parses 402 response and opens wallet popup via @stacks/connect
// 3. User approves STX transfer in Leather/Xverse
// 4. Client verifies payment on-chain via /api/content/[id]/verify
