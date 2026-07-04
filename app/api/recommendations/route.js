import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { NextResponse } from "next/server";

const execFileAsync = promisify(execFile);

// function resolvePythonExecutable() {
//     const candidates = [
//         process.env.PYTHON_BIN,
//         path.join(process.cwd(), "AI", "app", "venv", "Scripts", process.platform === "win32" ? "python.exe" : "python"),
//         path.join(process.cwd(), "AI", "app", "venv", "bin", "python"),
//         process.platform === "win32" ? "python.exe" : "python3",
//         "python",
//     ].filter(Boolean);

//     for (const candidate of candidates) {
//         if (!candidate) continue;
//         if (candidate.includes(path.sep) && fs.existsSync(candidate)) {
//             return candidate;
//         }
//         if (!candidate.includes(path.sep)) {
//             return candidate;
//         }
//     }

//     return "python";
// }

async function callPythonScript(textToSend) {
  try {
    const response = await fetch('/api/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textToSend }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data back from Python:", data.processedData);
    return data.processedData;
    
  } catch (error) {
    console.error("Failed to communicate with Python runtime:", error);
  }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "web development";
    const pythonExecutable = resolvePythonExecutable();
    const scriptPath = path.join(process.cwd(), "AI", "app", "main.py");
    const scriptDir = path.join(process.cwd(), "AI", "app");

    try {
        const { stdout } = await execFileAsync(pythonExecutable, [scriptPath, query, "--json"], {
            cwd: scriptDir,
            timeout: 120000,
            maxBuffer: 1024 * 1024 * 5,
        });

        const payload = JSON.parse(stdout);

        return NextResponse.json({
            query,
            recommendations: Array.isArray(payload.recommendations) ? payload.recommendations : [],
        });
    } catch (error) {
        console.error("Recommendation API failed:", error);
        return NextResponse.json(
            {
                query,
                recommendations: [],
                error: error.message || "Unable to generate recommendations.",
            },
            { status: 500 }
        );
    }
}
