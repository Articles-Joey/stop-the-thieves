import { Suspense } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import AppThemeProvider from "@/components/AppThemeProvider";
import SocketLogicHandler from "@/components/Handlers/SocketLogicHandler";
import LayoutClient from "./layoutClient";
import packageInfo from "@/package.json";

import "@articles-media/articles-gamepad-helper/dist/articles-gamepad-helper.css";

export const metadata = {
    title: "Stop the Thieves",
    description: packageInfo.description,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <AppThemeProvider>
                        <LayoutClient />
                        <Suspense>
                            <SocketLogicHandler />
                        </Suspense>
                        {children}
                    </AppThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
