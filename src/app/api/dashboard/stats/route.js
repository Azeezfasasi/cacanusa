import { authenticate, isAdmin } from "@/app/server/middleware/auth.js";
import User from "@/app/server/models/User.js";
import Blog from "@/app/server/models/Blog.js";
import Contact from "@/app/server/models/Contact.js";
import Joinus from "@/app/server/models/Joinus.js";
import { connectDB } from "@/app/server/db/connect.js";
import { NextResponse } from "next/server";

// GET /api/dashboard/stats
// Fetch aggregated statistics from all collections
export async function GET(req) {
  return authenticate(req, async () => {
    return isAdmin(req, async () => {
      try {
        await connectDB();

        // Fetch counts from all collections in parallel
        const [
          usersCount,
          blogsCount,
          contactsCount,
          totalMembershipRequests,
          pendingMembershipRequests,
          adminUsersCount,
          membersUsersCount,
          committeeUsersCount,
        ] = await Promise.all([
          User.countDocuments({ isActive: true }),
          Blog.countDocuments({ status: "published" }),
          Contact.countDocuments(),
          Joinus.countDocuments(),
          Joinus.countDocuments({ status: "pending" }),
          User.countDocuments({ role: "admin", isActive: true }),
          User.countDocuments({ role: "member", isActive: true }),
          User.countDocuments({ role: "committee", isActive: true }),
        ]);

        const stats = {
          users: usersCount,
          blogs: blogsCount,
          contacts: contactsCount,
          membershipRequests: totalMembershipRequests,
          pendingMembershipRequests,
          adminUsers: adminUsersCount,
          membersUsers: membersUsersCount,
          committeeUsers: committeeUsersCount,
        };

        return NextResponse.json(
          {
            success: true,
            stats,
            timestamp: new Date().toISOString(),
          },
          { status: 200 }
        );
      } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message,
          },
          { status: 500 }
        );
      }
    });
  });
}
