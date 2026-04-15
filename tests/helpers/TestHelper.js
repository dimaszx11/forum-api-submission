const pool = require('../../src/Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('./UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('./AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('./ThreadsTableTestHelper');
const CommentsTableTestHelper = require('./CommentsTableTestHelper');

const cleanupDatabase = async () => {
  // PENTING: Hapus tabel yang memiliki foreign key paling akhir (comment_likes) terlebih dahulu
  await pool.query('DELETE FROM comment_likes WHERE 1=1'); 
  await CommentsTableTestHelper.cleanTable();
  await ThreadsTableTestHelper.cleanTable();
  await AuthenticationsTableTestHelper.cleanTable();
  await UsersTableTestHelper.cleanTable();
};

const closePool = async () => {
  await pool.end();
};

module.exports = { cleanupDatabase, closePool };