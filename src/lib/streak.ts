import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function handleStreak(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastLogin: true, streakCount: true },
    });

    if (!user) {
      console.error("User not found for streak handling");
      return;
    }

    const now = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;

    // If no last login, this is first login
    if (!lastLogin) {
      await prisma.user.update({
        where: { id: userId },
        data: { lastLogin: now },
      });
      return;
    }

    const hoursSinceLastLogin =
      (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastLogin > 48) {
      // Reset streak if more than 48 hours
      await prisma.user.update({
        where: { id: userId },
        data: {
          streakCount: 0,
          lastLogin: now,
        },
      });
    } else if (hoursSinceLastLogin > 24) {
      // Increment streak if between 24-48 hours
      const newStreakCount = (user.streakCount || 0) + 1;

      // Update streak count and last login
      await prisma.user.update({
        where: { id: userId },
        data: {
          streakCount: newStreakCount,
          lastLogin: now,
        },
      });

      // Award points for maintaining streak
      const res = await axios.post("/api/user/updatepoints", {
        userId: userId,
        points: 1000,
        reason: "streak_bonus",
      });
      if (res.status === 200) {
        console.log("Streak bonus awarded");
      } else {
        console.error("Failed to award streak bonus");
      }
    } else {
      // Update last login time for logins within 24 hours
      await prisma.user.update({
        where: { id: userId },
        data: { lastLogin: now },
      });
    }
  } catch (error) {
    console.error("Error handling streak:", error);
  }
}
