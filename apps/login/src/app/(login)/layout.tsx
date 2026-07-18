import "@/styles/globals.scss";
import "@cimbyte/ui/css";

import { BackgroundWrapper } from "@/components/background-wrapper";
import { CimbyteBrand } from "@/components/cimbyte-brand";
import { LanguageProvider } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeSwitch from "@/components/theme-switch";
import { LANGS, getLanguage } from "@/lib/i18n";
import { getServiceConfig } from "@/lib/service-url";
import { getAllowedLanguages } from "@/lib/zitadel";
import * as Tooltip from "@radix-ui/react-tooltip";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Inter_Tight } from "next/font/google";
import { headers } from "next/headers";
import React, { Suspense } from "react";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--cimbyte-font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common");
  return { title: t("title") };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const _headers = await headers();
  const { serviceConfig } = getServiceConfig(_headers);

  let languages = LANGS;
  try {
    const settings = await getAllowedLanguages({ serviceConfig });
    if (settings.allowedLanguages?.length) {
      languages = settings.allowedLanguages
        .filter((code) => LANGS.find((l) => l.code === code))
        .map((code) => getLanguage(code));
    }
  } catch (e) {
    console.error("Failed to load supported languages", e);
  }

  return (
    <html suppressHydrationWarning>
      <head />
      <body className={`${interTight.variable} cb`}>
        <ThemeProvider>
          <Tooltip.Provider>
            <Suspense
              fallback={
                <BackgroundWrapper className="cimbyte-login-shell">
                  <div className="cimbyte-login-layout">
                    <aside className="cimbyte-login-aside">
                      <CimbyteBrand />
                    </aside>
                    <main className="cimbyte-login-form">
                      <div className="cimbyte-login-form-inner">
                        <div className="cimbyte-login-loading" />
                      </div>
                    </main>
                  </div>
                  <div className="cimbyte-login-controls">
                    <ThemeSwitch />
                  </div>
                </BackgroundWrapper>
              }
            >
              <LanguageProvider>
                <BackgroundWrapper className="cimbyte-login-shell">
                  {children}
                  <div className="cimbyte-login-controls">
                    <LanguageSwitcher languages={languages} />
                    <ThemeSwitch />
                  </div>
                </BackgroundWrapper>
              </LanguageProvider>
            </Suspense>
          </Tooltip.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
