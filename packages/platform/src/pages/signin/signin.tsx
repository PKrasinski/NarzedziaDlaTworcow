"use client";

import SignInForm from "./form";
import { Header } from "./header";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-landing relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="lg:pt-2">
          <Header />
        </div>
        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 pb-12 flex items-center justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="card-modern p-8 sm:p-10">
              <SignInForm />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
