"use client";

import { clearSession } from "@/lib/server/session";
import { timestampDate } from "@zitadel/client";
import { Session } from "@zitadel/proto/zitadel/session/v2/session_pb";
import moment from "moment";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "./avatar";
import { isSessionPrimaryFactorAndLifetimeValid } from "./session-item";
import { Translated } from "./translated";

export function SessionClearItem({ session, reload }: { session: Session; reload: () => void }) {
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

  const [_error, setError] = useState<string | null>(null);

  // TODO: To we have to call this?
  useRouter();

  return (
    <button
      onClick={async () => {
        clearSessionId(session.id).then(() => {
          reload();
        });
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
            {verifiedAt && (
              <Translated
                i18nKey="verifiedAt"
                namespace="logout"
                data={{ time: moment(timestampDate(verifiedAt)).fromNow() }}
              />
            )}
          </span>
        ) : (
          verifiedAt && (
            <span className="cb-list-copy truncate">
              expired {session.expirationDate && moment(timestampDate(session.expirationDate)).fromNow()}
            </span>
          )
        )}
      </div>

      <span className="flex-grow"></span>
      <div className="relative flex flex-row items-center">
        <div className="cb-badge cb-badge-error mr-6 hidden transition-all group-hover:inline-flex">
          <Translated i18nKey="clear" namespace="logout" />
        </div>

        {valid ? (
          <div className="cb-dot absolute right-0 mx-2 bg-[var(--cb-success)] transition-all"></div>
        ) : (
          <div className="cb-dot absolute right-0 mx-2 bg-[var(--cb-error)] transition-all"></div>
        )}
      </div>
    </button>
  );
}
