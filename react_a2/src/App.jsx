
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  // 1. Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://dummyjson.com/products?limit=100"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(data.products);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Search and filter products
  const filteredProducts = products.filter((product) =>
    `${product.title} ${product.description} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  // 3. Calculate pagination
  const totalPages = Math.ceil(
    filteredProducts.length / itemsPerPage
  );

  // 4. Get products for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // 5. Handle search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="app">
      <h1>Product Gallery</h1>
      <p className="subtitle">
        Explore products using search and pagination
      </p>

      <input
        className="search"
        type="text"
        placeholder="Search by name, description or category..."
        value={search}
        onChange={handleSearch}
      />

      {/* Loading */}
      {loading && <h2 className="message">Loading products...</h2>}

      {/* Error */}
      {!loading && error && (
        <div className="message">
          <p className="error">{error}</p>
          <button onClick={fetchProducts}>Try Again</button>
        </div>
      )}

      {/* Products */}
      {!loading && !error && (
        <>
          <p className="count">
            {filteredProducts.length} products found
          </p>

          {filteredProducts.length === 0 ? (
            <h2 className="message">No products found!</h2>
          ) : (
            <>
              <div className="gallery">
                {currentProducts.map((product) => (
                  <div className="card" key={product.id}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                    />

                    <div className="card-content">
                      <h3>{product.title}</h3>

                      <p className="category">
                        {product.category}
                      </p>

                      <p className="description">
                        {product.description}
                      </p>

                      <h3 className="price">
                        ${product.price}
                      </h3>

                      <p>Rating: ⭐ {product.rating}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button
                  onClick={() =>
                    setCurrentPage((page) => page - 1)
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    className={
                      currentPage === page ? "active" : ""
                    }
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((page) => page + 1)
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>

              <p className="page-info">
                Page {currentPage} of {totalPages}
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
