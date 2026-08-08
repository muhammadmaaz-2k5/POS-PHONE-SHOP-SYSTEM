import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'itomku0j',
  api_key: '943764431136496',
  api_secret: 'CzMT-GZtRRTso6cPBhdW8BFkmVE',
});

const prisma = new PrismaClient();

const DUMMY_PRODUCTS = [
  {
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    model: '15 Pro Max',
    category: 'Smartphones',
    imei: '358912091234567',
    ram: '8GB',
    storage: '256GB',
    color: 'Natural Titanium',
    purchasePrice: 1000.00,
    sellingPrice: 1199.99,
    stock: 25,
    minimumStock: 5,
    sourceImage: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    model: 'S24 Ultra',
    category: 'Smartphones',
    imei: '358912091234568',
    ram: '12GB',
    storage: '512GB',
    color: 'Titanium Black',
    purchasePrice: 950.00,
    sellingPrice: 1299.99,
    stock: 20,
    minimumStock: 4,
    sourceImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
  },
  {
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    model: 'Pixel 8 Pro',
    category: 'Smartphones',
    imei: '358912091234569',
    ram: '12GB',
    storage: '128GB',
    color: 'Obsidian',
    purchasePrice: 700.00,
    sellingPrice: 999.00,
    stock: 15,
    minimumStock: 5,
    sourceImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
  },
  {
    name: 'OnePlus 12',
    brand: 'OnePlus',
    model: '12',
    category: 'Smartphones',
    imei: '358912091234570',
    ram: '16GB',
    storage: '512GB',
    color: 'Flowy Emerald',
    purchasePrice: 650.00,
    sellingPrice: 899.99,
    stock: 12,
    minimumStock: 3,
    sourceImage: 'https://images.unsplash.com/photo-1613688270362-8b26189c0782?w=800&q=80',
  },
  {
    name: 'iPhone 14',
    brand: 'Apple',
    model: '14',
    category: 'Smartphones',
    imei: '358912091234571',
    ram: '6GB',
    storage: '128GB',
    color: 'Midnight',
    purchasePrice: 600.00,
    sellingPrice: 799.00,
    stock: 30,
    minimumStock: 10,
    sourceImage: 'https://images.unsplash.com/photo-1678685887225-32219962f3cd?w=800&q=80',
  },
  {
    name: 'Samsung Galaxy A54',
    brand: 'Samsung',
    model: 'A54 5G',
    category: 'Smartphones',
    imei: '358912091234572',
    ram: '8GB',
    storage: '128GB',
    color: 'Awesome Graphite',
    purchasePrice: 300.00,
    sellingPrice: 449.99,
    stock: 45,
    minimumStock: 15,
    sourceImage: 'https://images.unsplash.com/photo-1650376249537-884c98fcebc4?w=800&q=80',
  },
  {
    name: 'AirPods Pro (2nd Gen)',
    brand: 'Apple',
    model: 'AirPods Pro 2',
    category: 'Accessories',
    imei: null,
    ram: null,
    storage: null,
    color: 'White',
    purchasePrice: 150.00,
    sellingPrice: 249.00,
    stock: 50,
    minimumStock: 10,
    sourceImage: 'https://images.unsplash.com/photo-1608156687249-a1fc82324490?w=800&q=80',
  },
  {
    name: 'Galaxy Watch 6',
    brand: 'Samsung',
    model: 'Watch 6 (44mm)',
    category: 'Accessories',
    imei: null,
    ram: null,
    storage: null,
    color: 'Graphite',
    purchasePrice: 200.00,
    sellingPrice: 299.99,
    stock: 20,
    minimumStock: 5,
    sourceImage: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
  },
  {
    name: '20W USB-C Power Adapter',
    brand: 'Apple',
    model: '20W',
    category: 'Accessories',
    imei: null,
    ram: null,
    storage: null,
    color: 'White',
    purchasePrice: 10.00,
    sellingPrice: 19.00,
    stock: 100,
    minimumStock: 20,
    sourceImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
  },
  {
    name: 'MagSafe Wireless Charger',
    brand: 'Apple',
    model: 'MagSafe',
    category: 'Accessories',
    imei: null,
    ram: null,
    storage: null,
    color: 'Silver',
    purchasePrice: 25.00,
    sellingPrice: 39.00,
    stock: 40,
    minimumStock: 10,
    sourceImage: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=800&q=80',
  }
];

const DUMMY_CUSTOMERS = [
  {
    name: 'John Doe',
    phone: '555-0101',
    email: 'john@example.com',
    address: '123 Main St, Springfield',
  },
  {
    name: 'Jane Smith',
    phone: '555-0102',
    email: 'jane@example.com',
    address: '456 Oak Ave, Metropolis',
  },
  {
    name: 'Alice Johnson',
    phone: '555-0103',
    email: 'alice@example.com',
    address: '789 Pine Rd, Gotham',
  },
  {
    name: 'Bob Brown',
    phone: '555-0104',
    email: 'bob@example.com',
    address: '321 Elm St, Star City',
  }
];

async function main() {
  console.log('🌱 Starting database seed...');
  
  // Create products
  for (const productData of DUMMY_PRODUCTS) {
    const { sourceImage, ...data } = productData;
    
    // Check if product exists by name to avoid duplicates on re-run
    const exists = await prisma.product.findFirst({ where: { name: data.name } });
    if (exists) {
      console.log(`Product ${data.name} already exists. Skipping.`);
      continue;
    }

    try {
      console.log(`☁️ Uploading image for ${data.name} to Cloudinary...`);
      const uploadResult = await cloudinary.uploader.upload(sourceImage, {
        folder: 'pos-products',
        upload_preset: 'pos-phone-shop',
      });

      console.log(`📦 Creating product ${data.name} in DB...`);
      await prisma.product.create({
        data: {
          ...data,
          imageUrl: uploadResult.secure_url,
        }
      });
      console.log(`✅ Success: ${data.name}`);
    } catch (error) {
      console.error(`❌ Failed to seed ${data.name}:`, error);
    }
  }

  console.log('👥 Seeding customers...');
  for (const customer of DUMMY_CUSTOMERS) {
    const exists = await prisma.customer.findFirst({ where: { phone: customer.phone } });
    if (exists) {
      console.log(`Customer ${customer.name} already exists. Skipping.`);
      continue;
    }
    
    try {
      await prisma.customer.create({ data: customer });
      console.log(`✅ Success: ${customer.name}`);
    } catch (error) {
      console.error(`❌ Failed to seed ${customer.name}:`, error);
    }
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
