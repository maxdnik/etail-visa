import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/no-payment/steps/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace("/no-payment", "");
    return NextResponse.rewrite(url);
  }

  if (
    pathname.startsWith("/steps/") &&
    request.cookies.get("eta_flow")?.value === "no-payment"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/no-payment${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/steps/:path*", "/no-payment/steps/:path*"],
};
