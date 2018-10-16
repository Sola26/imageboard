const spicedPg = require("spiced-pg");
const { dbUser, dbPassword } = require("./secrets");
// const bcrypt = require('bcryptjs');
// console.log(dbUser, dbPassword);
const dburl = process.env.DATABASE_URL || `postgres:${dbUser}:${dbPassword}@localhost:5432/imageboard`;
const db = spicedPg(dburl);



exports.getImages = function() {
    const q = `
  SELECT url, title
  FROM images
  `;

    return db.query(q);
};

exports.uploadImages = function uploadImages(url, title, description, username) {
    const q = `
    INSERT INTO images (url, title, description, username) VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const params = [url|| null, title || null, description || null, username || null];
    return db.query(q, params);
}
