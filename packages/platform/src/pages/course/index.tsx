"use client";

import { StrategyAgentServiceOrderForm } from "@/components/course-order-form";
import { useDesignSystem } from "design-system";
import {
  ArrowRight,
  Brain,
  CheckCircle,
  Lightbulb,
  MessageSquare,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CoursePage() {
  const { Button } = useDesignSystem();
  const navigate = useNavigate();
  const [showOrderForm, setShowOrderForm] = useState(false);

  const handlePurchase = () => {
    setShowOrderForm(true);
  };

  const handleOrderComplete = () => {
    navigate("/");
  };

  const handleBack = () => {
    setShowOrderForm(false);
  };

  if (showOrderForm) {
    return <StrategyAgentServiceOrderForm onComplete={handleOrderComplete} />;
  }

  return (
    <div className={`min-h-screen `}>
      {/* Section 1: Strategy Problem */}
      <section className="relative overflow-hidden px-4 py-12 md:py-32 mt-12 md:mt-5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 order-1 max-w-lg lg:max-w-none mx-auto">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Brakuje Ci{" "}
                  <span className="text-blue-600">spójnej strategii</span>?
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
                  Nie jesteś sam.
                </h2>
                <p className="text-xl text-gray-600 font-medium">
                  Widzimy, że korzystasz z darmowej wersji – super, że tu
                  jesteś!
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Ale jeśli czujesz, że Twoje treści są przypadkowe, niespójne i
                  nie wiesz, co nagrywać… to właśnie tutaj zaczyna się prawdziwa
                  zmiana.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                  Zamiast zgadywać – zbuduj strategię, która działa. Dla Ciebie,
                  Twojej marki i Twojej widowni.
                </p>
              </div>
            </div>

            <div className="flex items-center order-2 justify-center">
              <div className="w-full max-w-md mx-auto h-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 transform rotate-1">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Co daje pełna wersja?
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    <span className="text-gray-700">
                      Pomaga zdefiniować, dla kogo tworzysz i po co
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    <span className="text-gray-700">
                      Ułatwia podejmowanie decyzji co do treści
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    <span className="text-gray-700">
                      Działa jak fundament do viralowych pomysłów
                    </span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    → To nie kurs o kontencie. To Twoja własna strategia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: AI Assistant */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-1 lg:order-2 max-w-lg lg:max-w-none mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                AI, które nie tworzy za Ciebie – tylko{" "}
                <span className="text-purple-600">z Tobą</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                W pełnej wersji kursu masz dostęp do agenta AI, który:
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600 mt-1" />
                  <span className="text-gray-700">
                    Zada Ci odpowiednie pytania,
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-600 mt-1" />
                  <span className="text-gray-700">
                    Podsumuje to, co chcesz powiedzieć,
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-green-600 mt-1" />
                  <span className="text-gray-700">
                    Zbuduje na tej podstawie Twój styl, voice i tone,
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mt-1" />
                  <span className="text-gray-700">
                    Pomoże generować pomysły, które naprawdę rezonują z Twoją
                    publicznością.
                  </span>
                </div>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed font-medium">
                Zamiast scrollować TikToka po inspirację, masz wreszcie
                narzędzie, które tworzy razem z Tobą.
              </p>
            </div>

            <div className="order-2 lg:order-1">
              <div className="w-full max-w-md mx-auto h-80 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl border border-gray-200 p-6 transform -rotate-2">
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    AI Agent w akcji
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border-l-4 border-blue-400">
                    <div className="text-xs font-semibold text-blue-600 mb-1">
                      PYTANIE
                    </div>
                    <div className="text-sm text-gray-700">
                      Kim są Twoi idealni odbiorcy?
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-purple-400">
                    <div className="text-xs font-semibold text-purple-600 mb-1">
                      ANALIZA
                    </div>
                    <div className="text-sm text-gray-700">
                      Twój ton: inspirujący + praktyczny
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-green-400">
                    <div className="text-xs font-semibold text-green-600 mb-1">
                      POMYSŁ
                    </div>
                    <div className="text-sm text-gray-700">
                      5 sposobów na efektywne...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Purchase CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Rozpocznij pełną wersję za{" "}
              <span className="text-yellow-300">100 zł</span>
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
              Odblokuj kurs i agenta AI w jednym kliknięciu.
            </p>
            <p className="text-lg text-blue-100 leading-relaxed max-w-3xl mx-auto">
              To jednorazowa płatność, która pozwoli Ci zbudować strategię,
              przetestować pomysły i stworzyć serię treści gotowych do
              publikacji. Bez stresu, bez spinu – z pełnym wsparciem.
            </p>

            <Button
              onClick={handlePurchase}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Przejdź do zamówienia
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <div className="flex justify-center items-center gap-2 text-sm text-blue-200">
              <span>🔒 Bezpieczne płatności przez Stripe</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
