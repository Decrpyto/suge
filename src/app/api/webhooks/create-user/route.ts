// app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";

const WEBHOOK_SECRET = process.env.CLERK_CREATE_USER_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    try {
        if (!WEBHOOK_SECRET) {
            console.error("❌ Missing Clerk webhook secret");
            return NextResponse.json(
                { error: "Server Misconfigured" },
                { status: 500 }
            );
        }

        // ✅ Clerk will verify raw request (body + headers)
        const evt = await verifyWebhook(request, {
            signingSecret: WEBHOOK_SECRET,
        });

        if (evt.type === "user.created" || evt.type === "user.updated") {
            const { id, first_name, last_name, image_url, email_addresses } =
                evt.data;
            const fullName = `${first_name || ""} ${last_name || ""}`.trim();

            await fetchMutation(api.myfunctionts.createOrUpdateUserMutation, {
                clerkId: id,
                fullName: fullName,
                imageUrl: image_url,
                email: email_addresses?.[0]?.email_address || "",
                role: "",
                bio: "",
                experienceYears: 0,
                skills: [],
                isAvailableForHire: false,
                plan: "Free",
                createdAt: Date.now(),
            });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("❌ Clerk webhook verification failed:", err);
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 }
        );
    }
}
