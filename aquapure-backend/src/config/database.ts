import mongoose from 'mongoose';
import dns from 'dns';

// Ensure SRV records can be resolved on networks/ISPs where local DNS blocks SRV queries
const configureDnsForSrv = () => {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {
    // Ignore if not permitted
  }
};

export const connectDatabase = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aquapure';
  const localUri = 'mongodb://127.0.0.1:27017/aquapure';

  if (primaryUri.startsWith('mongodb+srv://')) {
    configureDnsForSrv();
  }

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (primaryErr: unknown) {
    if (primaryUri !== localUri) {
      console.warn('⚠️ Primary MongoDB cluster unavailable or IP not whitelisted.');
      console.log('🔄 Connecting to Local MongoDB server (mongodb://127.0.0.1:27017/aquapure)...');
      try {
        const localConn = await mongoose.connect(localUri, {
          serverSelectionTimeoutMS: 3000
        });
        console.log(`✅ Connected to Local MongoDB: ${localConn.connection.host}`);
        console.log(`📊 Database: ${localConn.connection.name}`);
        return;
      } catch (localErr) {
        console.error('❌ Failed to connect to local MongoDB fallback:', localErr);
      }
    }
    console.error('❌ MongoDB connection error:', primaryErr);
    throw primaryErr;
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});
