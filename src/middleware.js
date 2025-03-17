import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("User");
  //  const jsonStringWithFilter = JSON.stringify(Userdata, ["name", "role"]);
  // Log the token for debugging
  if (request.nextUrl.pathname == "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.rewrite(new URL("/", request.url));
  }
  if (request.nextUrl.pathname == "/signin") {
    if (!token) {
      return NextResponse.rewrite(new URL("/signin", request.url));
    }

    return NextResponse.redirect(new URL("/", request.url));
  }
  if (request.nextUrl.pathname == "/signup") {
    if (!token) {
      return NextResponse.rewrite(new URL("/signup", request.url));
    }

    return NextResponse.redirect(new URL("/", request.url));
  }
}
