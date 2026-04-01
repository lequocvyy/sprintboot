import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import QueryProvider from "@/app/providers/QueryProvider";
import { router } from "@/app/router";
import "./index.css";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </>
    </QueryProvider>
  </React.StrictMode>
);