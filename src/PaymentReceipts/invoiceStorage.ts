// Utility functions for managing invoices in localStorage

export type Invoice = {
    id: string;
    invoiceNumber: string;
    customerName: string;
    date: string;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    status: 'paid' | 'pending' | 'partially_paid';
    dueDate: string;
};

const STORAGE_KEY = 'billing_app_invoices';

// Generate some initial mock data
const generateMockInvoices = (): Invoice[] => {
    return [
        {
            id: '1',
            invoiceNumber: `INV-001`,
            customerName: 'ABC Company',
            date: '2024-01-15',
            totalAmount: 10000,
            paidAmount: 5000,
            balanceAmount: 5000,
            status: 'partially_paid',
            dueDate: '2024-01-30',
        },
        {
            id: '2',
            invoiceNumber: `INV-002`,
            customerName: 'XYZ Corporation',
            date: '2024-01-16',
            totalAmount: 15000,
            paidAmount: 15000,
            balanceAmount: 0,
            status: 'paid',
            dueDate: '2024-01-31',
        },
        {
            id: '3',
            invoiceNumber: `INV-003`,
            customerName: 'Tech Solutions Inc',
            date: '2024-02-05',
            totalAmount: 25000,
            paidAmount: 10000,
            balanceAmount: 15000,
            status: 'partially_paid',
            dueDate: '2024-02-20',
        },
        {
            id: '4',
            invoiceNumber: `INV-004`,
            customerName: 'Global Industries',
            date: '2024-02-10',
            totalAmount: 30000,
            paidAmount: 0,
            balanceAmount: 30000,
            status: 'pending',
            dueDate: '2024-02-25',
        },
        {
            id: '5',
            invoiceNumber: `INV-005`,
            customerName: 'Retail Corp',
            date: '2024-03-01',
            totalAmount: 5000,
            paidAmount: 0,
            balanceAmount: 5000,
            status: 'pending',
            dueDate: '2024-03-16',
        },
        {
            id: '6',
            invoiceNumber: `INV-006`,
            customerName: 'Local Shop',
            date: '2024-03-15',
            totalAmount: 2500,
            paidAmount: 0,
            balanceAmount: 2500,
            status: 'pending',
            dueDate: '2024-03-30',
        },
    ];
};

export const getInvoices = (): Invoice[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            let invoices: Invoice[] = JSON.parse(stored);

            // Migration: Clear old format data if detected
            if (invoices.length > 0 && invoices[0].invoiceNumber.includes('-202')) {
                localStorage.removeItem(STORAGE_KEY);
                return getInvoices();
            }

            // De-duplication logic: Remove any invoices with duplicate numbers (case-insensitive)
            // We iterate from start to end, and since we use unshift, the first one seen is the latest.
            const seenNumbers = new Set();
            const uniqueInvoices = invoices.filter(inv => {
                const normalized = inv.invoiceNumber.trim().toUpperCase();
                if (!normalized || seenNumbers.has(normalized)) {
                    return false;
                }
                seenNumbers.add(normalized);
                return true;
            });

            if (uniqueInvoices.length !== invoices.length) {
                console.log(`Cleaned up ${invoices.length - uniqueInvoices.length} duplicate invoices.`);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueInvoices));
                return uniqueInvoices;
            }

            return invoices;
        }
    } catch (error) {
        console.error('Error reading invoices from storage:', error);
    }

    // If no stored data, initialize with mocks and save
    const mocks = generateMockInvoices();
    saveInvoices(mocks);
    return mocks;
};

export const saveInvoices = (invoices: Invoice[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
        // Dispatch storage event for cross-tab or same-tab updates if needed
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
        console.error('Error saving invoices to storage:', error);
    }
};

export const getInvoiceByNumber = (invoiceNumber: string): Invoice | undefined => {
    const invoices = getInvoices();
    return invoices.find(inv => inv.invoiceNumber === invoiceNumber);
};

export const updateInvoicePayment = (invoiceNumber: string, amountPaid: number): boolean => {
    const invoices = getInvoices();
    const index = invoices.findIndex(inv => inv.invoiceNumber === invoiceNumber);

    if (index !== -1) {
        const invoice = invoices[index];
        invoice.paidAmount += amountPaid;
        invoice.balanceAmount = invoice.totalAmount - invoice.paidAmount;

        if (invoice.balanceAmount <= 0) {
            invoice.status = 'paid';
            invoice.balanceAmount = 0; // Ensure no negative balance
        } else {
            invoice.status = 'partially_paid';
        }

        invoices[index] = invoice;
        saveInvoices(invoices);
        return true;
    }
    return false;
};

export const generateInvoiceNumber = (): string => {
    const invoices = getInvoices();

    if (invoices.length === 0) {
        return 'INV-001';
    }

    const numbers = invoices
        .map(inv => {
            const parts = inv.invoiceNumber.split('-');
            return parts.length > 1 ? parseInt(parts[1]) : 0;
        })
        .filter(n => !isNaN(n));

    const maxNumber = Math.max(...numbers, 0);
    return `INV-${String(maxNumber + 1).padStart(3, '0')}`;
};

export const saveInvoice = (invoice: Invoice): void => {
    const invoices = getInvoices();
    invoices.unshift(invoice);
    saveInvoices(invoices);
};
