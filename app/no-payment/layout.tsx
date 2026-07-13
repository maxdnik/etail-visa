import type { ReactNode } from "react";
import NoPaymentFlowShell from "./NoPaymentFlowShell";

export default function NoPaymentLayout({ children }: { children: ReactNode }) {
  return <NoPaymentFlowShell>{children}</NoPaymentFlowShell>;
}
