import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";

export async function POST(req) {
    try {
        await dbConnect();
        const { token, password } = await req.json();

        if (!token || !password) {
            return Response.json({ error: "Token and password are required." }, { status: 400 });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            return Response.json({ error: "Reset token is invalid or has expired." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return Response.json({ message: "Password reset successfully." }, { status: 200 });
    } catch (error) {
        console.error("Reset password error:", error);
        return Response.json({ error: "Internal server error." }, { status: 500 });
    }
}
