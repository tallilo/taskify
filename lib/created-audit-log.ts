import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";

interface Props {
  entityId: string;
  entityType: ENTITY_TYPE;
  action: ACTION;
  entityTitle: string;
}

export const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = auth();
    const user = await currentUser();

    if (!orgId || !user) {
      throw new Error("user not found");
    }

    const { entityId, entityTitle, entityType, action } = props;

    await db.auditLog.create({
      data: {
        entityId,
        entityTitle,
        entityType,
        action,
        userId: user.id,
        orgId,
        userImage: user?.imageUrl,
        userName: `${user?.firstName} ${user?.lastName}`,
      },
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
};
