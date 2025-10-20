import { SugeLogo } from "./suge-logo";

export function Footer() {
    return (
        <footer className="bg-background border-t border-border/20 py-12 px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <SugeLogo className="mb-4" />
                        <p className="text-muted-foreground mb-4 max-w-md">
                            Empowering freelancers and small teams with modern
                            tools for managing proposals, clients, and payments.
                        </p>
                        <p className="text-sm text-muted-foreground italic">
                            &quot;Manage your freelance business with ease&quot;
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">
                            Product
                        </h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Security
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Integrations
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">
                            Company
                        </h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border/20 mt-8 pt-8 text-center text-muted-foreground">
                    <p>&copy; 2025 Suge. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
