import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-primary" />
        </div>
    );
};

export default Loader;
