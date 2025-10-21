import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { fetchMutation, fetchQuery } from "convex/nextjs";
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

        const evt = await verifyWebhook(request, {
            signingSecret: WEBHOOK_SECRET,
        });

        if (evt.type === "user.created" || evt.type === "user.updated") {
            const { id, first_name, last_name, image_url, email_addresses } =
                evt.data;
            const fullName = `${first_name || ""} ${last_name || ""}`.trim();
            const email = email_addresses?.[0]?.email_address || "";

            // ✅ Fetch existing user
            const existingUser = await fetchQuery(
                api.myfunctionts.getUserByClerkId,
                {
                    clerkId: id,
                }
            );

            await fetchMutation(api.myfunctionts.createOrUpdateUserMutation, {
                clerkId: id,
                fullName,
                imageUrl: image_url,
                email,

                // 👇 Preserve previous values if they exist
                role: existingUser?.role ?? "",
                bio: existingUser?.bio ?? "",
                experienceYears: existingUser?.experienceYears ?? 0,
                skills: existingUser?.skills ?? [],
                isAvailableForHire: existingUser?.isAvailableForHire ?? false,
                plan: existingUser?.plan ?? "Free",
                createdAt: existingUser?.createdAt ?? Date.now(),
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
