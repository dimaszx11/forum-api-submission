const pool = require('../../src/Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('./UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('./AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('./ThreadsTableTestHelper');
const CommentsTableTestHelper = require('./CommentsTableTestHelper');

const cleanupDatabase = async () => {
  // 1. Hapus 'comment_likes' karena dia merujuk ke Comments & Users
  await pool.query('DELETE FROM comment_likes WHERE 1=1'); 
  
  // 2. Hapus 'comments' karena dia merujuk ke Threads & Users
  await CommentsTableTestHelper.cleanTable();
  
  // 3. Hapus 'threads' karena dia merujuk ke Users
  await ThreadsTableTestHelper.cleanTable();
  
  // 4. Baru hapus tabel utama (Users & Authentications)
  await AuthenticationsTableTestHelper.cleanTable();
  await UsersTableTestHelper.cleanTable();
};

const closePool = async () => {
  await pool.end();
};

module.exports = { cleanupDatabase, closePool };