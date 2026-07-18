"use client";

import { handleServerActionResponse } from "@/lib/client-utils";
import { sendLoginname } from "@/lib/server/loginname";
import { clearSession, continueWithSession, ContinueWithSessionCommand } from "@/lib/server/session";
import { XCircleIcon } from "@heroicons/react/24/outline";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Timestamp, timestampDate } from "@zitadel/client";
import { Session } from "@zitadel/proto/zitadel/session/v2/session_pb";
import moment from "moment";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AutoSubmitForm } from "./auto-submit-form";
import { Avatar } from "./avatar";
import { Translated } from "./translated";

export function isSessionPrimaryFactorAndLifetimeValid(session: Partial<Session>): {
  valid: boolean;
  verifiedAt?: Timestamp;
} {
  const validPassword = session?.factors?.password?.verifiedAt;
  const validPasskey = session?.factors?.webAuthN?.verifiedAt;
  const validIDP = session?.factors?.intent?.verifiedAt;

  const stillValid = session.expirationDate ? timestampDate(session.expirationDate) > new Date() : true;

  const verifiedAt = validPassword || validPasskey || validIDP;
  const valid = !!((validPassword || validPasskey || validIDP) && stillValid);

  return { valid, verifiedAt };
}

export function SessionItem({ session, reload, requestId }: { session: Session; reload: () => void; requestId?: string }) {
  const currentLocale = useLocale();
  moment.locale(currentLocale === "zh" ? "zh-cn" : currentLocale);

  const [_loading, setLoading] = useState<boolean>(false);

  async function clearSessionId(id: string) {
    setLoading(true);
    const response = await clearSession({
      sessionId: id,
    })
      .catch((error) => {
        setError(error.message);
        return;
      })
      .finally(() => {
        setLoading(false);
      });

    return response;
  }

  const { valid, verifiedAt } = isSessionPrimaryFactorAndLifetimeValid(session);
  const [samlData, setSamlData] = useState<{ url: string; fields: Record<string, string> } | null>(null);

  const [_error, setError] = useState<string | null>(null);

  const router = useRouter();

  return (
    <Tooltip.Root delayDuration={300}>
      {samlData && <AutoSubmitForm url={samlData.url} fields={samlData.fields} />}
      <Tooltip.Trigger asChild>
        <button
          onClick={async () => {
            if (valid && session?.factors?.user) {
              const sessionPayload: ContinueWithSessionCommand = session;
              if (requestId) {
                sessionPayload.requestId = requestId;
              }

              const callbackResponse = await continueWithSession(sessionPayload);

              handleServerActionResponse(callbackResponse, router, setSamlData, (e) => setError(e));
            } else if (session.factors?.user) {
              setLoading(true);
              try {
                const res = await sendLoginname({
                  loginName: session.factors?.user?.loginName,
                  organization: session.factors.user.organizationId,
                  requestId: requestId,
                });

                handleServerActionResponse(res, router, setSamlData, (e) => setError(e));
              } catch {
                setError("An internal error occurred");
              } finally {
                setLoading(false);
              }
            }
          }}
          className="cb-list-row group items-center"
        >
          <div>
            <Avatar
              size="small"
              loginName={session.factors?.user?.loginName as string}
              name={session.factors?.user?.displayName ?? ""}
            />
          </div>

          <div className="cb-list-main">
            <span className="cb-list-title truncate">{session.factors?.user?.displayName}</span>
            <span className="cb-list-copy truncate">{session.factors?.user?.loginName}</span>
            {valid ? (
              <span className="cb-list-copy truncate">
                <Translated i18nKey="verified" namespace="accounts" />{" "}
                {verifiedAt && moment(timestampDate(verifiedAt)).fromNow()}
              </span>
            ) : (
              verifiedAt && (
                <span className="cb-list-copy truncate">
                  <Translated i18nKey="expired" namespace="accounts" />{" "}
                  {session.expirationDate && moment(timestampDate(session.expirationDate)).fromNow()}
                </span>
              )
            )}
          </div>

          <span className="flex-grow"></span>
          <div className="relative flex flex-row items-center">
            {valid ? (
              <div className="cb-dot absolute right-6 mx-2 bg-[var(--cb-success)] transition-all sm:right-0"></div>
            ) : (
              <div className="cb-dot absolute right-6 mx-2 bg-[var(--cb-error)] transition-all sm:right-0"></div>
            )}

            <XCircleIcon
              className="h-5 w-5 text-[var(--cb-ink-50)] transition-all group-hover:block hover:text-[var(--cb-error)] sm:hidden"
              onClick={async (event: React.MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                await clearSessionId(session.id);
                reload();
              }}
            />
          </div>
        </button>
      </Tooltip.Trigger>
      {valid && session.expirationDate && (
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 rounded-[var(--cb-radius)] border border-[var(--cb-line)] bg-[var(--cb-paper)] px-3 py-2 text-xs text-[var(--cb-ink)] shadow-[var(--cb-shadow-lg)] select-none"
            sideOffset={5}
          >
            Expires {moment(timestampDate(session.expirationDate)).fromNow()}
            <Tooltip.Arrow className="fill-[var(--cb-paper)]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      )}
    </Tooltip.Root>
  );
}
