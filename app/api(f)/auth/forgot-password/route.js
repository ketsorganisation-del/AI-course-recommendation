import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";

export async function POST(req) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email) {
            return Response.json({ error: "Email is required." }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return Response.json({ message: "If an account exists, a reset link has been prepared." }, { status: 200 });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiresAt;
        await user.save();

        return Response.json(
            {
                message: "If an account exists, a reset link has been prepared.",
                resetToken: token,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Forgot password error:", error);
        return Response.json({ error: "Internal server error." }, { status: 500 });
    }
}
