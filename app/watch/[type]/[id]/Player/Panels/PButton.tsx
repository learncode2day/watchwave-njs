import { cn } from "@/app/lib/utils";
import { Button } from "@nextui-org/react";
import React from "react";
import { IoArrowForward, IoGlobe } from "react-icons/io5";

interface LinkProps {
  action: () => void;
  children: React.ReactNode;
  end?: "arrow" | "none" | React.ReactNode;
  start?: "globe" | "none" | React.ReactNode;
  className?: string;
  primary?: boolean;
}

const PButton = ({
  action,
  children,
  end,
  start,
  className,
  primary,
}: LinkProps) => {
  const nstart =
    start === "globe" ? (
      <IoGlobe className="text-xl" />
    ) : start === "none" ? null : (
      start
    );
  const nend =
    end === "arrow" ? (
      <IoArrowForward className="" />
    ) : end === "none" ? null : (
      end
    );

  return (
    <Button
      onClick={() => {
        action();
      }}
      variant="flat"
      color={primary ? "primary" : "default"}
      className={cn(
        "group w-full justify-between text-wrap text-left",
        className,
      )}
      endContent={nend}
      startContent={nstart}
    >
      {children}
    </Button>
  );
};

export default PButton;
