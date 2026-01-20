import { useDashboard } from "./DashboardContext";
import { useMemo } from "react";

export default function RevenueChart() {
  const { customers } = useDashboard();

  // Aggregate revenue by date (simplified for the last 7 unique dates or transactions)
  const chartData = useMemo(() => {
    // Flatten all invoices
    const allInvoices = customers.flatMap(c => c.purchaseHistory);
    // Sort by date ascending
    allInvoices.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Group by Date (or show last 10 transactions for visual)
    // For a nice graph, let's just take the last 7 days/entries with data
    const lastInvoices = allInvoices.slice(-10); // Last 10

    // Find max value for scaling
    const maxAmount = Math.max(...lastInvoices.map(i => i.amount), 1000);

    return lastInvoices.map(inv => ({
      label: new Date(inv.date).getDate().toString() + '/' + (new Date(inv.date).getMonth() + 1),
      value: inv.amount,
      height: (inv.amount / maxAmount) * 100
    }));
  }, [customers]);

  return (
    <section className="panel">
      <div className="panel-header">
        <h3>Recent payments</h3>
        <span className="pill">Recent Transactions</span>
      </div>
      <div className="chart-container" style={{
        height: '200px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '20px 0',
        gap: '10px'
      }}>
        {chartData.length === 0 ? (
          <div style={{ width: '100%', textAlign: 'center', color: '#94a3b8' }}>
            No recent payment data to display
          </div>
        ) : (
          chartData.map((data, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              height: '100%'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}>
                <div
                  className="bar"
                  style={{
                    height: `${data.height}%`,
                    width: '60%',
                    backgroundColor: '#1B5E20', /* Matches Loan button color for consistency */
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease',
                    minHeight: '4px'
                  }}
                  title={`₹${data.value}`}
                ></div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
                {data.label}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
