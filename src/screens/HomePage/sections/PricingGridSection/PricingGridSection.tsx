import React from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../../../components/ui/toggle-group";

export const PricingGridSection = (): JSX.Element => {
  // Pricing plan data
  const pricingPlans = [
    {
      title: "Title",
      price: "50",
      features: [
        "List item",
        "List item",
        "List item",
        "List item",
        "List item",
      ],
      featured: false,
    },
    {
      title: "Title",
      price: "50",
      features: [
        "List item",
        "List item",
        "List item",
        "List item",
        "List item",
      ],
      featured: true,
    },
    {
      title: "Title",
      price: "50",
      features: [
        "List item",
        "List item",
        "List item",
        "List item",
        "List item",
      ],
      featured: false,
    },
  ];

  return (
    <section className="flex flex-col items-center gap-12 p-16 w-full">
      <ToggleGroup
        type="single"
        defaultValue="monthly"
        className="flex flex-wrap items-start gap-2"
      >
        <ToggleGroupItem value="monthly" className="bg-neutral-100 rounded-lg">
          <span className="font-single-line-body-base text-[#1e1e1e]">
            Monthly
          </span>
        </ToggleGroupItem>
        <ToggleGroupItem value="yearly" className="rounded-lg">
          <span className="font-single-line-body-base text-[#b3b3b3]">
            Yearly
          </span>
        </ToggleGroupItem>
        <ToggleGroupItem value="link" className="rounded-lg">
          <span className="font-single-line-body-base text-[#b3b3b3]">
            Link
          </span>
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="flex flex-wrap gap-16 w-full">
        {pricingPlans.map((plan, index) => (
          <Card
            key={index}
            className={`flex flex-col min-w-[300px] flex-1 border ${
              plan.featured
                ? "bg-[#2c2c2c] border-[#2c2c2c]"
                : "bg-white border-[#d9d9d9]"
            } rounded-lg overflow-hidden`}
          >
            <CardHeader className="flex flex-col items-center p-0 pt-8 px-8">
              <CardTitle
                className={`w-full text-center font-heading ${
                  plan.featured ? "text-neutral-100" : "text-[#1e1e1e]"
                }`}
              >
                {plan.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 p-8 pt-4">
              <div className="inline-flex items-end justify-center">
                <div className="inline-flex items-start">
                  <span
                    className={`[font-family:'Inter',Helvetica] font-bold text-2xl tracking-[-0.48px] leading-6 ${
                      plan.featured ? "text-neutral-100" : "text-[#1e1e1e]"
                    }`}
                  >
                    $
                  </span>
                  <span
                    className={`[font-family:'Inter',Helvetica] font-bold text-5xl tracking-[-0.96px] leading-[48px] ${
                      plan.featured ? "text-neutral-100" : "text-[#1e1e1e]"
                    }`}
                  >
                    {plan.price}
                  </span>
                </div>
                <span
                  className={`[font-family:'Inter',Helvetica] font-normal text-sm tracking-[0] leading-[25.2px] ${
                    plan.featured ? "text-neutral-100" : "text-[#1e1e1e]"
                  }`}
                >
                  / mo
                </span>
              </div>

              <div className="flex flex-col items-start gap-3 w-full">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="w-full">
                    <span
                      className={`font-body-base ${
                        plan.featured ? "text-neutral-100" : "text-[#757575]"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Button
                className={`w-full ${
                  plan.featured
                    ? "bg-[#e3e3e3] text-[#1e1e1e] border-[#767676]"
                    : "bg-[#2c2c2c] text-neutral-100"
                }`}
              >
                Button
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
