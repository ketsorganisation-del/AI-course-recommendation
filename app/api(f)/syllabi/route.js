import dbConnect from "@/lib/dbConnect";
import Syllabus from "@/lib/models/Syllabus";

// Fetch all saved roadmaps for a user
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { error: "Missing userId query parameter." },
        { status: 400 }
      );
    }

    const list = await Syllabus.find({ userId }).sort({ createdAt: -1 });
    return Response.json(list);
  } catch (e) {
    console.error("GET syllabus error:", e);
    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// Create and save a new roadmap
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, title, subtitle, query, estimatedWeeks, level, outline } = body;

    if (!userId || !title || !query) {
      return Response.json(
        { error: "Missing required fields: userId, title, or query." },
        { status: 400 }
      );
    }

    const saved = await Syllabus.create({
      userId,
      title,
      subtitle,
      query,
      estimatedWeeks,
      level,
      outline,
    });

    return Response.json(saved, { status: 201 });
  } catch (e) {
    console.error("POST syllabus error:", e);
    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// Update checkpoint status (mark week as complete/incomplete)
export async function PATCH(req) {
  try {
    await dbConnect();
    const { id, weekIndex, completed } = await req.json();

    if (!id || weekIndex === undefined) {
      return Response.json(
        { error: "Missing syllabus id or weekIndex." },
        { status: 400 }
      );
    }

    const item = await Syllabus.findById(id);
    if (!item) {
      return Response.json(
        { error: "Syllabus not found." },
        { status: 404 }
      );
    }

    // Update completed state
    item.outline[weekIndex].completed = completed;

    // Recalculate progress rate
    const completedWeeks = item.outline.filter((w) => w.completed).length;
    item.progress = Math.round((completedWeeks / item.outline.length) * 100);

    await item.save();
    return Response.json(item);
  } catch (e) {
    console.error("PATCH syllabus error:", e);
    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// Delete a saved roadmap
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "Missing syllabus id parameter." },
        { status: 400 }
      );
    }

    await Syllabus.findByIdAndDelete(id);
    return Response.json({ message: "Syllabus deleted successfully." });
  } catch (e) {
    console.error("DELETE syllabus error:", e);
    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
