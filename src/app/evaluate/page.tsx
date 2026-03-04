"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EvaluationClient from "./EvaluationClient";

function EvaluationParamsLoader() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") ?? undefined;
  const source = searchParams.get("source") ?? undefined;

  return <EvaluationClient id={id} source={source} />;
}

export default function EvaluationPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 20, textAlign: "center" }}>
          Carregando dados da avaliação...
        </div>
      }
    >
      <EvaluationParamsLoader />
    </Suspense>
  );
}
