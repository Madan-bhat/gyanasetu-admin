"use client";
import Image from "next/image";
import LoginPage from "./Login/page";
import Dashboard from "./Dashboard/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
    {
      token ? (
       return <Dashboard />
      ) : (
       return <LoginPage />
      )
    }
}
