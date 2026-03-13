"use client";

import type { ReactNode } from "react";

interface StateRendererProps {
  isInitial?: boolean;
  isLoading: boolean;
  hasError: boolean;
  hasData: boolean;
  initialUI?: ReactNode;
  loadingUI: ReactNode;
  errorUI: ReactNode;
  noDataUI: ReactNode;
  dataUI: ReactNode;
}

export function StateRenderer({
  isInitial,
  isLoading,
  hasError,
  hasData,
  initialUI,
  loadingUI,
  errorUI,
  noDataUI,
  dataUI,
}: StateRendererProps) {
  if (isInitial) {
    return <>{initialUI}</>;
  }

  if (isLoading) {
    return <>{loadingUI}</>;
  }

  if (hasError) {
    return <>{errorUI}</>;
  }

  if (!hasData) {
    return <>{noDataUI}</>;
  }

  return <>{dataUI}</>;
}


