import {InfoIcon} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import Link from "next/link";
import React from "react";

interface BetaWarningProps {
    isBeta: boolean;
}

function BetaWarning({isBeta}: BetaWarningProps) {

    const BetaAlert = () => (<Alert className="bg-neutral-200 mt-20 mb-3 border-neutral-500">
            <InfoIcon/>
            <AlertTitle>Beta Website</AlertTitle>
            <AlertDescription>This is a beta version of our site. If you are looking for the main one, go to <Link
                href="https://thephotostore.com" className="text-blue-600 hover:text-blue-300">this
                website</Link></AlertDescription>
        </Alert>);

    return isBeta ? <BetaAlert/> : <p>nuh uh</p>;
}

export default BetaWarning;