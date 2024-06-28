function base64UrlEncode(data: string): string {
  return Buffer.from(data, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}

function encodeJwt(header: string, payload: string, secret: string): string {
  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(payload);
  const signature = base64UrlEncode(
    `${headerEncoded}.${payloadEncoded}.${secret}`
  );
  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

function decodeJwt(token: string): {
  header: string;
  payload: string;
  signature: string;
} {
  const [encodedHeader, encodedPayload, signature] = token.split('.');
  return {
    header: JSON.parse(base64UrlDecode(encodedHeader)),
    payload: JSON.parse(base64UrlDecode(encodedPayload)),
    signature
  };
}

function signJwt(payload: string, secret: string): string {
  const msg = `${payload}.${Date.now()}`;
  const signature = crypto.subtle
    .digest('HMAC', new TextEncoder().encode(secret))
    .then((hashBuffer) => {
      return base64UrlEncode(
        String.fromCharCode(...new Uint8Array(hashBuffer))
      );
    });
  return `${msg}.${signature}`;
}

async function verifyJwt(token: string, secret: string): Promise<boolean> {
  const parts = token.split('.');
  const signature = parts[2];
  const hash = await crypto.subtle.digest(
    'HMAC',
    new TextEncoder().encode(secret)
  );
  const calculatedSignature = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(hash))
  );

  return signature === calculatedSignature;
}
