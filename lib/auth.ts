import NextAuth, { type NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

// Minimal custom session callback to pass through picture/name/email
export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || ''
    }),
    Google({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || ''
    })
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: Record<string, unknown> }) {
      if (token) {
        session.user = {
          ...session.user,
          image: (token.picture as string) || session.user?.image || null,
          name: (token.name as string) || session.user?.name || null,
        } as any;
      }
      return session;
    },
  },
  // Ensure NextAuth uses our custom glass-morphism page at /signin instead of its default UI
  pages: {
    signIn: '/signin'
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig;

export const { auth, handlers: { GET, POST }, signIn, signOut } = NextAuth(authConfig);
