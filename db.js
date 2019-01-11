const spicedPg = require("spiced-pg");
const { dbUser, dbPassword } = require("./secrets");
// const bcrypt = require('bcryptjs');
// console.log(dbUser, dbPassword);
const dburl =
  process.env.DATABASE_URL ||
  `postgres:${dbUser}:${dbPassword}@localhost:5432/imageboard`;
const db = spicedPg(dburl);

exports.getImages = function() {
  const q = `
  SELECT url, title, id
  FROM images
  ORDER BY id DESC LIMIT 3
  `;

  return db.query(q);
};

exports.uploadImages = function uploadImages(
  url,
  title,
  description,
  username
) {
  const q = `
    INSERT INTO images (url, title, description, username) VALUES ($1, $2, $3, $4) RETURNING *
    `;
  const params = [
    url || null,
    title || null,
    description || null,
    username || null
  ];
  return db.query(q, params);
};

exports.imageAppear = function imageApear(id) {
  const q = `
    SELECT *
    FROM images
    WHERE id = $1
    `;
  const params = [id || null];
  return db.query(q, [id]);
};

exports.getComments = function getComments(image_id) {
  const q = `
    SELECT *
    FROM comments
    WHERE image_id = $1
    ORDER BY id DESC
    `;
  const params = [image_id || null];
  return db.query(q, params);
};

module.exports.saveComment = function(comment, username, image_id) {
  const q = `
        INSERT INTO comments (comment, username, image_id)
        VALUES ($1, $2, $3) RETURNING *
    `;
  const params = [comment || null, username || null, image_id || null];
  return db.query(q, params);
};

module.exports.getMore = function(id) {
  const q = `
    SELECT *
    FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 4;
    `;
  const params = [id || null];
  return db.query(q, params);
};

// module.exports.deleteImage = function(id) {
//   const q = `DELETE FROM images CASCADE WHERE id = $1 RETURNING *`;
//   const params = [id || null];
//   return db.query(q, params);
// };

exports.deleteImage = function(id) {
  return db
    .query(`DELETE FROM images CASCADE WHERE id = $1 RETURNING *`, [id])
    .then(result => {
      return result.rows[0];
    });
};

exports.deleteComments = function(id) {
  return db
    .query(`DELETE FROM comments CASCADE WHERE user_id = $1 RETURNING *`, [id])
    .then(result => {
      return result.rows[0];
    });
};
