import type { Metadata } from "next";
import { DM_Sans} from "next/font/google";
import "./globals.css";
import QueryProvider from "@/context/query-provider";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "sonner";


const dm_sans = DM_Sans({subsets: ["latin"]})


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-background ${dm_sans.className}  antialiased`}>
        <QueryProvider>
          <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange>
            {children}
            <Toaster position="top-center"/>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
