/**
 * SDK Usage Example
 * Demonstrates using the AACSearch SDK without React
 */

import { AACSearchClient } from '@aacsearch/react';
import type { Collection, Document } from '@aacsearch/react';

// Initialize the client
const client = new AACSearchClient({
  apiKey: 'your-api-key',
  endpoint: 'https://api.aacsearch.com',
  tenant: 'your-tenant-id', // optional
});

// Example 1: Create a collection
async function createProductsCollection() {
  try {
    const collection = await client.createCollection({
      name: 'products',
      description: 'E-commerce products collection',
      fields: [
        { name: 'name', type: 'string', index: true },
        { name: 'description', type: 'string', index: true },
        { name: 'price', type: 'float', sort: true },
        { name: 'category', type: 'string', facet: true },
        { name: 'brand', type: 'string', facet: true },
        { name: 'rating', type: 'float', sort: true },
        { name: 'in_stock', type: 'bool', facet: true },
        { name: 'image_url', type: 'string', optional: true },
        { name: 'tags', type: 'string[]', optional: true },
      ],
      default_sorting_field: 'rating',
    });

    console.log('Collection created:', collection);
    return collection;
  } catch (error) {
    console.error('Failed to create collection:', error);
  }
}

// Example 2: Import documents
async function importProducts() {
  try {
    const products: Document[] = [
      {
        id: '1',
        name: 'MacBook Pro 16"',
        description: 'Powerful laptop for professionals',
        price: 2499,
        category: 'Electronics',
        brand: 'Apple',
        rating: 4.8,
        in_stock: true,
        tags: ['laptop', 'apple', 'professional'],
      },
      {
        id: '2',
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced camera',
        price: 999,
        category: 'Electronics',
        brand: 'Apple',
        rating: 4.9,
        in_stock: true,
        tags: ['phone', 'apple', 'camera'],
      },
      {
        id: '3',
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-cancelling headphones',
        price: 399,
        category: 'Audio',
        brand: 'Sony',
        rating: 4.7,
        in_stock: true,
        tags: ['headphones', 'audio', 'wireless'],
      },
    ];

    const result = await client.importDocuments({
      collection: 'products',
      documents: products,
      action: 'upsert',
    });

    console.log('Documents imported:', result);
    return result;
  } catch (error) {
    console.error('Failed to import documents:', error);
  }
}

// Example 3: Search products
async function searchProducts(query: string) {
  try {
    const results = await client.search({
      q: query,
      collection: 'products',
      query_by: 'name,description,tags',
      filter_by: 'in_stock:=true',
      facet_by: 'category,brand',
      sort_by: 'rating:desc',
      per_page: 10,
      page: 1,
    });

    console.log('Search results:', results);
    console.log(`Found ${results.found} products in ${results.search_time_ms}ms`);

    results.hits.forEach((hit) => {
      console.log(`- ${hit.document.name} (${hit.document.brand}) - $${hit.document.price}`);
    });

    return results;
  } catch (error) {
    console.error('Search failed:', error);
  }
}

// Example 4: Advanced search with filters
async function advancedSearch() {
  try {
    const results = await client.search({
      q: 'laptop',
      collection: 'products',
      query_by: 'name,description,tags',
      filter_by: 'price:[500..2000] && brand:=Apple && in_stock:=true',
      facet_by: 'category,brand,rating',
      max_facet_values: 10,
      sort_by: 'price:asc,rating:desc',
      per_page: 20,
      page: 1,
      typo_tolerance: true,
      prefix: true,
      highlight_fields: 'name,description',
      highlight_full_fields: 'name',
    });

    console.log('Advanced search results:', results);
    return results;
  } catch (error) {
    console.error('Advanced search failed:', error);
  }
}

// Example 5: Multi-search
async function multiSearch() {
  try {
    const results = await client.multiSearch([
      {
        collection: 'products',
        q: 'laptop',
        query_by: 'name,description',
        filter_by: 'category:=Electronics',
      },
      {
        collection: 'products',
        q: 'headphones',
        query_by: 'name,description',
        filter_by: 'category:=Audio',
      },
    ]);

    console.log('Multi-search results:', results);
    return results;
  } catch (error) {
    console.error('Multi-search failed:', error);
  }
}

// Example 6: Update a document
async function updateProduct(productId: string, updates: Partial<Document>) {
  try {
    const result = await client.updateDocument('products', productId, updates);
    console.log('Product updated:', result);
    return result;
  } catch (error) {
    console.error('Failed to update product:', error);
  }
}

// Example 7: Delete documents by query
async function deleteOutOfStockProducts() {
  try {
    const result = await client.deleteDocumentsByQuery('products', 'in_stock:=false');
    console.log(`Deleted ${result.num_deleted} out-of-stock products`);
    return result;
  } catch (error) {
    console.error('Failed to delete products:', error);
  }
}

// Example 8: Get analytics
async function getAnalytics() {
  try {
    const analytics = await client.getAnalytics({
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      collection: 'products',
      granularity: 'day',
    });

    console.log('Analytics:', analytics);
    console.log(`Total searches: ${analytics.total_searches}`);
    console.log(`Average response time: ${analytics.avg_response_time}ms`);
    console.log('Top queries:', analytics.top_queries);

    return analytics;
  } catch (error) {
    console.error('Failed to get analytics:', error);
  }
}

// Example 9: Create API key
async function createApiKey() {
  try {
    const apiKey = await client.createApiKey({
      name: 'Frontend Search Key',
      description: 'API key for frontend search operations',
      permissions: ['read_only'],
      collections: ['products'],
      expires_at: '2025-12-31',
    });

    console.log('API key created:', apiKey);
    console.log('Secret (save this!):', apiKey.value);

    return apiKey;
  } catch (error) {
    console.error('Failed to create API key:', error);
  }
}

// Example 10: Track custom event
async function trackEvent() {
  try {
    await client.trackEvent({
      type: 'product_view',
      collection: 'products',
      query: 'laptop',
      metadata: {
        product_id: '1',
        user_id: 'user-123',
        source: 'search_results',
      },
    });

    console.log('Event tracked successfully');
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

// Main execution
async function main() {
  console.log('=== AACSearch SDK Examples ===\n');

  // 1. Create collection
  await createProductsCollection();

  // 2. Import documents
  await importProducts();

  // 3. Basic search
  await searchProducts('laptop');

  // 4. Advanced search
  await advancedSearch();

  // 5. Multi-search
  await multiSearch();

  // 6. Update product
  await updateProduct('1', { price: 2299, rating: 4.9 });

  // 7. Get analytics
  await getAnalytics();

  // 8. Create API key
  await createApiKey();

  // 9. Track event
  await trackEvent();

  console.log('\n=== All examples completed ===');
}

// Run examples
if (require.main === module) {
  main().catch(console.error);
}

export {
  createProductsCollection,
  importProducts,
  searchProducts,
  advancedSearch,
  multiSearch,
  updateProduct,
  deleteOutOfStockProducts,
  getAnalytics,
  createApiKey,
  trackEvent,
};
