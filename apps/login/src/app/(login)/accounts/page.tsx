import { DynamicTheme } from "@/components/dynamic-theme";
import { SessionsList } from "@/components/sessions-list";
import { Translated } from "@/components/translated";
import { getAllSessionCookieIds } from "@/lib/cookies";
import { getServiceConfig } from "@/lib/service-url";
import { getBrandingSettings, getDefaultOrg, listSessions, ServiceConfig } from "@/lib/zitadel";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { Organization } from "@zitadel/proto/zitadel/org/v2/org_pb";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
// import { getLocale } from "next-intl/server";
import { headers } from "next/headers";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("accounts");
  return { title: t("title") };
}

async function loadSessions({ serviceConfig, organization }: { serviceConfig: ServiceConfig; organization?: string }) {
  const cookieIds = await getAllSessionCookieIds();

  if (cookieIds && cookieIds.length) {
    const response = await listSessions({
      serviceConfig,
      ids: cookieIds.filter((id) => !!id) as string[],
    });

    let sessions = response?.sessions ?? [];
    if (organization) {
      sessions = sessions.filter((s) => s.factors?.user?.organizationId === organization);
    }

    return sessions;
  } else {
    console.info("No session cookie found.");
    return [];
  }
}

export default async function Page(props: { searchParams: Promise<Record<string | number | symbol, string | undefined>> }) {
  const searchParams = await props.searchParams;

  const requestId = searchParams?.requestId;
  const organization = searchParams?.organization;
  const orgDomain = searchParams?.orgDomain;

  const _headers = await headers();
  const { serviceConfig } = getServiceConfig(_headers);

  let defaultOrganization;
  if (!organization) {
    const org: Organization | null = await getDefaultOrg({ serviceConfig });
    if (org) {
      defaultOrganization = org.id;
    }
  }

  let sessions = await loadSessions({ serviceConfig, organization });

  const branding = await getBrandingSettings({ serviceConfig, organization: organization ?? defaultOrganization });

  const params = new URLSearchParams();

  if (requestId) {
    params.append("requestId", requestId);
  }

  if (organization) {
    params.append("organization", organization);
  }

  if (orgDomain) {
    params.append("orgDomain", orgDomain);
  }

  return (
    <DynamicTheme branding={branding}>
      <div className="flex flex-col space-y-4">
        <h1 className="cb-auth-title">
          <Translated i18nKey="title" namespace="accounts" />
        </h1>
        <p className="cb-auth-copy !mb-0">
          <Translated i18nKey="description" namespace="accounts" />
        </p>
      </div>

      <div className="w-full">
        <div className="flex w-full flex-col space-y-2">
          <SessionsList sessions={sessions} requestId={requestId} />
          <Link href={`/loginname?` + params} className="cb-list-row items-center">
            <div className="cb-avatar">
              <UserPlusIcon className="h-5 w-5" />
            </div>
            <span className="cb-list-title">
              <Translated i18nKey="addAnother" namespace="accounts" />
            </span>
          </Link>
        </div>
      </div>
    </DynamicTheme>
  );
}
