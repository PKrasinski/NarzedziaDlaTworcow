"use client";

import { useQuery } from "@/arc-provider";
import { useDesignSystem } from "design-system";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccessPage() {
  const { Button } = useDesignSystem();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const returnUrl = searchParams.get("returnUrl");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch order data using the session ID
  const [order] = useQuery(
    (q) => q.orders.findOne({ sessionId: sessionId || "" }),
    [sessionId],
    "order-data"
  );

  useEffect(() => {
    if (order) {
      if (order.status === "paid" || order.status === "fulfilled") {
        setStatus("success");
      } else if (order.status === "failed") {
        setStatus("error");
        setError(order.errorReason || "Płatność nie powiodła się");
      }
    }
  }, [order]);

  const handleReturnToApp = () => {
    navigate(returnUrl || "/");
  };

  const handleRetryPayment = () => {
    navigate(returnUrl || "/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center pb-6">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl font-light text-gray-900">
                Przetwarzanie płatności...
              </CardTitle>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-light text-gray-900">
                Dziękujemy za zakup!
              </CardTitle>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-light text-gray-900">
                Wystąpił problem
              </CardTitle>
            </>
          )}
        </CardHeader>

        <CardContent className="text-center space-y-6">
          {status === "loading" && (
            <p className="text-gray-600">Trwa weryfikacja płatności...</p>
          )}

          {status === "success" && (
            <>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Twoje zamówienie zostało pomyślnie zrealizowane!
                </p>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Co teraz?
                  </h3>
                  <p className="text-sm text-green-700">
                    Możesz teraz wrócić do aplikacji i korzystać z zakupionych
                    funkcji.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleReturnToApp}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Przejdź do aplikacji
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="space-y-3">
                <Button
                  onClick={handleRetryPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Spróbuj ponownie
                </Button>
                <Button
                  onClick={handleReturnToApp}
                  variant="outline"
                  className="w-full"
                >
                  Powrót do aplikacji
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
