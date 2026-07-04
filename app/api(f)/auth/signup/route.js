import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Check duplicate
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return Response.json(
        { error: "Email already registered." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // First registered user gets Admin status automatically for workspace preview
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "Admin" : "User";

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    return Response.json(
      {
        message: "User registered successfully.",
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("Signup error:", e);
    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
