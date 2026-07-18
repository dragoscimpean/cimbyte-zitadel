"use client";

import { BrandingSettings } from "@zitadel/proto/zitadel/settings/v2/branding_settings_pb";
import { Children, ReactNode } from "react";
import { CimbyteBrand } from "./cimbyte-brand";
import { ThemeWrapper } from "./theme-wrapper";

export function DynamicTheme({ branding, children }: { children: ReactNode; branding?: BrandingSettings }) {
  const childArray = Children.toArray(children);
  const titleContent = childArray[0] || null;
  const formContent = childArray[1] || null;
  const hasMultipleChildren = childArray.length > 1;

  return (
    <ThemeWrapper branding={branding}>
      <div className="cimbyte-login-layout">
        <aside className="cimbyte-login-aside">
          <CimbyteBrand />

          <div className="cimbyte-login-story">
            <div className="cb-eyebrow cb-eyebrow-mono cimbyte-login-eyebrow">Cimbyte Identity</div>
            <h2 className="cb-heading cimbyte-login-headline">One account for every Cimbyte app.</h2>
            <p className="cb-page-head-copy cimbyte-login-lead">
              Sign in securely with Google or your Cimbyte credentials, then continue straight to the app you opened.
            </p>
          </div>

          <div className="cb-meta cb-meta-sm cimbyte-login-stats" aria-label="Supported platforms">
            <div>
              <b>1</b> account
            </div>
            <div>
              <b>5+</b> apps
            </div>
            <div>
              <b>3</b> platforms
            </div>
          </div>
        </aside>

        <main className="cimbyte-login-form">
          <div className="cimbyte-login-form-inner">
            <div className="cimbyte-login-mobile-brand">
              <CimbyteBrand />
            </div>
            {hasMultipleChildren ? (
              <>
                <div className="cimbyte-login-form-heading">{titleContent}</div>
                <div className="cimbyte-login-form-content">{formContent}</div>
              </>
            ) : (
              <div className="cimbyte-login-form-content">{children}</div>
            )}
          </div>
        </main>
      </div>
    </ThemeWrapper>
  );
}
