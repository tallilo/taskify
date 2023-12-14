import { auth } from "@clerk/nextjs";
import OrgControl from "./_components/OrgControl";

import { startCase } from "lodash";

export async function generateMetadata() {
  const { orgSlug } = auth();

  return { title: startCase(orgSlug || "organization") };
}

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {" "}
      <OrgControl />
      {children}
    </>
  );
};

export default OrganizationIdLayout;
