////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering
import { Location, Sport } from '@/constants/data';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Product data
export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

// Mock product data store
export const fakeProducts = {
  records: [] as Product[], // Holds the list of product objects

  // Initialize with sample data
  initialize() {
    const sampleProducts: Product[] = [];
    function generateRandomProductData(id: number): Product {
      const categories = [
        'Electronics',
        'Furniture',
        'Clothing',
        'Toys',
        'Groceries',
        'Books',
        'Jewelry',
        'Beauty Products'
      ];

      return {
        id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        photo_url: `https://api.slingacademy.com/public/sample-products/${id}.png`,
        category: faker.helpers.arrayElement(categories),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate remaining records
    for (let i = 1; i <= 20; i++) {
      sampleProducts.push(generateRandomProductData(i));
    }

    this.records = sampleProducts;
  },

  // Get all products with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let products = [...this.records];

    // Filter products based on selected categories
    if (categories.length > 0) {
      products = products.filter((product) =>
        categories.includes(product.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      products = matchSorter(products, search, {
        keys: ['name', 'description', 'category']
      });
    }

    return products;
  },

  // Get paginated results with optional category filtering and search
  async getProducts({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allProducts = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalProducts = allProducts.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_products: totalProducts,
      offset,
      limit,
      products: paginatedProducts
    };
  },

  // Get a specific product by its ID
  async getProductById(id: number) {
    await delay(1000); // Simulate a delay

    // Find the product by its ID
    const product = this.records.find((product) => product.id === id);

    if (!product) {
      return {
        success: false,
        message: `Product with ID ${id} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Product with ID ${id} found`,
      product
    };
  }
};

// Initialize sample products
fakeProducts.initialize();


// Mock location data store
export const fakeLocations = {
  records: [] as Location[], // Menyimpan daftar objek lokasi

  // Inisialisasi dengan data contoh
  initialize() {
    const sampleLocations: Location[] = [];
    
    // Daftar cabang olahraga yang mungkin
    const sportsList = [
      'Futsal', 
      'Badminton', 
      'Basketball', 
      'Volleyball', 
      'Tennis', 
      'Sepak Bola', 
      'Handball'
    ];

    function generateRandomLocationData(id: number): Location {
      // Pilih beberapa cabang olahraga secara acak
      const locationSports = faker.helpers.arrayElements(sportsList, { min: 1, max: 3 });
      
      return {
        id,
        img: `https://api.slingacademy.com/public/sample-photos/${id}.jpeg`,
        name: `${faker.location.city()} Sport Center`,
        sports: locationSports,
        countLap: faker.number.int({ min: 2, max: 10 }),
        desc: faker.lorem.paragraph(),
        address: faker.location.streetAddress(),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate 15 lokasi
    for (let i = 1; i <= 15; i++) {
      sampleLocations.push(generateRandomLocationData(i));
    }

    this.records = sampleLocations;
  },

  // Ambil semua lokasi dengan filter opsional
  async getAll({
    sports = [],
    search
  }: {
    sports?: string[];
    search?: string;
  }) {
    let locations = [...this.records];

    // Filter berdasarkan cabang olahraga
    if (sports.length > 0) {
      locations = locations.filter((location) =>
        location.sports.some(sport => sports.includes(sport))
      );
    }

    // Pencarian di berbagai field
    if (search) {
      locations = matchSorter(locations, search, {
        keys: ['name', 'desc', 'sports']
      });
    }

    return locations;
  },

  // Ambil lokasi dengan pagination
  async getLocations({
    page = 1,
    limit = 10,
    sports,
    search
  }: {
    page?: number;
    limit?: number;
    sports?: string;
    search?: string;
  }) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

    const sportsArray = sports ? sports.split('.') : [];
    const allLocations = await this.getAll({
      sports: sportsArray,
      search
    });
    const totalLocations = allLocations.length;

    // Logika pagination
    const offset = (page - 1) * limit;
    const paginatedLocations = allLocations.slice(offset, offset + limit);

    // Waktu saat ini
    const currentTime = new Date().toISOString();

    // Kembalikan respons dengan pagination
    return {
      success: true,
      time: currentTime,
      message: 'Data lokasi untuk keperluan testing',
      total_locations: totalLocations,
      offset,
      limit,
      locations: paginatedLocations
    };
  },

  // Ambil lokasi berdasarkan ID
  async getLocationById(id: number) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

    // Cari lokasi berdasarkan ID
    const location = this.records.find((location) => location.id === id);

    if (!location) {
      return {
        success: false,
        message: `Lokasi dengan ID ${id} tidak ditemukan`
      };
    }

    // Waktu saat ini
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Lokasi dengan ID ${id} ditemukan`,
      location
    };
  }
};

// Inisialisasi lokasi contoh
fakeLocations.initialize();

// Data sport
export const fakeSports = {
  records: [] as Sport[],

  initialize() {
    const sportNames = [
      { name: 'Futsal', description: 'Olahraga mirip sepak bola, dimainkan di dalam ruangan.' },
      { name: 'Badminton', description: 'Olahraga raket yang dimainkan oleh dua atau empat orang.' },
      { name: 'Basketball', description: 'Olahraga tim yang bertujuan memasukkan bola ke keranjang.' },
      { name: 'Volleyball', description: 'Olahraga memukul bola melewati net dengan tangan.' },
      { name: 'Tennis', description: 'Olahraga raket satu lawan satu atau ganda.' },
      { name: 'Sepak Bola', description: 'Olahraga paling populer dengan 11 pemain tiap tim.' },
      { name: 'Handball', description: 'Olahraga cepat dengan bola tangan.' }
    ];

    const sports: Sport[] = sportNames.map((item, index) => ({
      id: index + 1,
      name: item.name,
      countLocation: faker.number.int({ min: 1, max: 10 }),
      description: item.description,
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString()
    }));

    this.records = sports;
  },

  async getSports() {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulasi delay
    return this.records;
  },

  async getSportById(id: number) {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulasi delay
    const sport = this.records.find((s) => s.id === id);
    if (!sport) {
      return { success: false, message: `Sport dengan ID ${id} tidak ditemukan` };
    }
    return { success: true, sport };
  }
};

// Jangan lupa panggil initialize
fakeSports.initialize();
