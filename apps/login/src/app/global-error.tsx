"use client";

import { Boundary } from "@/components/boundary";
import { Button } from "@/components/button";
import { CimbyteBrand } from "@/components/cimbyte-brand";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { Translated } from "@/components/translated";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    // global-error must include html and body tags
    <html suppressHydrationWarning>
      <body className="cb">
        <ThemeProvider>
          <ThemeWrapper branding={undefined}>
            <main className="cb-auth-shell">
              <div className="cb-auth-wrap">
                <CimbyteBrand />
                <Boundary labels={["Login Error"]} color="red">
                  <div className="space-y-4">
                    <div className="cb-alert cb-alert-error">
                      <span className="font-bold">Error:</span> {error?.message}
                    </div>
                    <div>
                      <Button data-i18n-key="error.tryagain" onClick={() => reset()}>
                        <Translated i18nKey="tryagain" namespace="error" />
                      </Button>
                    </div>
                  </div>
                </Boundary>
              </div>
            </main>
          </ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
