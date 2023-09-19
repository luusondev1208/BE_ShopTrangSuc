const cloudinary = require('cloudinary').v2
          
cloudinary.config({ 
  cloud_name: 'dz4cezwre', 
  api_key: '161353539585881', 
  api_secret: 'lHNv_eu1hzDa9l5088k1g2bFh60' 
});

module.exports = cloudinary