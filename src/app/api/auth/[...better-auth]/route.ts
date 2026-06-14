import { auth } from "@/auth"; // Adjust this relative path if necessary!
import { toNextJsHandler } from "better-auth/next-js";

// 💡 Destructure the GET and POST functions directly from the handler!
export const { GET, POST } = toNextJsHandler(auth);