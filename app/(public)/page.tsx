export default function ShopPage() {
  return (
    <main className="min-h-screen px-6 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Heading */}
        <h1 className="text-4xl font-bold mb-6">
          Shop
        </h1>

        <p className="text-gray-600 mb-12">
          Explore our latest collection of products.
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          
          {/* Example Product Card */}
          <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="h-40 bg-gray-100 rounded-lg mb-4"></div>
            <h2 className="text-lg font-semibold">Product Name</h2>
            <p className="text-gray-500 text-sm mt-2">
              Short product description goes here.
            </p>
            <button className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              Add to Cart
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}