const pool = require('../../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({ id = 'thread-123', title = 'sebuah thread', body = 'sebuah body', owner = 'user-123', date = new Date() }) {
    await pool.query({
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, date],
    });
  },

  async findThreadById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    });
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE threads RESTART IDENTITY CASCADE');
  },
};

module.exports = ThreadsTableTestHelper;
