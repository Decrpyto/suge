"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Check, ArrowRight } from "lucide-react";

const pricingPlans = [
    {
        name: "Starter",
        price: "$19",
        period: "/month",
        description: "Perfect for freelancers just starting out",
        features: [
            "Up to 10 clients",
            "50 proposals/month",
            "Basic invoicing",
            "Email support",
            "Payment tracking",
        ],
        popular: false,
    },
    {
        name: "Professional",
        price: "$49",
        period: "/month",
        description: "Best for growing freelance businesses",
        features: [
            "Unlimited clients",
            "Unlimited proposals",
            "Advanced invoicing",
            "Priority support",
            "Time tracking",
            "Custom branding",
            "API access",
        ],
        popular: true,
    },
    {
        name: "Agency",
        price: "Custom",
        period: "",
        description: "For teams and agencies",
        features: [
            "Unlimited everything",
            "Team management",
            "Advanced reporting",
            "24/7 dedicated support",
            "Custom integrations",
            "White-label options",
            "SLA guarantee",
            "On-premise deployment",
        ],
        popular: false,
    },
];

export function PricingSection() {
    return (
        <section id="pricing" className="py-20 px-4 bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        className="text-4xl font-bold text-foreground mb-4"
                        style={{ fontFamily: "var(--font-playfair)" }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Simple, Transparent Pricing
                    </motion.h2>
                    <motion.p
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Choose the perfect plan for your freelance business. No
                        hidden fees, no surprises.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pricingPlans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            className={`relative bg-card border rounded-lg p-8 ${
                                plan.popular
                                    ? "border-primary/30 bg-primary/5"
                                    : "border-border/20 bg-background/50"
                            }`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                    {plan.name}
                                </h3>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-foreground">
                                        {plan.price}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {plan.period}
                                    </span>
                                </div>
                                <p className="text-muted-foreground">
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li
                                        key={featureIndex}
                                        className="flex items-center text-muted-foreground"
                                    >
                                        <Check className="h-5 w-5 text-foreground mr-3 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full ${
                                    plan.popular
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "bg-transparent border border-border text-foreground hover:bg-foreground/10"
                                } group`}
                                size="lg"
                            >
                                {plan.name === "Agency"
                                    ? "Contact Sales"
                                    : "Get Started"}
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <p className="text-gray-400 mb-4">
                        All plans include 14-day free trial • No credit card
                        required
                    </p>
                    <p className="text-sm text-gray-500">
                        Need a custom solution?{" "}
                        <a href="#" className="text-white hover:underline">
                            Contact our sales team
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
