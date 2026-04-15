exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('authentications', {
    // Saran terbaik: Tambahkan kolom ID atau buat kolom token tidak jadi Primary Key
    token: {
      type: 'TEXT',
      notNull: true, // Tambahkan ini agar token wajib diisi
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('authentications');
};
