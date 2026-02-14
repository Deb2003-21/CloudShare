import React, { useContext, useEffect, useRef, useState } from "react";
import Dashboard_layout from "../layout/Dashboard_layout";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditsContext } from "../components/UserCreditsContext";
import axios from "axios";
import { ENDPOINTS } from "../endpoints";
import { AlertCircle, Check, Star, CreditCard } from "lucide-react";
import { pricingPlans } from "../pricing";

/* -------------------------------------------------- */

function Subscription() {
    const { getToken } = useAuth();
    const { credits, updateCredits } = useContext(UserCreditsContext);

    const razorpayScriptRef = useRef(null);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

    /* -------------------------------------------------- */
    /* Load Razorpay */
    /* -------------------------------------------------- */
    useEffect(() => {
        if (window.Razorpay) {
            setRazorpayLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => setRazorpayLoaded(true);

        script.onerror = () => {
            setMessage("Payment gateway failed to load.");
            setMessageType("error");
        };

        document.body.appendChild(script);
        razorpayScriptRef.current = script;

        return () => {
            if (razorpayScriptRef.current) {
                document.body.removeChild(razorpayScriptRef.current);
            }
        };
    }, []);

    /* -------------------------------------------------- */
    /* Fetch Credits */
    /* -------------------------------------------------- */
    useEffect(() => {
        fetchCredits();
    }, []);

    const fetchCredits = async () => {
        try {
            const token = await getToken();

            const res = await axios.get(ENDPOINTS.GET_CREDITS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            updateCredits(res.data.credits);
        } catch (err) {
            console.error(err);

            setMessage("Failed to load credits.");
            setMessageType("error");
        }
    };

    /* -------------------------------------------------- */
    /* Handle Purchase */
    /* -------------------------------------------------- */
    const handlePurchase = async (plan) => {
        if (!razorpayLoaded) {
            setMessage("Payment system is loading. Please wait.");
            setMessageType("error");
            return;
        }

        if (processingPayment) return;

        if (plan.price === 0) {
            setMessage("This is a free plan.");
            setMessageType("success");
            return;
        }

        try {
            setProcessingPayment(true);
            setMessage("");

            const token = await getToken();
            /* ---------- Create Order ---------- */
            const orderRes = await axios.post(
                ENDPOINTS.CREATE_ORDER,
                {
                    planId: plan.id,
                    amount: plan.price,
                    currency: "INR",
                    creditsAdded: plan.credits
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            /* ---------- Razorpay Options ---------- */
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: plan.price * 100,
                currency: "INR",
                name: "FileShare",
                description: `Purchase ${plan.credits} credits`,
                order_id: orderRes.data.orderId,

                handler: async (res) => {
                    try {
                        /* ---------- Verify Payment ---------- */
                        const verifyRes = await axios.post(
                            ENDPOINTS.VERIFY_PAYMENT,
                            {
                                razorpay_order_id: res.razorpay_order_id,
                                razorpay_payment_id: res.razorpay_payment_id,
                                razorpay_signature: res.razorpay_signature,
                                planId: plan.id,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );


                        if (verifyRes.data == "success") {
                            if (verifyRes.data.credits) {
                                updateCredits(verifyRes.data.credits);
                            } else {
                                await fetchCredits();
                            }

                            setMessage(`Payment successful! ${plan.name} activated.`);
                            setMessageType("success");
                        } else {
                            setMessage("Payment verification failed.");
                            setMessageType("error");
                        }
                    } catch (err) {
                        console.error(err);

                        setMessage("Verification failed.");
                        setMessageType("error");
                    } finally {
                        setProcessingPayment(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        setProcessingPayment(false);
                    },
                },

                theme: {
                    color: "#2563eb",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);

            setMessage("Failed to create order.");
            setMessageType("error");
            setProcessingPayment(false);
        }
    };

    /* -------------------------------------------------- */
    /* UI */
    /* -------------------------------------------------- */
    return (
        <Dashboard_layout activeMenu="Subscriptions">
            <div className="p-6 max-w-7xl mx-auto">

                {/* Header */}
                <h1 className="text-2xl font-bold mb-1">
                    Subscription Plans
                </h1>

                <p className="text-gray-600 mb-6">
                    Choose a plan that works for you
                </p>

                {/* Message */}
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg flex items-center gap-3
            ${messageType === "error"
                                ? "bg-red-50 text-red-700"
                                : "bg-green-50 text-green-700"
                            }`}
                    >
                        <AlertCircle size={20} />
                        {message}
                    </div>
                )}

                {/* Credits */}
                <div className="bg-blue-50 p-5 rounded-lg mb-8 flex items-center gap-4">

                    <CreditCard className="text-blue-500" size={28} />

                    <div>
                        <h2 className="text-lg font-medium">
                            Current Credits:{" "}
                            <span className="font-bold text-blue-600">
                                {credits}
                            </span>
                        </h2>

                        <p className="text-sm text-gray-600">
                            You can upload {credits} more files.
                        </p>
                    </div>
                </div>

                {/* Pricing */}
                <div className=" py-10 px-4 rounded-xl">

                    <h2 className="text-3xl font-bold text-center mb-10">
                        Choose Your Plan
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">

                        {Object.values(pricingPlans).map((plan) => (
                            <div
                                key={plan.id}
                                className={`bg-white rounded-xl shadow p-6 flex flex-col border
                ${plan.highlighted
                                        ? "border-blue-500"
                                        : "border-gray-200"
                                    }`}
                            >
                                {/* Badge */}
                                {plan.highlighted && (
                                    <div className="flex items-center justify-center mb-3 text-blue-600 font-medium">
                                        <Star size={18} className="mr-1" />
                                        Most Popular
                                    </div>
                                )}

                                {/* Title */}
                                <h3 className="text-xl font-semibold text-center">
                                    {plan.name}
                                </h3>

                                <p className="text-gray-500 text-center mt-2">
                                    {plan.description}
                                </p>

                                {/* Price */}
                                <div className="text-3xl font-bold text-center my-4">
                                    ₹{plan.price}
                                </div>

                                {/* Features */}
                                <ul className="flex-1 space-y-3 mb-6">

                                    {plan.features.map((f, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center text-gray-700"
                                        >
                                            <Check
                                                size={18}
                                                className="text-green-500 mr-2"
                                            />
                                            {f}
                                        </li>
                                    ))}

                                </ul>

                                {/* Button */}
                                <button
                                    disabled={
                                        processingPayment || plan.price === 0
                                    }
                                    onClick={() => handlePurchase(plan)}
                                    className={`w-full py-2 rounded-lg font-medium transition
                  ${plan.highlighted
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-200 hover:bg-gray-300"
                                        }
                  ${processingPayment
                                            ? "opacity-60 cursor-not-allowed"
                                            : ""
                                        }`}
                                >
                                    {plan.price === 0
                                        ? "Free Plan"
                                        : plan.cta}
                                </button>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </Dashboard_layout>
    );
}

export default Subscription;