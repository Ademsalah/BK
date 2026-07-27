"use client";

import React from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GluestackUIProvider mode="dark">{children}</GluestackUIProvider>;
}
