import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  paramsPromise: Promise<{ path: string[] }>,
  method: string
) {
  const { path } = await paramsPromise;
  const pathStr = path.join('/');
  const search = request.nextUrl.search;

  // Determine backend URL dynamically at runtime
  const backendBase =
    process.env.API_URL_INTERNAL ||
    process.env.BACKEND_URL ||
    (process.env.NODE_ENV === 'production' && !process.env.API_URL_INTERNAL
      ? 'http://backend:4000/api'
      : 'http://localhost:4000/api');

  const targetUrl = `${backendBase.replace(/\/$/, '')}/${pathStr}${search}`;

  try {
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    const body = ['GET', 'HEAD'].includes(method) ? undefined : await request.blob();

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    const data = await response.blob();
    const resHeaders = new Headers();
    response.headers.forEach((value, key) => {
      resHeaders.set(key, value);
    });

    return new NextResponse(data, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (err: any) {
    console.error(`Proxy error to ${targetUrl}:`, err);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend', details: err?.message },
      { status: 502 }
    );
  }
}
