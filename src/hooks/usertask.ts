import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const useUserTask = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: "User not found",
    };
  }

  const response = await prisma.userTask.findMany({
    where: {
      userId: user.id,
    },
    include: {
      task: true,
    },
  });

  return response;
};

export default useUserTask;
