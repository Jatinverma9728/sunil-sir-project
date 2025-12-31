// Test if Cloudinary controller is actually being used
const { upload } = require('./src/controllers/uploadController');

console.log('\n🔍 Checking upload controller...\n');
console.log('Upload object:', upload);
console.log('Storage engine:', upload.storage);
console.log('Storage constructor:', upload.storage.constructor.name);

if (upload.storage.constructor.name === 'CloudinaryStorage') {
    console.log('\n✅ SUCCESS: Using CloudinaryStorage!\n');
} else if (upload.storage.constructor.name === 'DiskStorage') {
    console.log('\n❌ ERROR: Still using DiskStorage (local files)!\n');
    console.log('This means the code changes didn\'t load properly.');
    console.log('\n💡 FIX: Restart the server completely:\n');
    console.log('   1. Stop server (Ctrl+C)');
    console.log('   2. Run: npm run dev');
    console.log('\n');
} else {
    console.log('\n⚠️  UNKNOWN storage type:', upload.storage.constructor.name);
}
