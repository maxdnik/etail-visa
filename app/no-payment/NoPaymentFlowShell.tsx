"use client";

import { useEffect, type ReactNode } from "react";

const LABEL_REPLACEMENTS: Record<string, string> = {
  "Review & Pay": "Review & Submit",
  "Revisión y Pago": "Revisión y Envío",
};

function replacePaymentLabels(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const value = node.nodeValue?.trim();
    if (value && LABEL_REPLACEMENTS[value]) {
      node.nodeValue = node.nodeValue!.replace(value, LABEL_REPLACEMENTS[value]);
    }
    node = walker.nextNode();
  }
}

export default function NoPaymentFlowShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.cookie = "eta_flow=no-payment; Path=/; SameSite=Lax";
    replacePaymentLabels(document.body);

    const observer = new MutationObserver(() => replacePaymentLabels(document.body));
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return children;
}
