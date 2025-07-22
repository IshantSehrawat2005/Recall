"use client";
import { Button } from "./ui/button";
import { Github, LogIn, User, Sparkles } from "lucide-react";
import Image from "next/image";

export function OAuthButtons({ onProvider }: { onProvider?: (provider: string) => void }) {
  return (
    <div className="flex flex-col gap-2 w-full mt-2">
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center gap-2 justify-center"
        onClick={() => onProvider?.("google")}
      >
        <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center gap-2 justify-center"
        onClick={() => onProvider?.("github")}
      >
        <Image src="/github.svg" alt="GitHub" width={20} height={20} className="mr-2" />
        Continue with GitHub
      </Button>
    </div>
  );
}
