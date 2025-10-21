"use client";

import { SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
    bio: z.string().min(3, "Bio must be at least 3 characters").max(1000),
    role: z.string().min(2, "Role is too short"),
    experienceYears: z.coerce
        .number()
        .min(0, "Experience must be a valid number"),
});

const EditProfile = () => {
    const { user } = useUser();
    const updateProfile = useMutation(api.myfunctionts.updateUserProfile);

    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [isAvailableForHire, setIsAvailableForHire] = useState(false);
    const [loading, setLoading] = useState(false);

    const addSkill = () => {
        const trimmed = skillInput.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed]);
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) {
            toast.error("Not Authenticated");
            return redirect("/");
        }

        const form = e.currentTarget;
        const formData = new FormData(form);

        const bio = formData.get("bio") as string;
        const role = formData.get("role") as string;
        const experienceYears = formData.get("experienceYears") as string;

        const result = formSchema.safeParse({ bio, role, experienceYears });

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            const firstError =
                errors.bio?.[0] ||
                errors.role?.[0] ||
                errors.experienceYears?.[0];
            toast.error(firstError ?? "Please fix the form errors");
            return;
        }

        const payload = {
            clerkId: user.id,
            bio,
            role,
            skills,
            isAvailableForHire,
            experienceYears: result.data.experienceYears,
        };

        setLoading(true);

        await toast.promise(updateProfile(payload), {
            loading: "Saving...",
            success: "Profile updated!",
            error: "Failed to update profile",
        });

        setLoading(false);
    };

    return (
        <div className="flex flex-1 flex-col">
            <SiteHeader title="Profile Information" />
            <main className="max-w-3xl">
                {/* HEADER */}
                <div className="flex flex-col px-4 py-3">
                    <h1 className="text-2xl font-bold">Edit Profile</h1>
                    <span className="text-sm text-muted-foreground mt-1">
                        Enter the required information to update your profile.
                        You can change it anytime you want.
                    </span>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 px-4 py-3"
                >
                    {/* Bio */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            className="h-32 placeholder:text-muted-foreground border border-muted-foreground/25"
                            placeholder="Tell people more about yourself"
                        />
                    </div>

                    {/* Role */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                            id="role"
                            name="role"
                            className="placeholder:text-muted-foreground border border-muted-foreground/25"
                            placeholder="Enter your role"
                        />
                    </div>

                    {/* Experience */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="experienceYears">
                            Experience Years
                        </Label>
                        <Input
                            type="number"
                            id="experienceYears"
                            name="experienceYears"
                            className="placeholder:text-muted-foreground border border-muted-foreground/25"
                            placeholder="Enter your experience years"
                        />
                    </div>

                    {/* Skills */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="skills">Skills</Label>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <Input
                                    id="skills"
                                    className="placeholder:text-muted-foreground border border-muted-foreground/25"
                                    placeholder="Enter a skill and press Enter"
                                    value={skillInput}
                                    onChange={(e) =>
                                        setSkillInput(e.target.value)
                                    }
                                    onKeyPress={handleKeyPress}
                                />
                                <Button
                                    type="button"
                                    onClick={addSkill}
                                    variant="secondary"
                                    disabled={loading || !skillInput.trim()}
                                >
                                    Add
                                </Button>
                            </div>
                            {skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {skills.map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            {skill}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-4 w-4 p-0 hover:bg-transparent"
                                                onClick={() =>
                                                    removeSkill(skill)
                                                }
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Available for hire */}
                    <div className="flex flex-row items-center justify-between gap-2">
                        <Label htmlFor="isAvailableForHire">
                            Available for Hire
                        </Label>
                        <Checkbox
                            id="isAvailableForHire"
                            checked={isAvailableForHire}
                            onCheckedChange={(checked) =>
                                setIsAvailableForHire(
                                    checked === "indeterminate"
                                        ? false
                                        : checked
                                )
                            }
                            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary"
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="mt-10">
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </main>
        </div>
    );
};

export default EditProfile;
