"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Upload, ShieldCheck, Search, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Plan Intent", icon: Rocket, description: "Choose your business goals" },
  { id: 2, name: "Upload Data", icon: Upload, description: "Ingest content or knowledge" },
  { id: 3, name: "Platform Auth", icon: ShieldCheck, description: "Connect your accounts" },
  { id: 4, name: "Target Keywords", icon: Search, description: "Define your focus area" },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    intent: "",
    files: [],
    platform: "",
    keywords: "",
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length + 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-2xl mx-auto p-8 glass rounded-2xl border border-white/10 mt-20">
      {/* Progress Bar */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                  isActive ? "bg-primary text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "bg-secondary text-muted-foreground"
                )}
              >
                {isActive && currentStep > step.id ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span className={cn("text-xs mt-2 font-medium", isCurrent ? "text-primary" : "text-muted-foreground")}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[300px]"
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">What is your primary goal?</h2>
              <div className="grid grid-cols-2 gap-4">
                {['Content Gen', 'CS Chatbot', 'GEO Monitoring', 'Market Analysis'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFormData({ ...formData, intent: opt })}
                    className={cn(
                      "p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-left",
                      formData.intent === opt && "border-primary bg-primary/10"
                    )}
                  >
                    <div className="font-medium">{opt}</div>
                    <div className="text-sm text-muted-foreground">Short description for {opt}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Upload Knowledge Base</h2>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Drag and drop files or click to upload</p>
                <p className="text-xs text-muted-foreground/50 mt-2">Supports PDF, DOCX, TXT</p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Connect Platform</h2>
              <div className="space-y-3">
                {['WeChat', 'Alipay', 'Official Account'].map((plat) => (
                  <div key={plat} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <span>{plat}</span>
                    <button className="text-sm text-primary font-medium hover:underline">Connect</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Target Keywords</h2>
              <textarea
                placeholder="Enter keywords separated by commas..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-primary transition-colors"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">Xia uses these to focus AI generation and monitoring.</p>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center space-y-6 py-12">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Setup Complete!</h2>
              <p className="text-muted-foreground">Your tenant has been provisioned. Xia is warming up.</p>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {currentStep <= 4 && (
        <div className="flex justify-between mt-12">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-all"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </button>
          <button
            onClick={async () => {
              if (currentStep === 4) {
                // Final step: Register
                try {
                   await api.register({
                    companyName: "Demo Corp", // In real use, get from state
                    email: `demo_${Date.now()}@example.com`,
                    password: "password123"
                  });
                  nextStep();
                } catch (err) {
                  alert("Registration failed");
                }
              } else {
                nextStep();
              }
            }}
            className="flex items-center px-8 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            {currentStep === 4 ? 'Finish' : 'Next'} <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}

import { api } from "@/lib/api";
