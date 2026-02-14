import React, { useEffect, useState } from 'react'
import Dashboard_layout from '../layout/Dashboard_layout'
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { ENDPOINTS } from '../endpoints';
import { Loader2, Receipt } from 'lucide-react';

function Transactions() {
    const [Transactions, setTransactions] = useState([]);
    const [loading, SetLoading] = useState(false);
    const { getToken } = useAuth();


    useEffect(() => {

        const fetchTransations = async () => {

            try {
                SetLoading(true)
                const token = await getToken();
                const response = await axios.get(
                    ENDPOINTS.TRANSACTIONS, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
                );
                setTransactions(response.data);
            }
            catch (error) {
                toast.error("network failed", error)
            }
            finally {
                SetLoading(false)
            }
        }

        fetchTransations();

    }, [getToken]);

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
        <Dashboard_layout activeMenu="Transactions">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Receipt className="text-blue-600" />
                    <h1 className="text-2xl font-bold">Transaction History</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin mr-2" size={24} />
                        <span>Loading transactions...</span>
                    </div>
                ) : Transactions.length == 0 ? (
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                            No Transactions Yet
                        </h3>
                        <p className="text-gray-500">
                            You haven't made any credit purchases yet. Visit the Subscription page to buy credits.
                        </p>
                    </div>
                ) : (
                    <div className="p-4 md:p-6 min-h-screen">

                        {/* Table Wrapper */}
                        <div className="overflow-x-auto">

                            <table className="w-full bg-white rounded-xl shadow-md">

                                {/* Header */}
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="p-4 text-left text-sm font-medium">
                                            Plan
                                        </th>
                                        <th className="p-4 text-left text-sm font-medium">
                                            Date
                                        </th>
                                        <th className="p-4 text-left text-sm font-medium">
                                            Payment ID
                                        </th>
                                        <th className="p-4 text-left text-sm font-medium">
                                            Amount
                                        </th>
                                        <th className="p-4 text-left text-sm font-medium">
                                            Credits
                                        </th>
                                    </tr>
                                </thead>

                                {/* Body */}
                                <tbody>

                                    {Transactions.map((item) => (
                                        <tr
                                            key={item._id}
                                            className="hover:bg-gray-50 transition"
                                        >

                                            {/* Plan */}
                                            <td className="p-4 font-medium capitalize">
                                                {item.planId}
                                            </td>

                                            {/* Date */}
                                            <td className="p-4 text-gray-600 text-sm">
                                                {formatDate(item.transactionDate)}
                                            </td>

                                            {/* Payment ID */}
                                            <td className="p-4 text-gray-500 text-sm break-all">
                                                {item.paymentId ?
                                                    item.paymentId.substring(0, 12) + "..." :
                                                    "N/A"
                                                }
                                            </td>

                                            {/* Amount */}
                                            <td className="p-4 font-semibold">
                                                ₹{item.amount}
                                            </td>

                                            {/* Credits */}
                                            <td className="p-4 text-green-600 font-medium">
                                                +{item.creditsAdded}
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Dashboard_layout>
    )
}

export default Transactions