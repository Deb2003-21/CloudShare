// pricing.js
export const pricingPlans = {
    starter: {
        id: "starter",
        name: "Starter",
        description: "Perfect for individuals getting started",
        price: "₹0",
        highlighted: false,
        features: [
            "Basic access",
            "Community support",
            "Limited credits",
        ],
        cta: "Get Started",
    },

    pro: {
        id: "premium",
        name: "Pro",
        description: "Best for growing developers",
        price: 499,
        highlighted: true,
        credits: 500,
        features: [
            "Everything in Starter",
            "Priority support",
            "+500 credits",
            "Advanced features",
        ],
        cta: "Upgrade to Pro",
    },

    enterprise: {
        id: "ULTIMATE",
        name: "Enterprise",
        description: "For teams and businesses",
        price: 4999,
        highlighted: false,
        credits: 5000,
        features: [
            "+5000 credits",
            "Dedicated support",
            "Custom integrations",
        ],
        cta: "Upgrade to Enterprise",
    },
};
