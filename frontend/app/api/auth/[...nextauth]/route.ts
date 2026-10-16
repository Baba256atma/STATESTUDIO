import NextAuth from "next-auth";

import { nexoraAuthOptions } from "@/app/lib/auth/nexoraAuthOptions";

const handler = NextAuth(nexoraAuthOptions);

export { handler as GET, handler as POST };
