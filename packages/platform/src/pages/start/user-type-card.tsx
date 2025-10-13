"use client";

import type React from "react";

import {
  Card,
  CardContent,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";

interface UserTypeCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

export function UserTypeCard({
  id: _id,
  title,
  description,
  icon: Icon,
  color,
  isSelected,
  onClick,
}: UserTypeCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100";
      case "pink":
        return "border-pink-500 bg-pink-50 text-pink-700 hover:bg-pink-100";
      case "yellow":
        return "border-yellow-500 bg-yellow-50 text-yellow-700 hover:bg-yellow-100";
      default:
        return "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 border-2 backdrop-blur-md bg-white/20 ${
        isSelected
          ? getColorClasses(color)
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-8 flex-shrink-0">
            <Icon
              className={`w-8 h-8 ${
                isSelected ? `text-${color}-500` : "text-gray-400"
              }`}
            />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}
