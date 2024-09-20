import { NextRequest, NextResponse } from "next/server";

  export async function GET(request: NextRequest) {
    const params = request;
    console.log('test this', params)
    return NextResponse.json(params);
  }