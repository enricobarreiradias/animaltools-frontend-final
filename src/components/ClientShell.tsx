"use client";

import { Box } from "@mui/material";
import { usePathname } from "next/navigation";
import ThemeRegistry from "./ThemeRegistry";
import Sidebar from "./Sidebar";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/";

  return (
    <ThemeRegistry>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
        {!isLoginPage && <Sidebar />}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: isLoginPage ? 0 : 2,
            width: "100%",
            overflowX: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeRegistry>
  );
}
