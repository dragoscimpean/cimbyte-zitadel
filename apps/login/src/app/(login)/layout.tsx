import "@/styles/globals.scss";
import "@cimbyte/ui/css";

import { BackgroundWrapper } from "@/components/background-wrapper";
import { LanguageProvider } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Skeleton } from "@/components/skeleton";
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
                <BackgroundWrapper className="cb-auth-shell">
                  <div className="cb-auth-wrap">
                    <Skeleton>
                      <div className="h-40"></div>
                    </Skeleton>
                    <div className="cb-auth-footer flex flex-row items-center justify-end gap-3">
                      <ThemeSwitch />
                    </div>
                  </div>
                </BackgroundWrapper>
              }
            >
              <LanguageProvider>
                <BackgroundWrapper className="cb-auth-shell">
                  <div className="relative mx-auto w-full max-w-[1100px] px-4 py-8">
                    <div>{children}</div>
                    <div className="cb-auth-footer mx-auto flex max-w-[420px] flex-row items-center justify-end gap-3">
                      <LanguageSwitcher languages={languages} />
                      <ThemeSwitch />
                    </div>
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
