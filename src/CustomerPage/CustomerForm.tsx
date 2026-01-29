import type { Customer } from "../types/loan";

type Props = {
  customer: Customer;
  setCustomer: (customer: Customer) => void;
};

export default function CustomerForm({ customer, setCustomer }: Props) {
  return (
    <>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          placeholder="First Name"
          style={{ flex: 1 }}
          value={customer.first_name}
          onChange={e => {
            const firstName = e.target.value;
            setCustomer({
              ...customer,
              first_name: firstName,
              customer_name: `${firstName} ${customer.last_name}`.trim(),
            });
          }}
        />
        <input
          placeholder="Last Name"
          style={{ flex: 1 }}
          value={customer.last_name}
          onChange={e => {
            const lastName = e.target.value;
            setCustomer({
              ...customer,
              last_name: lastName,
              customer_name: `${customer.first_name} ${lastName}`.trim(),
            });
          }}
        />
      </div>

      <input
        placeholder="Phone"
        value={customer.customer_phone || ""}
        onChange={e =>
          setCustomer({ ...customer, customer_phone: e.target.value })
        }
      />

      <input
        placeholder="Alternate Phone"
        value={customer.customer_phone_alternate || ""}
        onChange={e =>
          setCustomer({ ...customer, customer_phone_alternate: e.target.value })
        }
      />

      <input
        placeholder="Email"
        value={customer.customer_email || ""}
        onChange={e =>
          setCustomer({ ...customer, customer_email: e.target.value })
        }
      />

      <textarea
        placeholder="Address"
        value={customer.customer_address || ""}
        onChange={e =>
          setCustomer({ ...customer, customer_address: e.target.value })
        }
      />
    </>
  );
}
