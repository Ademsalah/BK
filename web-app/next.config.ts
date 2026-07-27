import type { NextConfig } from "next";
import { withGluestackUI } from "@gluestack/ui-next-adapter";

const nextConfig: NextConfig = {
  // output: "export",
  trailingSlash: true,

  transpilePackages: [
    "@gluestack-ui/core",
    "@gluestack-ui/utils",
    "@legendapp/motion",
  ],
};

export default withGluestackUI(nextConfig);
