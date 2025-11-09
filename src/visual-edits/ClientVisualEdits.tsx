"use client";

import dynamic from "next/dynamic";
import React from "react";

const VisualEditsMessenger = dynamic(
  () => import("./VisualEditsMessenger"),
  { ssr: false }
);

export default function ClientVisualEdits() {
  return <VisualEditsMessenger />;
}
