import React from "react";
import { pricingPlans } from "../../pricing";
import { Check } from "lucide-react";

function PricingSection({ openSignUp }) {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Simple and Flexible Pricing
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Choose a plan that fits your needs. Pay only for what you use.
                </p>
            </div>

            <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-3">
                {Object.values(pricingPlans).map((plan) => (
                    <div
                        key={plan.id}
                        className={`flex flex-col rounded-lg overflow-hidden bg-white shadow-sm
              ${plan.highlighted
                                ? "border-4 border-indigo-600"
                                : "border border-gray-200"
                            }`}
                    >
                        {/* Header */}
                        <div
                            className={`px-6 py-8 ${plan.highlighted
                                ? "bg-gradient-to-br from-indigo-50 to-white"
                                : "bg-white"
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    {plan.name}
                                </h3>

                                {plan.highlighted && (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        Most Popular
                                    </span>
                                )}
                            </div>

                            <p className="mt-4 text-sm text-gray-500">
                                {plan.description}
                            </p>

                            <p className="mt-8 text-4xl font-extrabold text-gray-900">
                                {plan.price}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50">
                            <ul className="space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start">
                                        <Check className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                                        <p className="ml-3 text-gray-700">{feature}</p>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                className={`mt-8 w-full px-4 py-2 rounded-md font-medium
                  ${plan.highlighted
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white text-indigo-600 border border-indigo-600"
                                    }`}
                                onClick={() => openSignUp()}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default PricingSection;
