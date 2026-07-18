"use client";

import { completeDeviceAuthorization } from "@/lib/server/device";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "./alert";
import { Button, ButtonVariants } from "./button";
import { Spinner } from "./spinner";
import { Translated } from "./translated";

export function ConsentScreen({
  scope,
  nextUrl,
  deviceAuthorizationRequestId,
  appName,
}: {
  scope?: string[];
  nextUrl: string;
  deviceAuthorizationRequestId: string;
  appName?: string;
}) {
  const t = useTranslations();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  async function denyDeviceAuth() {
    setLoading(true);
    const response = await completeDeviceAuthorization(deviceAuthorizationRequestId)
      .catch(() => {
        setError("Could not register user");
        return;
      })
      .finally(() => {
        setLoading(false);
      });

    if (response) {
      return router.push("/device");
    }
  }

  const scopes = scope?.filter((s) => !!s);

  return (
    <div className="flex w-full flex-col items-center space-y-4 pt-4">
      <ul className="w-full list-none space-y-2">
        {scopes?.length === 0 && (
          <li className="cb-list-row cursor-default">
            <Translated i18nKey="device.scope.openid" namespace="device" />
          </li>
        )}
        {scopes?.map((s) => {
          const translationKey = `device.scope.${s}`;
          const description = t(translationKey);

          // Check if the key itself is returned and provide a fallback
          const resolvedDescription = description === translationKey ? "" : description;

          return (
            <li key={s} className="cb-list-row cursor-default">
              <span>{resolvedDescription}</span>
            </li>
          );
        })}
      </ul>

      <p className="cb-auth-copy !mb-0 text-left text-xs">
        <Translated i18nKey="request.disclaimer" namespace="device" data={{ appName: appName }} />
      </p>

      {error && (
        <div className="py-4">
          <Alert>{error}</Alert>
        </div>
      )}

      <div className="cb-form-actions mt-4 w-full">
        <Button
          onClick={() => {
            denyDeviceAuth();
          }}
          variant={ButtonVariants.Secondary}
          data-testid="deny-button"
          className="mr-auto"
        >
          {loading && <Spinner className="mr-2 h-5 w-5" />}
          <Translated i18nKey="device.request.deny" namespace="device" />
        </Button>
        <Link href={nextUrl}>
          <Button data-testid="submit-button" type="submit" className="self-end" variant={ButtonVariants.Primary}>
            <Translated i18nKey="device.request.submit" namespace="device" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
