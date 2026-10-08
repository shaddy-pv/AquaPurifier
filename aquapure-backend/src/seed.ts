import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import User from './models/User';
import Product from './models/Product';
import Review from './models/Review';
import mongoose from 'mongoose';

dotenv.config();

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await connectDatabase();

    // 1. Seed Users
    console.log('Seeding users...');
    const adminEmail = 'admin@aquapure.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = await User.create({
        name: 'AquaPure Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@AquaPure2025!',
        phone: '+91 9876543210',
        role: 'admin',
        isVerified: true,
        addresses: [{
          type: 'office',
          street: '101 Aqua Heights, Technology Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true
        }]
      });
      console.log('✅ Admin user created: admin@aquapure.com');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    const customerEmail = 'customer@aquapure.com';
    let customer = await User.findOne({ email: customerEmail });

    if (!customer) {
      customer = await User.create({
        name: 'Priya Sharma',
        email: customerEmail,
        password: 'Customer@AquaPure2025!',
        phone: '+91 9812345678',
        role: 'customer',
        isVerified: true,
        addresses: [{
          type: 'home',
          street: 'Flat 402, Sunshine Residency',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          isDefault: true
        }]
      });
      console.log('✅ Demo customer created: customer@aquapure.com');
    }

    // 2. Seed Products
    console.log('Seeding products...');
    const initialProducts = [
      {
        name: 'AquaPure Pro Max 9L RO Water Purifier',
        slug: 'aquapure-pro-max-9l-ro',
        description: 'The AquaPure Pro Max features advanced 9-stage purification that removes all harmful contaminants while retaining essential minerals. With UV sterilization and UF membrane, it ensures 100% safe drinking water for your family.',
        price: 18999,
        originalPrice: 24999,
        category: 'ro',
        images: ['/placeholder.svg'],
        features: [
          '9-Stage Advanced Purification Process',
          'Mineral Retention Technology',
          'UV + UF + RO Triple Protection',
          '9 Liters Storage Capacity',
          'Digital Display with Filter Alerts',
          'Energy Efficient Operation'
        ],
        specifications: new Map([
          ['Storage Capacity', '9 Liters'],
          ['Purification Technology', 'RO + UV + UF'],
          ['Purification Stages', '9 Stages'],
          ['Power Consumption', '60 Watts'],
          ['Warranty', '1 Year Comprehensive + 3 Years on Membrane']
        ]),
        stock: 45,
        rating: 4.8,
        reviewCount: 124,
        isActive: true
      },
      {
        name: 'AquaPure Under-Sink Compact RO System',
        slug: 'aquapure-under-sink-compact-ro',
        description: 'Space-saving under-sink water purifier designed for modern kitchens. Features high-flow filtration, automatic membrane flushing, and sleek European tap design.',
        price: 12999,
        originalPrice: 16999,
        category: 'ro',
        images: ['/placeholder.svg'],
        features: [
          'Space-Saving Under-Sink Design',
          '6-Stage Advanced Filtration',
          'Auto-Flush Technology',
          'Stainless Steel Faucet Included',
          'Leak Detection Sensor'
        ],
        specifications: new Map([
          ['Storage Capacity', '8 Liters Hydro-Pneumatic Tank'],
          ['Purification Technology', 'RO + Post Carbon'],
          ['Purification Stages', '6 Stages'],
          ['Power Consumption', '45 Watts']
        ]),
        stock: 30,
        rating: 4.6,
        reviewCount: 88,
        isActive: true
      },
      {
        name: 'AquaPure Smart Connect WiFi Water Purifier',
        slug: 'aquapure-smart-connect-wifi',
        description: 'Smart IoT enabled water purifier with real-time TDS and water quality tracking directly from your smartphone app. Automated filter replacement ordering.',
        price: 25999,
        originalPrice: 32999,
        category: 'ro',
        images: ['/placeholder.svg'],
        features: [
          'WiFi Connectivity & Smart App Control',
          'Real-time TDS & Water Purity Monitoring',
          'Filter Life Tracking & Auto Replenishment',
          'Zero Water Wastage Technology',
          'Alkaline Mineral Booster'
        ],
        specifications: new Map([
          ['Storage Capacity', '10 Liters'],
          ['Purification Technology', 'RO + UV + Alkaline'],
          ['Connectivity', '2.4 GHz WiFi'],
          ['Warranty', '2 Years Comprehensive']
        ]),
        stock: 25,
        rating: 4.9,
        reviewCount: 65,
        isActive: true
      },
      {
        name: 'AquaPure Essential 7L RO Water Purifier',
        slug: 'aquapure-essential-7l-ro',
        description: 'Reliable and affordable pure drinking water system tailored for small to mid-sized homes with high TDS water sources.',
        price: 14999,
        originalPrice: 19999,
        category: 'ro',
        images: ['/placeholder.svg'],
        features: [
          '7-Stage Purification Process',
          'Energy-Efficient Eco Mode',
          'Wall Mountable Compact Design',
          'Transparent Tank Water Level Indicator'
        ],
        specifications: new Map([
          ['Storage Capacity', '7 Liters'],
          ['Purification Technology', 'RO + UV'],
          ['Warranty', '1 Year Comprehensive']
        ]),
        stock: 50,
        rating: 4.5,
        reviewCount: 92,
        isActive: true
      },
      {
        name: 'AquaPure Premium 12L RO + UV System',
        slug: 'aquapure-premium-12l-ro-uv',
        description: 'Large capacity purification solution for large families and busy households. High recovery membrane and instant dispensing.',
        price: 22999,
        originalPrice: 28999,
        category: 'ro',
        images: ['/placeholder.svg'],
        features: [
          '12L Extra-Large Storage Capacity',
          'RO + UV + UF Dual Sterilization',
          'Touch Control Water Dispenser',
          'Food Grade BPA-Free Tank'
        ],
        specifications: new Map([
          ['Storage Capacity', '12 Liters'],
          ['Purification Technology', 'RO + UV + UF + Mineral Cartridge'],
          ['Warranty', '1 Year Comprehensive + 3 Years Membrane']
        ]),
        stock: 35,
        rating: 4.7,
        reviewCount: 54,
        isActive: true
      },
      {
        name: 'AquaPure Commercial Grade 15L System',
        slug: 'aquapure-commercial-grade-15l',
        description: 'Heavy duty commercial purification system designed for offices, clinics, cafes, and commercial spaces. Purifies up to 50 Liters per hour.',
        price: 35999,
        originalPrice: 42999,
        category: 'commercial',
        images: ['/placeholder.svg'],
        features: [
          'High Flow Commercial Grade Output',
          'Dual High-Pressure Membranes',
          'Heavy-Duty Stainless Steel Skid',
          'Continuous Operation Rated'
        ],
        specifications: new Map([
          ['Output Capacity', '50 LPH (Liters Per Hour)'],
          ['Storage Tank', '15 Liters'],
          ['Power Consumption', '120 Watts']
        ]),
        stock: 15,
        rating: 4.8,
        reviewCount: 31,
        isActive: true
      }
    ];

    for (const prodData of initialProducts) {
      const existing = await Product.findOne({ slug: prodData.slug });
      if (!existing) {
        await Product.create(prodData);
        console.log(`✅ Seeded product: ${prodData.name}`);
      } else {
        console.log(`ℹ️ Product already exists: ${prodData.name}`);
      }
    }

    console.log('\n🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
