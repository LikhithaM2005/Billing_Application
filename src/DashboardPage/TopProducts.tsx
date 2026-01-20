import { useDashboard } from "./DashboardContext";

export default function TopProducts() {
  const { products } = useDashboard();

  // Sort products by revenue (highest first)
  const topProducts = [...products].sort(
    (a, b) => b.revenue - a.revenue
  );

  return (
    <section className="panel">
      <div className="panel-header">
        <h3>Top Selling Products</h3>
        <span className="pill">This Month</span>
      </div>

      <div className="product-list scrollable">
        {topProducts.length === 0 ? (
          <p className="muted">No products available</p>
        ) : (
          topProducts.map((product, index) => (
            <div
              key={product.name}
              className="product-row"
              style={{
                backgroundColor: '#f0fdf4', // Light green
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '8px',
                border: '1px solid #dcfce7'
              }}
            >
              <div className="product-left">
                <span className="rank-badge">{index + 1}</span>
                <p className="product-name">{product.name}</p>
              </div>

              <div className="product-revenue">
                ₹{product.revenue.toLocaleString("en-IN")}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
