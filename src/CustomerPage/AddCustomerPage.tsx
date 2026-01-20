import { useState } from "react";
import CustomerForm from "./CustomerForm";
import { LoanForm } from "./LoanForm";
import { Customer } from "../types/loan";
import Layout from "../layout/Layout";

export default function AddCustomer() {
  const [showLoan, setShowLoan] = useState<boolean>(false);

  const [customer, setCustomer] = useState<Customer>({
    first_name: "",
    last_name: "",
    customer_name: "",
    customer_phone: "",
    customer_phone_alternate: "",
    customer_email: "",
    customer_address: "",
  });

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h2>Add Customer</h2>

        {/* Customer Details */}
        <CustomerForm customer={customer} setCustomer={setCustomer} />

        {/* Loan Button */}
        <button
          type="button"
          onClick={() => setShowLoan(prev => !prev)}
          style={{
            marginTop: "16px",
            padding: "10px 14px",
            cursor: "pointer",
          }}
        >
          {showLoan ? "HIDE LOAN" : "LOAN"}
        </button>

        {/* Loan Section */}
        {showLoan && (
          <div style={{ marginTop: "20px" }}>
            <LoanForm customer={customer} />
          </div>
        )}
      </div>
    </Layout>
  );
}
