import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import Syllabus from "@/lib/models/Syllabus";

// Fetch admin dashboard details
export async function GET(req) {
  try {
    await dbConnect();

    // Pull stats
    const totalUsers = await User.countDocuments();
    const totalSyllabi = await Syllabus.countDocuments();

    // Fetch registered user directory
    const dbUsers = await User.find({}, { name: 1, email: 1, role: 1, status: 1, createdAt: 1 }).sort({ createdAt: -1 });

    const usersList = dbUsers.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status || "Active",
      joined: u.createdAt ? u.createdAt.toISOString().split("T")[0] : "2026-06-01",
    }));

    return Response.json({
      totalUsers,
      totalSyllabi,
      usersList,
    });
  } catch (e) {
    console.error("Admin stats GET error:", e);
    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// Modify a user's parameters (role or status)
export async function PATCH(req) {
  try {
    await dbConnect();
    const { id, role, status } = await req.json();

    if (!id) {
      return Response.json(
        { error: "Missing user ID parameter." },
        { status: 400 }
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return Response.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    if (role !== undefined) user.role = role;
    if (status !== undefined) user.status = status;

    await user.save();
    return Response.json({ message: "User updated successfully.", user });
  } catch (e) {
    console.error("Admin stats PATCH error:", e);
    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// Delete user account from database
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "Missing user ID parameter." },
        { status: 400 }
      );
    }

    // Delete user
    await User.findByIdAndDelete(id);
    
    // Cascading delete: remove all roadmaps compiled by this user
    await Syllabus.deleteMany({ userId: id });

    return Response.json({ message: "User and associated roadmaps deleted successfully." });
  } catch (e) {
    console.error("Admin stats DELETE error:", e);
    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
