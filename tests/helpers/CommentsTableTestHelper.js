const pool = require('../../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({ 
    id = 'comment-123', 
    threadId = 'thread-123', 
    content = 'sebuah comment', 
    owner = 'user-123', 
    date = new Date(), 
    isDelete = false 
  }) {
    await pool.query({
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, threadId, content, owner, date, isDelete],
    });
  },

  async findCommentById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    });
    
    // Kembalikan objek tunggal (baris pertama) agar mudah dicek di test
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments RESTART IDENTITY CASCADE');
  },
};

module.exports = CommentsTableTestHelper;