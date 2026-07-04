import dbConnect from "@/lib/dbConnect";
import Course from "@/lib/models/Course";

const seedCourses = [
    {
        title: "React for Beginners",
        description: "Build modern web apps with components, hooks, and state management.",
        category: "Frontend Development",
        tags: ["react", "javascript", "web"],
        level: "Beginner",
        duration: "4 weeks",
        university: "Meta University",
        membersPursuing: 1280,
        rating: 4.8,
        source: "Coursify Catalog",
    },
    {
        title: "Python for Data Science",
        description: "Learn Python essentials for analysis, visualization, and machine learning.",
        category: "Data Science",
        tags: ["python", "data", "pandas"],
        level: "Beginner",
        duration: "5 weeks",
        university: "University of Michigan",
        membersPursuing: 950,
        rating: 4.7,
        source: "Coursify Catalog",
    },
    {
        title: "Machine Learning Essentials",
        description: "Understand foundational algorithms, model training, and evaluation.",
        category: "Machine Learning",
        tags: ["ml", "ai", "classification"],
        level: "Intermediate",
        duration: "6 weeks",
        university: "Stanford University",
        membersPursuing: 1420,
        rating: 4.6,
        source: "Coursify Catalog",
    },
    {
        title: "UI/UX Design Foundations",
        description: "Create thoughtful product flows, wireframes, and interfaces.",
        category: "Design",
        tags: ["design", "ux", "figma"],
        level: "Beginner",
        duration: "3 weeks",
        university: "Google UX Design",
        membersPursuing: 760,
        rating: 4.5,
        source: "Coursify Catalog",
    },
    {
        title: "Next.js Full-Stack Development",
        description: "Learn server-side rendering, routing, APIs, and deployment patterns.",
        category: "Full Stack",
        tags: ["nextjs", "fullstack", "react"],
        level: "Intermediate",
        duration: "6 weeks",
        university: "Vercel Academy",
        membersPursuing: 1860,
        rating: 4.9,
        source: "Coursify Catalog",
    },
];

export async function POST() {
    try {
        await dbConnect();
        await Course.deleteMany({});
        const inserted = await Course.insertMany(seedCourses);
        return Response.json({ message: "Courses seeded successfully.", count: inserted.length });
    } catch (error) {
        console.error("Course seeding error:", error);
        return Response.json({ error: "Failed to seed courses." }, { status: 500 });
    }
}
