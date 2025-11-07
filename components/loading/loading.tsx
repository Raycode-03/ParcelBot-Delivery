import React, { useState } from "react";
import Image from "next/image";

export default function IsLoading({ loadstate }: { loadstate: boolean }) {
    const [loading] = useState(loadstate);
    
    return (
        <>
            {loading && (
                <div className="loading-overlay">
                    <div className="mr-2 animate-spin">
           
                    </div>
                </div>
            )}
        </>
    );
}