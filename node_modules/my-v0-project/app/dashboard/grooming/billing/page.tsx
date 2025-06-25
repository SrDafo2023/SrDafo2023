"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckIcon, XIcon } from "lucide-react";
import { PaymentModal } from '@/components/billing/PaymentModal';

// Define the type for a plan
interface Plan {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  tag: string;
  tagColor: string;
  description: string;
  isCurrent: boolean;
  features: { text: string; included: boolean }[];
  buttonText: string;
}

export default function BillingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const plans: Plan[] = [
    {
      name: "Esencial",
      priceMonthly: 0,
      priceYearly: 0,
      tag: "GRATIS",
      tagColor: "bg-yellow-500 text-black",
      description: "Ideal para empezar y conocer la plataforma.",
      isCurrent: true,
      features: [
        { text: "Publicación de servicios de Grooming", included: true },
        { text: "Gestión de citas y horarios", included: true },
        { text: "Comisión del 6% por venta de servicios", included: true },
        { text: "Visibilidad estándar en búsquedas", included: true },
        { text: "Perfil de negocio personalizable", included: false },
        { text: "Acceso a analíticas avanzadas", included: false },
        { text: "Soporte prioritario", included: false },
      ],
      buttonText: "Plan Actual",
    },
    {
      name: "Profesional",
      priceMonthly: 5000,
      priceYearly: 60000,
      tag: "PREMIUM",
      tagColor: "bg-blue-500 text-white",
      description: "Para negocios que buscan crecer y maximizar su alcance.",
      isCurrent: false,
      features: [
        { text: "Publicación de servicios de Grooming", included: true },
        { text: "Gestión de citas y horarios", included: true },
        { text: "Cero comisiones por ventas", included: true },
        { text: "Visibilidad destacada en búsquedas", included: true },
        { text: "Perfil de negocio completamente personalizable", included: true },
        { text: "Acceso a analíticas avanzadas de rendimiento", included: true },
        { text: "Soporte prioritario 24/7", included: true },
      ],
      buttonText: "Elegir Plan Profesional",
    },
  ];

  const handleChoosePlan = (plan: Plan) => {
    if (!plan.isCurrent) {
      setSelectedPlan(plan);
      setPaymentModalOpen(true);
    }
  };

  const getPlanPrice = (plan: Plan) => {
    return isYearly ? plan.priceYearly.toLocaleString('es-CL') : plan.priceMonthly.toLocaleString('es-CL');
  };

  return (
    <>
      <div className="p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Facturación y Suscripciones</h1>
          <p className="text-muted-foreground mt-2">
            Elige el plan que mejor se adapte a tu negocio. Pasa a Profesional para eliminar las comisiones y potenciar tu visibilidad.
          </p>
        </header>

        <div className="flex items-center justify-center space-x-4 mb-8">
          <span>Mensual</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className="flex items-center">
            Anual
            <span className="ml-2 inline-block bg-green-200 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Ahorra 16.7%
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.name === 'Profesional' ? 'border-primary' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${plan.tagColor}`}>
                    {plan.tag}
                  </span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${getPlanPrice(plan)}
                  </span>
                  <span className="text-muted-foreground">/{isYearly ? 'año' : 'mes'}</span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Características:</h3>
                  {plan.features.map((feature) => (
                    <div key={feature.text} className="flex items-center">
                      {feature.included ? <CheckIcon className="h-5 w-5 text-green-500 mr-2" /> : <XIcon className="h-5 w-5 text-red-500 mr-2" />}
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={plan.isCurrent} onClick={() => handleChoosePlan(plan)}>
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {selectedPlan && (
        <PaymentModal 
          isOpen={isPaymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          planName={selectedPlan.name}
          planPrice={getPlanPrice(selectedPlan)}
          planType={isYearly ? 'yearly' : 'monthly'}
        />
      )}
    </>
  );
} 