////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering
import { Location, Sport, Field, User, Admin, Reservation, Member, Schedule } from '@/constants/data';
faker.seed(123);
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
  // Optimized getAll method
  async getAll({
    sports = [],
    search
  }: {
    sports?: string[];
    search?: string;
  }) {
    let locations = [...this.records];

    // Filter based on sports efficiently
    if (sports.length > 0) {
      const sportsSet = new Set(sports);
      locations = locations.filter((location) =>
        location.sports.some(sport => sportsSet.has(sport))
      );
    }

    // Optimize search by checking direct matches first
    if (search) {
      const searchLower = search.toLowerCase();
      locations = locations.filter(location => 
        location.name.toLowerCase().includes(searchLower) ||
        location.desc.toLowerCase().includes(searchLower) ||
        location.sports.some(sport => sport.toLowerCase().includes(searchLower))
      );
    }

    return locations;
  },

  // Optimized getLocations method - remove artificial delay
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
    // Remove the artificial delay
    // await new Promise(resolve => setTimeout(resolve, 1000));

    const sportsArray = sports ? sports.split('.') : [];
    const allLocations = await this.getAll({
      sports: sportsArray,
      search
    });
    const totalLocations = allLocations.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedLocations = allLocations.slice(offset, offset + limit);

    return {
      success: true,
      time: new Date().toISOString(),
      message: 'Data lokasi untuk keperluan testing',
      totalLocations: totalLocations,
      offset,
      limit,
      locations: paginatedLocations
    };
  },

  // Optimized getLocationById - remove artificial delay
  async getLocationById(id: number) {
    // Remove the artificial delay
    // await new Promise(resolve => setTimeout(resolve, 1000));

    const location = this.records.find((location) => location.id === id);

    if (!location) {
      return {
        success: false,
        message: `Lokasi dengan ID ${id} tidak ditemukan`
      };
    }

    return {
      success: true,
      time: new Date().toISOString(),
      message: `Lokasi dengan ID ${id} ditemukan`,
      location
    };
  }
};

// Initialize example locations
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

  async getSports({
    page = 1,
    limit = 10,
    search
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulasi delay
  
    let filteredSports = this.records;
  
    // Tambahkan logika pencarian
    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredSports = filteredSports.filter(sport =>
        sport.name.toLowerCase().includes(lowerSearch) ||
        sport.description.toLowerCase().includes(lowerSearch)
      );
    }
  
    const totalSports = filteredSports.length;
  
    const offset = (page - 1) * limit;
    const paginatedSports = filteredSports.slice(offset, offset + limit);
  
    const currentTime = new Date().toISOString();
  
    return {
      success: true,
      time: currentTime,
      message: 'Data olahraga untuk keperluan testing',
      totalSports: totalSports,
      offset,
      limit,
      sports: paginatedSports
    };
  },

  async getSportById(id: number) {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulasi delay
    const sport = this.records.find((s) => s.id === id);
    if (!sport) {
      return {
        success: false,
        time: new Date().toISOString(),
        message: `Sport dengan ID ${id} tidak ditemukan`
      };
    }
    return {
      success: true,
      time: new Date().toISOString(),
      sport
    };
  }
};

// Jangan lupa panggil initialize
fakeSports.initialize();


// Mock field data store
export const fakeFields = {
  records: [] as Field[], // Menyimpan daftar objek lapangan

  // Inisialisasi dengan data contoh
  initialize() {
    const sampleFields: Field[] = [];

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

    // Daftar lokasi
    const locationsList = [
      'GOR Utama',
      'Sport Center Kota',
      'Stadion Olahraga',
      'Pusat Kebugaran',
      'Arena Olahraga',
      'Kompleks Olahraga',
      'Lapangan Terpadu'
    ];

    function generateRandomFieldData(id: number): Field {
      return {
        id,
        name: `Lapangan ${faker.helpers.arrayElement(sportsList)} ${id}`,
        location: faker.helpers.arrayElement(locationsList),
        sport: faker.helpers.arrayElement(sportsList),
        jamMulai: '09:00',
        jamTutup: '23:00',
        description: faker.lorem.paragraph(),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate 50 lapangan
    for (let i = 1; i <= 50; i++) {
      sampleFields.push(generateRandomFieldData(i));
    }

    this.records = sampleFields;
  },

  // Ambil semua lapangan dengan filter opsional
  async getAll({
    locations = [],
    sports = [],
    search
  }: {
    locations?: string[];
    sports?: string[];
    search?: string;
  }) {
    let fields = [...this.records];

    // Filter berdasarkan location
    if (locations.length > 0) {
      fields = fields.filter((field) =>
        locations.includes(field.location)
      );
    }

    // Filter berdasarkan cabang olahraga
    if (sports.length > 0) {
      fields = fields.filter((field) =>
        sports.includes(field.sport)
      );
    }

    // Pencarian di berbagai field
    if (search) {
      fields = matchSorter(fields, search, {
        keys: ['name', 'location', 'sport', 'description']
      });
    }

    return fields;
  },

  // Ambil lapangan dengan pagination
  async getFields({
    page = 1,
    limit = 10,
    locations,
    sports,
    search
  }: {
    page?: number;
    limit?: number;
    locations?: string;
    sports?: string;
    search?: string;
  }) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

    const locationArray = locations ? locations.split('.') : [];
    const sportArray = sports ? sports.split('.') : [];

    const allFields = await this.getAll({
      locations: locationArray,
      sports: sportArray,
      search
    });

    const totalFields = allFields.length;

    // Logika pagination
    const offset = (page - 1) * limit;
    const paginatedFields = allFields.slice(offset, offset + limit);

    // Waktu saat ini
    const currentTime = new Date().toISOString();

    // Kembalikan respons dengan pagination
    return {
      success: true,
      time: currentTime,
      message: 'Data lapangan untuk keperluan testing',
      totalFields: totalFields,
      offset,
      limit,
      fields: paginatedFields
    };
  },

  // Ambil lapangan berdasarkan ID
  async getFieldById(id: number) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

    // Cari lapangan berdasarkan ID
    const field = this.records.find((field) => field.id === id);

    if (!field) {
      return {
        success: false,
        message: `Lapangan dengan ID ${id} tidak ditemukan`
      };
    }

    // Waktu saat ini
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Lapangan dengan ID ${id} ditemukan`,
      field
    };
  }
};


// Inisialisasi lapangan contoh
fakeFields.initialize();



// Mock user data store
export const fakeUsers = {
  records: [] as User[], // Menyimpan daftar objek user

  // Inisialisasi dengan data contoh
  initialize() {
    const sampleUsers: User[] = [];

    function generateRandomUserData(userId: number): User {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      
      return {
        userId,
        username: faker.internet.username({ 
          firstName: firstName, 
          lastName: lastName 
        }),
        password: '12345678',
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ 
          firstName: firstName, 
          lastName: lastName 
        }),
        phone: `+62 8${faker.string.numeric(9)}`,
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate 50 users
    for (let i = 1; i <= 50; i++) {
      sampleUsers.push(generateRandomUserData(i));
    }

    this.records = sampleUsers;
  },

  // Ambil semua users dengan filter opsional
  async getAll({
    search
  }: {
    search?: string;
  }) {
    let users = [...this.records];

    // Pencarian di berbagai field
    if (search) {
      users = matchSorter(users, search, {
        keys: ['username', 'name', 'email', 'phone']
      });
    }

    return users;
  },

  // Ambil users dengan pagination
  async getUsers({
    page = 1,
    limit = 10,
    search
  }: {
    page?: number;
    limit?: number;
    memberStatus?: string;
    search?: string;
  }) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

    const allUsers = await this.getAll({
      search
    });
    const totalUsers = allUsers.length;

    // Logika pagination
    const offset = (page - 1) * limit;
    const paginatedUsers = allUsers.slice(offset, offset + limit);

    // Waktu saat ini
    const currentTime = new Date().toISOString();

    // Kembalikan respons dengan pagination
    return {
      success: true,
      time: currentTime,
      message: 'Data user untuk keperluan testing',
      totalUsers: totalUsers,
      offset,
      limit,
      users: paginatedUsers
    };
  },

  // Ambil user berdasarkan ID
  async getUserById(id: number) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

    // Cari user berdasarkan ID
    const user = this.records.find((user) => user.userId === id);

    if (!user) {
      return {
        success: false,
        message: `User dengan ID ${id} tidak ditemukan`
      };
    }

    // Waktu saat ini
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `User dengan ID ${id} ditemukan`,
      user
    };
  }
};

// Inisialisasi users contoh
fakeUsers.initialize();

// Mock admin data store
export const fakeAdmins = {
  records: [] as Admin[], // Menyimpan daftar objek admin

  // Inisialisasi dengan data contoh
  initialize() {
    const sampleAdmins: Admin[] = [];

    // Daftar lokasi
    const locationsList = [
      'GOR Utama',
      'Sport Center Kota',
      'Stadion Olahraga',
      'Pusat Kebugaran',
      'Arena Olahraga',
      'Kompleks Olahraga',
      'Lapangan Terpadu'
    ];

    function generateRandomAdminData(adminId: number): Admin {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      return {
        adminId,
        username: faker.internet.username({ 
          firstName: firstName, 
          lastName: lastName 
        }),
        password: '12345678',
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ 
          firstName: firstName, 
          lastName: lastName 
        }),
        phone: `+62 8${faker.string.numeric(9)}`,
        location: faker.helpers.arrayElement(locationsList),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate 50 admin
    for (let i = 1; i <= 50; i++) {
      sampleAdmins.push(generateRandomAdminData(i));
    }

    this.records = sampleAdmins;
  },

  // Ambil semua admin dengan filter opsional
  async getAll({
    location = [],
    search
  }: {
    location?: string[];
    search?: string;
  }) {
    let admins = [...this.records];

    // Filter berdasarkan location
    if (location.length > 0) {
      admins = admins.filter((admin) =>
        location.includes(admin.location)
      );
    }

    // Pencarian di berbagai field
    if (search) {
      admins = matchSorter(admins, search, {
        keys: ['username','name', 'phone', 'location']
      });
    }

    return admins;
  },

  // Ambil admin dengan pagination
  async getAdmins({
    page = 1,
    limit = 10,
    location,
    search
  }: {
    page?: number;
    limit?: number;
    location?: string;
    search?: string;
  }) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

    const locationArray = location ? location.split('.') : [];
   
    const allAdmins = await this.getAll({
      location: locationArray,
      search
    });

    const totalAdmins = allAdmins.length;

    // Logika pagination
    const offset = (page - 1) * limit;
    const paginatedAdmins = allAdmins.slice(offset, offset + limit);

    // Waktu saat ini
    const currentTime = new Date().toISOString();

    // Kembalikan respons dengan pagination
    return {
      success: true,
      time: currentTime,
      message: 'Data admin untuk keperluan testing',
      totalAdmins: totalAdmins,
      offset,
      limit,
      admins: paginatedAdmins
    };
  },

  // Ambil admin berdasarkan ID
  async getAdminById(id: number) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

    // Cari admin berdasarkan ID
    const admin = this.records.find((admin) => admin.adminId === id);

    if (!admin) {
      return {
        success: false,
        message: `Admin dengan ID ${id} tidak ditemukan`
      };
    }

    // Waktu saat ini
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Admin dengan ID ${id} ditemukan`,
      admin
    };
  }
};

// Inisialisasi admin contoh
fakeAdmins.initialize();


// Mock reservation data store
export const fakeReservations = {
  records: [] as Reservation[], // Menyimpan daftar objek reservasi

  // Inisialisasi dengan data contoh
  initialize() {
    const sampleReservations: Reservation[] = [];
    
    // Daftar nama lapangan
    const fieldNames = [
      'Lapangan Futsal Utama',
      'Lapangan Badminton A',
      'Lapangan Basket Kota',
      'Lapangan Voli Stadion',
      'Lapangan Tennis Center',
      'Lapangan Sepak Bola Mini',
      'Lapangan Handball Profesional'
    ];

    // Status pembayaran dan reservasi
    const paymentStatuses: Reservation['paymentStatus'][] = ['pending', 'down payment', 'complete', 'fail'];
    const reservationStatuses: Reservation['status'][] = ['upcoming', 'ongoing', 'completed'];

    function generateRandomReservationData(reservationId: number): Reservation {
      // Generate waktu mulai dan selesai
      const startHour = faker.number.int({ min: 9, max: 20 }); 
      const startTime = new Date();
      startTime.setHours(startHour, 0, 0, 0);
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

      // Total dan sisa pembayaran
      const totalPayment = faker.number.int({ min: 50000, max: 500000 });
      const paymentStatus = faker.helpers.arrayElement(paymentStatuses);
      
      // Hitung sisa pembayaran berdasarkan status
      let remainingPayment = 0;
      switch (paymentStatus) {
        case 'pending':
          remainingPayment = totalPayment;
          break;
        case 'down payment':
          remainingPayment = totalPayment * 0.5;
          break;
        case 'complete':
          remainingPayment = 0;
          break;
        case 'fail':
          remainingPayment = totalPayment;
          break;
      }

      // Generate nama pemesan
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      function formatDateTime(date: Date): string {
        const pad = (num: number) => num.toString().padStart(2, '0');
        
        const year = date.getFullYear().toString().slice(-2);
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
      }
      return {
        reservationId,
        
        // Dalam mock data
        createTime: formatDateTime(faker.date.recent()),
        name: `${firstName} ${lastName}`,
        fieldTime: `${faker.helpers.arrayElement(fieldNames)} (${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()})`,
        date: startTime.toISOString().split('T')[0],
        totalPayment,
        remainingPayment: Math.round(remainingPayment),
        paymentStatus,
        status: faker.helpers.arrayElement(reservationStatuses),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate 50 reservasi
    for (let i = 1; i <= 50; i++) {
      sampleReservations.push(generateRandomReservationData(i));
    }

    this.records = sampleReservations;
  },

  // Ambil semua reservasi dengan filter opsional
  async getAll({
    paymentStatus = [],
    // status = [],
    search,
    date,
  }: {
    paymentStatus?: string[];
    // status?: string[];
    search?: string;
    date?: string;
  }) {
    let reservations = [...this.records];
    console.log('Filter date from query:', date);
    console.log('Sample dates from data:', reservations.slice(0, 5).map(r => r.date));
    // Filter berdasarkan status pembayaran
    if (paymentStatus.length > 0) {
      reservations = reservations.filter((reservation) =>
        paymentStatus.includes(reservation.paymentStatus)
      );
    }

    // Filter tanggal
    if (date) {
      reservations = reservations.filter(
        (r) => r.date === date
      );
    }

    // Pencarian di berbagai field
    if (search) {
      reservations = matchSorter(reservations, search, {
        keys: ['name', 'fieldTime', 'date']
      });
    }
    
    return reservations;
  },

  // Ambil reservasi dengan pagination
  async getReservations({
    page = 1,
    limit = 10,
    paymentStatus,
    search,
    date,
  }: {
    page?: number;
    limit?: number;
    paymentStatus?: string;
    search?: string;
    date?: string;
  }) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

    const paymentStatusArray = paymentStatus ? paymentStatus.split('.') : [];
    // const statusArray = status ? status.split('.') : [];
    const allReservations = await this.getAll({
      paymentStatus: paymentStatusArray,
      search,
      date
    });
    const totalReservations = allReservations.length;

    // Logika pagination
    const offset = (page - 1) * limit;
    const paginatedReservations = allReservations.slice(offset, offset + limit);

    // Waktu saat ini
    const currentTime = new Date().toISOString();

    // Kembalikan respons dengan pagination
    return {
      success: true,
      time: currentTime,
      message: 'Data reservasi untuk keperluan testing',
      total_reservations: totalReservations,
      offset,
      limit,
      reservations: paginatedReservations
    };
  },

  async getReservationById(id: number) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

    const reservation = this.records.find((reservation) => reservation.reservationId === id);

    if (!reservation) {
      return {
        success: false,
        message: `Reservasi dengan ID ${id} tidak ditemukan`
      };
    }

    // Waktu saat ini
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Reservasi dengan ID ${id} ditemukan`,
      reservation
    };
  }
};

// Inisialisasi reservasi contoh
fakeReservations.initialize();

// Set a fixed seed untuk konsistensi
faker.seed(123);


// Mock member data store
export const fakeMembers = {
  records: [] as Member[], // Menyimpan daftar objek member

  // Inisialisasi dengan data contoh
  initialize() {
    const sampleMembers: Member[] = [];
    
    // Daftar nama lapangan
    const fieldNames = [
      'Lapangan Futsal Utama',
      'Lapangan Badminton A',
      'Lapangan Basket Kota',
      'Lapangan Voli Stadion',
      'Lapangan Tennis Center',
      'Lapangan Sepak Bola Mini',
      'Lapangan Handball Profesional'
    ];

    // Daftar hari
    const dayNames = [
      'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'
    ];

    function generateRandomMemberData(memberId: number): Member {
      // Generate tanggal dasar
      const createDate = new Date('2024-01-01');
      createDate.setDate(createDate.getDate() + (memberId * 3)); // Variasi tanggal

      // Hitung tanggal valid until (30 hari setelah create)
      const validUntilDate = new Date(createDate);
      validUntilDate.setDate(validUntilDate.getDate() + 30);

      // Format tanggal
      function formatDate(date: Date): string {
        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      }

      // Generate nama dan data pribadi
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      // Pilih lapangan dan jam secara deterministik
      const selectedField = fieldNames[memberId % fieldNames.length];
      const startHour = 9 + (memberId % 10); // Jam mulai antara 9-18
      const endHour = startHour + 2;

      return {
        memberId,
        username: faker.internet.username({
          firstName: firstName,
          lastName: lastName
        }),
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({
          firstName: firstName,
          lastName: lastName
        }),
        phone: `+62 8${faker.string.numeric(9)}`,
        day: dayNames[memberId % dayNames.length],
        validUntil: formatDate(validUntilDate),
        fieldTime: `${selectedField} (${startHour}.00 - ${endHour}.00)`,
        create_at: formatDate(createDate)
      };
    }

    // Generate 50 member
    for (let i = 1; i <= 50; i++) {
      sampleMembers.push(generateRandomMemberData(i));
    }

    this.records = sampleMembers;
  },

  // Ambil semua member dengan filter opsional
  async getAll({
    day = [],
    search
  }: {
    day?: string[];
    search?: string;
  }) {
    let members = [...this.records];

    // Filter berdasarkan hari
    if (day.length > 0) {
      members = members.filter((member) =>
        day.includes(member.day)
      );
    }

    // Pencarian di berbagai field
    if (search) {
      members = matchSorter(members, search, {
        keys: ['username', 'name', 'email', 'phone']
      });
    }

    return members;
  },

  // Ambil member dengan pagination
  async getMembers({
    page = 1,
    limit = 10,
    day,
    search
  }: {
    page?: number;
    limit?: number;
    day?: string;
    search?: string;
  }) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

    const dayArray = day ? day.split('.') : [];
    const allMembers = await this.getAll({
      day: dayArray,
      search
    });
    const totalMembers = allMembers.length;

    // Logika pagination
    const offset = (page - 1) * limit;
    const paginatedMembers = allMembers.slice(offset, offset + limit);

    // Waktu saat ini
    const currentTime = new Date().toISOString();

    // Kembalikan respons dengan pagination
    return {
      success: true,
      time: currentTime,
      message: 'Data member untuk keperluan testing',
      total_members: totalMembers,
      offset,
      limit,
      members: paginatedMembers
    };
  },

  // Ambil member berdasarkan ID
  async getMemberById(id: number) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

    // Cari member berdasarkan ID
    const member = this.records.find((member) => member.memberId === id);

    if (!member) {
      return {
        success: false,
        message: `Member dengan ID ${id} tidak ditemukan`
      };
    }

    // Waktu saat ini
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Member dengan ID ${id} ditemukan`,
      member
    };
  }
};

// Inisialisasi member contoh
fakeMembers.initialize();


export const fakeSchedules = {
  records: [] as Schedule[],

  initialize() {
    const sports: Schedule['sport'][] = ['Futsal', 'Badminton', 'Basketball', 'Volleyball', 'Tennis', 'Sepak Bola', 'Handball'];
    const paymentStatuses: Schedule['paymentStatus'][] = ['pending', 'down payment', 'complete'];

    const generateRandomScheduleData = (reservationId: number): Schedule => {
      const startDate = faker.date.between({ from: '2024-01-01', to: '2024-12-31' });

      return {
        reservationId,
        name: `${faker.person.firstName()} ${faker.person.lastName()}`,
        fieldTime: faker.helpers.arrayElement([
          '08:00', '09:00', '10:00', '11:00',
          '13:00', '14:00', '15:00', '16:00',
          '17:00', '18:00', '19:00', '20:00'
        ]),
        field: `Field ${faker.number.int({ min: 1, max: 5 })}`,
        sport: faker.helpers.arrayElement(sports),
        date: startDate.toISOString().split('T')[0],
        paymentStatus: faker.helpers.arrayElement(paymentStatuses)
      };
    };

    this.records = Array.from({ length: 100 }, (_, i) => generateRandomScheduleData(i + 1));
  },

  async getAll({
    sport = [],
    dateStart,
    dateEnd,
    paymentStatus = []
  }: {
    sport?: string[];
    dateStart?: string;
    dateEnd?: string;
    paymentStatus?: string[];
  }) {
    let schedules = [...this.records];

    if (sport.length > 0) {
      schedules = schedules.filter(schedule => sport.includes(schedule.sport));
    }

    if (dateStart && dateEnd) {
      const start = new Date(dateStart);
      const end = new Date(dateEnd);
      schedules = schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= start && scheduleDate <= end;
      });
    }

    if (paymentStatus.length > 0) {
      schedules = schedules.filter(schedule => paymentStatus.includes(schedule.paymentStatus));
    }

    return schedules;
  },

  async getSchedules({
    page = 1,
    limit = 10,
    sport,
    dateStart,
    dateEnd,
    paymentStatus
  }: {
    page?: number;
    limit?: number;
    sport?: string;
    dateStart?: string;
    dateEnd?: string;
    paymentStatus?: string;
  }) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sportArray = sport ? sport.split(',') : [];
    const paymentStatusArray = paymentStatus ? paymentStatus.split(',') : [];

    const allSchedules = await this.getAll({
      sport: sportArray,
      dateStart,
      dateEnd,
      paymentStatus: paymentStatusArray
    });

    const totalSchedules = allSchedules.length;
    const offset = Math.max((page - 1) * limit, 0);
    const paginatedSchedules = allSchedules.slice(offset, offset + limit);

    return {
      success: true,
      time: new Date().toISOString(),
      message: 'Data jadwal untuk keperluan testing',
      total_schedules: totalSchedules,
      offset,
      limit,
      schedules: paginatedSchedules
    };
  }
};

// Inisialisasi data palsu
fakeSchedules.initialize();