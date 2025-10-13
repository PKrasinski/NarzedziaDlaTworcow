"use client";

import { useCommands, useQuery } from "@/arc-provider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";
import { useDesignSystem } from "design-system";
import { AlertCircle, CreditCard, Shield } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAccountWorkspaces } from "./account-workspace-provider";
import {
  InvoiceDataSection,
  type InvoiceDataSectionRef,
} from "./invoice-data-section";

interface StrategyAgentServiceOrderFormProps {}

export function StrategyAgentServiceOrderForm({}: StrategyAgentServiceOrderFormProps) {
  const { Button } = useDesignSystem();
  const { createPremiumOrderAndPayment } = useCommands();
  const invoiceRef = useRef<InvoiceDataSectionRef>(null);

  // Get user data for name
  const [userData] = useQuery(
    (q) => q.myUserAccount.findOne({}),
    [],
    "my-user"
  );

  const { currentAccount } = useAccountWorkspaces();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get strategy agent product from the ordering system
  const [premiums] = useQuery((q) => q.premium.find({}));
  const strategyAgentProduct = premiums?.[0];

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!userData?.nameAndSurname || !userData?.email) {
        setError("Nie udało się pobrać danych użytkownika.");
        return;
      }

      // Get invoice data using ref
      const invoiceFormData = invoiceRef.current?.getValues();
      if (!invoiceFormData || "error" in invoiceFormData) {
        setError("Nie udało się pobrać danych formularza.");
        return;
      }

      const result = await createPremiumOrderAndPayment({
        metadata: {
          accountWorkspaceId: currentAccount._id,
        },
        productId: strategyAgentProduct!._id,
        quantity: 1,
        customerInfo: {
          fullName: userData.nameAndSurname,
          email: userData.email,
        },
        invoiceData: invoiceFormData.invoiceData,
        saveForLater: invoiceFormData.shouldSaveForLater || false,
        returnUrl: "/strategy", // Return to current page after payment
      });

      if ("error" in result) {
        toast.error("Błąd", {
          description: "Wystąpił błąd podczas tworzenia zamówienia.",
        });
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = result.redirectUrl;
    } catch (error: any) {
      console.error("Payment process failed:", error);
      const errorMessage =
        error.message ||
        "Wystąpił błąd podczas przetwarzania płatności. Spróbuj ponownie.";

      toast.error("Błąd płatności", {
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!strategyAgentProduct) {
    return null;
  }

  const priceNetto = strategyAgentProduct?.price / 100; // Convert to PLN for display
  const vatAmount = Math.round(priceNetto * 0.23);
  const priceBrutto = priceNetto + vatAmount;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle
            className="text-3xl font-light text-gray-900 mb-4"
            style={{ fontFamily: "Mitr, sans-serif" }}
          >
            {strategyAgentProduct.name}
          </CardTitle>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {priceNetto.toFixed(0)} zł netto
            </div>
            <div className="text-gray-600">
              + 23% VAT = {priceBrutto.toFixed(0)} zł brutto
            </div>
            <div className="text-sm text-gray-500 mt-1">Jednorazowa usługa</div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Service benefits */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-500" />
              Co otrzymasz:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • Dostęp do pomocnika AI, który pomoże Ci zbudować strategię dla
                Twojej marki
              </li>
              <li>
                • Dostęp do kursu, który da Ci niezbędną wiedzę jak budować
                markę w internecie
              </li>
              <li>
                • Zbudujesz gotowe pomysły na scenariusze, które zaciekawią
                Twoją widownię
              </li>
              <li>
                • Otrzymasz 100 dodatkowych kredytów do generowania scenariuszy
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            {/* Invoice Data Section */}
            <InvoiceDataSection
              ref={invoiceRef}
              userName={userData?.nameAndSurname || ""}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="pt-6">
              <Button
                type="button"
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  "Przekierowanie do płatności..."
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Przejdź do płatności
                  </>
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <Shield className="w-4 h-4 mx-auto mb-2" />
              Bezpieczna płatność obsługiwana przez Stripe
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
