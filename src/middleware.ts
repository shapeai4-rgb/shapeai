import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

export default withAuth(
    function middleware(req: NextRequest) {
        // можна залишити порожнім
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/plan"],
};
