import { useLocation, useNavigate } from "react-router-dom";

import { LoanForm } from "./LoanForm";
import { FiArrowLeft } from "react-icons/fi";
import type { Loan, LoanItem } from "../types/loan";
import { useDashboard } from "../DashboardPage/DashboardContext";
import { nanoid } from "nanoid/non-secure";

export default function CreateLoan() {
    const location = useLocation();
    const navigate = useNavigate();
    const { addCustomer } = useDashboard();
    // Use any because the location state has a mix of Customer and mapped fields
    const customerData = location.state?.customer as any;

    if (!customerData) {
        return (
            <>
                <div style={{ padding: "20px" }}>
                    <p>No customer data found. Please start from Customer Management.</p>
                    <button className="secondary-btn" onClick={() => navigate("/customers")}>
                        <FiArrowLeft /> Back to Customers
                    </button>
                </div>
            </>
        );
    }

    const handleSaveLoan = (loanData: { description: string; items: LoanItem[] }) => {
        // Calculate total amount
        const totalAmount = loanData.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

        const newLoan: Loan = {
            id: nanoid(),
            amount: totalAmount,
            description: loanData.description,
            items: loanData.items,
            createdAt: new Date().toISOString(),
            status: "active",
        };

        // Construct full customer object
        // We expect basic fields to be present from the navigation state
        addCustomer({
            name: customerData.name || customerData.customer_name,
            phone: customerData.phone || customerData.customer_phone,
            customerType: customerData.customerType || "Individual",
            email: customerData.email || customerData.customer_email,
            address: customerData.address || customerData.customer_address,
            gstTaxId: customerData.gstTaxId,
            creditLimit: customerData.creditLimit || 0,
            creditUsed: 0,
            isBlocked: false,
            purchaseHistory: [],
            creditRewards: 0,
            loans: [newLoan],
        });

        alert("Customer and Loan saved successfully!");
        navigate("/customers");
    };

    return (
        <>
            <section className="panel">


                <div style={{ padding: "20px" }}>
                    <LoanForm
                        customer={customerData}
                        onSave={handleSaveLoan}
                    />

                    <div style={{ marginTop: "20px" }}>
                        <button className="secondary-btn" onClick={() => navigate(-1)}>
                            <FiArrowLeft /> Cancel
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
