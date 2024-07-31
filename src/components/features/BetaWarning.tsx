import { InfoIcon, SeparatorHorizontal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import React from "react";
import { DeviceInfo } from "@/DeviceInfo";
import { Separator } from "@/components/ui/separator";

interface BetaWarningProps {
  isBeta: boolean;
}

function BetaWarning({ isBeta }: BetaWarningProps) {
  const BetaAlert = () => (
    <Alert className="bg-neutral-200 dark:bg-neutral-800 mt-20 mb-3 border-neutral-500">
      <InfoIcon />
      <AlertTitle>Beta Website</AlertTitle>
      <AlertDescription>
        This is a beta version of our site. If you are looking for the main one,
        go to{" "}
        <Link
          href="https://thephotostore.com"
          className="text-blue-600 hover:text-blue-300"
        >
          this website
        </Link>
        <Separator orientation="horizontal" className="my-4 bg-black" />
        <DeviceInfo />
      </AlertDescription>
    </Alert>
  );

  return isBeta ? <BetaAlert /> : <p>nuh uh</p>;
}

export default BetaWarning;
