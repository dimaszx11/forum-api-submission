const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../../../src/Infrastructures/security/BcryptPasswordHash');
const AuthenticationError = require('../../../src/Commons/exceptions/AuthenticationError');

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const hashedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof hashedPassword).toEqual('string');
      expect(hashedPassword).not.toEqual('plain_password');
      expect(spyHash).toBeCalledWith('plain_password', 10);
      
      spyHash.mockRestore(); // Bersihkan spy setelah digunakan
    });
  });

  describe('comparePassword function', () => {
    it('should throw AuthenticationError when password not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Action & Assert
      await expect(bcryptPasswordHash.compare('wrong_password', encryptedPassword))
        .rejects.toThrowError(AuthenticationError);
    });

    it('should not throw AuthenticationError when password match', async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const plainPassword = 'plain_password';
      const encryptedPassword = await bcryptPasswordHash.hash(plainPassword);

      // Action & Assert
      await expect(bcryptPasswordHash.compare(plainPassword, encryptedPassword))
        .resolves.not.toThrowError(AuthenticationError);
      
      // Verifikasi parameter sesuai permintaan reviewer
      expect(spyCompare).toBeCalledWith(plainPassword, encryptedPassword);
      
      spyCompare.mockRestore();
    });
  });
});