"use client";
import React, { useState, useEffect, useRef } from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { SessionProvider } from "next-auth/react";
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf0x1RHxbf1x1ZF1MZVxbRXRPIiBoS35Rc0ViWX5ccHFVR2RaWUB0');

import "../styles/globals.css"; // Assuming you have global styles
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuth');
    setIsAuth(authStatus === 'true'); // Assume `isAuth` is stored as a string, "true" or "false"
  }, []);

  useEffect(() => {
    if (isAuth === false) {
      router.push('/');
    }
  }, [isAuth, router]);

  if (isAuth === null) {
    // Optionally, render a loading state until authentication is determined
    return <div></div>;
  }
  

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <SessionProvider>{children}</SessionProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
