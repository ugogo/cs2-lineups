"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      // Dev HMR and a document-caching SW fight each other and cause reload loops.
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          void registration.unregister();
        }
      });
      return;
    }

    void navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration can fail in unsupported contexts; ignore silently.
    });
  }, []);

  return null;
}
