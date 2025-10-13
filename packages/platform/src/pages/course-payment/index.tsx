"use client";

import { StrategyAgentServiceOrderForm } from "@/components/course-order-form";
import { useDesignSystem } from "design-system";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CoursePaymentPage() {
  const { Button } = useDesignSystem();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/choose-plan");
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót do wyboru planu
        </Button>

        <StrategyAgentServiceOrderForm />
      </div>
    </div>
  );
}
