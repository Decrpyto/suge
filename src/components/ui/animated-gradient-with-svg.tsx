"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useDimensions } from "@/hooks/use-debounced-dimensions";

interface AnimatedGradientProps {
    colors: string[];
    speed?: number;
    blur?: "light" | "medium" | "heavy";
}

const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
    colors,
    speed = 5,
    blur = "light",
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dimensions = useDimensions(containerRef);

    const [randomValues, setRandomValues] = useState<
        {
            top: number;
            left: number;
            tx1: number;
            ty1: number;
            tx2: number;
            ty2: number;
            tx3: number;
            ty3: number;
            tx4: number;
            ty4: number;
            widthMultiplier: number;
            heightMultiplier: number;
        }[]
    >([]);

    useEffect(() => {
        // Generate random values only on client
        setRandomValues(
            colors.map(() => ({
                top: Math.random() * 50,
                left: Math.random() * 50,
                tx1: Math.random() - 0.5,
                ty1: Math.random() - 0.5,
                tx2: Math.random() - 0.5,
                ty2: Math.random() - 0.5,
                tx3: Math.random() - 0.5,
                ty3: Math.random() - 0.5,
                tx4: Math.random() - 0.5,
                ty4: Math.random() - 0.5,
                widthMultiplier: randomInt(0.5, 1.5),
                heightMultiplier: randomInt(0.5, 1.5),
            }))
        );
    }, [colors]);

    const circleSize = useMemo(() => {
        if (dimensions.width === 0 && dimensions.height === 0) return 400;
        return Math.max(dimensions.width, dimensions.height);
    }, [dimensions.width, dimensions.height]);

    const blurClass =
        blur === "light"
            ? "blur-2xl"
            : blur === "medium"
            ? "blur-3xl"
            : "blur-[100px]";

    // Avoid rendering random shapes until client-side random values are ready
    if (randomValues.length === 0) return null;

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden">
            <div className={cn("absolute inset-0", blurClass)}>
                {colors.map((color, index) => {
                    const r = randomValues[index];
                    if (!r) return null;

                    return (
                        <svg
                            key={index}
                            className="absolute animate-background-gradient"
                            style={
                                {
                                    top: `${r.top}%`,
                                    left: `${r.left}%`,
                                    "--background-gradient-speed": `${
                                        1 / speed
                                    }s`,
                                    "--tx-1": r.tx1,
                                    "--ty-1": r.ty1,
                                    "--tx-2": r.tx2,
                                    "--ty-2": r.ty2,
                                    "--tx-3": r.tx3,
                                    "--ty-3": r.ty3,
                                    "--tx-4": r.tx4,
                                    "--ty-4": r.ty4,
                                } as React.CSSProperties
                            }
                            width={circleSize * r.widthMultiplier}
                            height={circleSize * r.heightMultiplier}
                            viewBox="0 0 100 100"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="50"
                                fill={color}
                                className="opacity-30 dark:opacity-[0.15]"
                            />
                        </svg>
                    );
                })}
            </div>
        </div>
    );
};
