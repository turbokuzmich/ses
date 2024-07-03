import type { Metadata } from "next";
import CssBaseline from "@mui/material/CssBaseline";
import HeaderPlayer from "@/app/_components/player";
import Stack from "@mui/material/Stack";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@mui/material/styles";
import { auth } from "@/lib/auth";
import theme from "./theme";
import Store from "./store";

import "./global.css";

export const metadata: Metadata = {
  title: "SeS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Store>
              <SessionProvider session={session}>
                <Stack direction="column" gap={4} useFlexGap>
                  <HeaderPlayer />
                  {children}
                </Stack>
              </SessionProvider>
            </Store>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
