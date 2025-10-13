import { CreditPackage } from "@narzedziadlatworcow.pl/context/browser";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";
import { useDesignSystem } from "design-system";
import { ArrowLeft, Coins, CreditCard } from "lucide-react";
import { useState } from "react";
import { useQuery } from "../arc-provider";
import { CreditOrderForm } from "../components/credit-order-form";

const BuyCreditsPage = () => {
  const { Button } = useDesignSystem();
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(
    null
  );

  // Get credit packages from the ordering system
  const [creditPackages] = useQuery((q) => q.creditsPackages.find({}));

  const handlePackageSelect = (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
  };

  const handleBackToSelection = () => {
    setSelectedPackage(null);
  };

  // Helper function to format price from groszy to PLN
  const formatPrice = (price: number) => {
    return (price / 100).toFixed(0);
  };

  // Find the most popular package (middle one)
  const popularPackageId = "credits-standard";

  // If package is selected, show the order form
  if (selectedPackage) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={handleBackToSelection}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do wyboru pakietu
          </Button>

          <CreditOrderForm
            selectedPackage={selectedPackage}
            onBack={handleBackToSelection}
          />
        </div>
      </div>
    );
  }

  // Package selection view
  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-white shadow-lg rounded-full text-sm font-medium mb-6 border border-gray-100">
            <Coins className="w-4 h-4 mr-2 text-blue-500" />
            Kup kredyty
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Wybierz pakiet kredytów
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Kup kredyty i generuj scenariusze oraz edytuj je za pomocą AI
          </p>
        </div>

        {/* Credit Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {creditPackages?.map((pkg) => {
            const isPopular = pkg._id.includes(popularPackageId);
            const priceInPLN = formatPrice(pkg.price);

            return (
              <Card
                key={pkg._id}
                className={`border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer bg-white relative ${
                  isPopular ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handlePackageSelect(pkg)}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Najpopularniejszy
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      isPopular ? "bg-blue-500" : "bg-gray-500"
                    }`}
                  >
                    <Coins className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.metadata.credits} kredytów
                  </CardTitle>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {priceInPLN}zł
                  </div>
                  <p className="text-gray-600 text-sm">{pkg.description}</p>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">
                      {pkg.metadata.credits} kredytów
                    </div>
                    <div className="text-sm text-gray-600">
                      ≈{" "}
                      {(parseFloat(priceInPLN) / pkg.metadata.credits).toFixed(
                        2
                      )}
                      zł za kredyt
                    </div>
                  </div>

                  <Button
                    onClick={() => handlePackageSelect(pkg)}
                    className={`w-full border-0 shadow-lg hover:shadow-xl transition-all duration-200 py-3 ${
                      isPopular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-600 hover:bg-gray-700 text-white"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Wybierz pakiet
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="text-center text-gray-600">
          <p className="mb-2">
            💡 Kredyty nie wygasają i można je wykorzystać w dowolnym momencie
          </p>
          <p className="text-sm">
            🔒 Bezpieczne płatności obsługiwane przez Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyCreditsPage;
