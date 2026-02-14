import React from "react";
import { testimonials } from "../../testenomials";

function TestimonialSection() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        What our users are saying
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Hear from people who trust and use our platform daily.
                    </p>
                </div>

                {/* Testimonials */}
                <div className="mt-16 grid gap-8 lg:grid-cols-3">
                    {Object.values(testimonials).map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-xl shadow-md"
                        >
                            <div className="p-8">
                                {/* User Info */}
                                <div className="flex items-center">
                                    <img
                                        className="h-12 w-12 rounded-full"
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                    />
                                    <div className="ml-4">
                                        <p className="text-lg font-medium text-gray-900">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {testimonial.role} · {testimonial.company}
                                        </p>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="mt-4 flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            filled={i < testimonial.rating}
                                        />
                                    ))}
                                </div>

                                {/* Feedback */}
                                <blockquote className="mt-4">
                                    <p className="text-base italic text-gray-600">
                                        “{testimonial.feedback}”
                                    </p>
                                </blockquote>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TestimonialSection;

function Star({ filled }) {
    return (
        <svg
            className={`h-5 w-5 ${filled ? "text-yellow-400" : "text-gray-300"
                }`}
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.379 2.455a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.379-2.455a1 1 0 00-1.175 0l-3.379 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.05 9.397c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.287-3.97z" />
        </svg>
    );
}

