import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { saveReceipt, generateReceiptNumber } from './receiptStorage';
import { getInvoices, updateInvoicePayment } from './invoiceStorage';
import './PaymentReceipts.css';

const ReceivePayment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [formData, setFormData] = useState({
    invoice: '',
    customer: '',
    paymentAmount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    referenceNumber: '',
    notes: '',
  });

  useEffect(() => {
    // If data passed via state (from Invoice Detail)
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        invoice: location.state.invoiceNo,
        customer: location.state.customer,
        paymentAmount: location.state.balance ? location.state.balance.toString() : ''
      }));
      return;
    }

    // If ID passed via URL params
    if (id) {
      const invoices = getInvoices();
      const selectedInvoice = invoices.find(inv => inv.id === id || inv.invoiceNumber === id);

      if (selectedInvoice) {
        setFormData(prev => ({
          ...prev,
          invoice: selectedInvoice.invoiceNumber,
          customer: selectedInvoice.customerName,
          paymentAmount: selectedInvoice.balanceAmount.toString()
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.state]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.invoice) {
      newErrors.invoice = 'Invoice Number is required';
    }

    if (!formData.customer) {
      newErrors.customer = 'Customer Name is required';
    }

    if (!formData.paymentAmount) {
      newErrors.paymentAmount = 'Payment Amount is required';
    } else {
      const amount = parseFloat(formData.paymentAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.paymentAmount = 'Payment Amount must be greater than 0';
      }
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Payment Date is required';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment Method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const amount = parseFloat(formData.paymentAmount);

      // Generate receipt number and save receipt
      const receiptNumber = generateReceiptNumber();
      const newReceipt = {
        id: Date.now().toString(),
        receiptNumber: receiptNumber,
        invoiceNumber: formData.invoice,
        customer: formData.customer,
        amount: amount,
        date: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        referenceNumber: formData.referenceNumber || undefined,
        notes: formData.notes || undefined,
      };

      saveReceipt(newReceipt);

      // Update invoice payment status
      updateInvoicePayment(formData.invoice, amount);

      alert('Payment received successfully!');
      navigate(`/payments/receipts/${newReceipt.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ padding: '0 0.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: '#1B5E20' }}>Payment Details</h3>

        <div className="form-group">
          <label className="form-label">Invoice Number</label>
          <input
            type="text"
            name="invoice_readonly"
            value={formData.invoice}
            className="form-input"
            readOnly
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed', fontWeight: 'bold' }}
            placeholder="Pick an invoice above"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Customer Name</label>
          <input
            type="text"
            name="customer"
            value={formData.customer}
            className="form-input"
            readOnly
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            placeholder="Customer name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Payment Amount</label>
          <input
            type="number"
            name="paymentAmount"
            value={formData.paymentAmount}
            onChange={handleChange}
            className={`form-input ${errors.paymentAmount ? 'error' : ''}`}
            placeholder="0.00"
          />
          {errors.paymentAmount && (
            <div className="error-message">{errors.paymentAmount}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Payment Date <span className="required">*</span></label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            className={`form-input ${errors.paymentDate ? 'error' : ''}`}
          />
          {errors.paymentDate && (
            <div className="error-message">{errors.paymentDate}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Method <span className="required">*</span></label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}
          >
            <option value="">Select method</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Online Payment">Online Payment</option>
          </select>
          {errors.paymentMethod && (
            <div className="error-message">{errors.paymentMethod}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Reference Number</label>
          <input
            type="text"
            name="referenceNumber"
            value={formData.referenceNumber}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter reference number (optional)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter any additional notes (optional)"
            rows={4}
          />
        </div>

        <div className="form-actions" style={{ marginTop: '2rem' }}>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate('/payments/receipts')}
          >
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Save Payment
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReceivePayment;
