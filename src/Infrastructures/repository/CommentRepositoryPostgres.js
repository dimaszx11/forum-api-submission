const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, NOW(), FALSE) RETURNING id, content, owner',
      values: [id, threadId, content, owner],
    };

    const result = await this._pool.query(query);
    return new AddedComment(result.rows[0]);
  }

  async verifyCommentExists(commentId) {
    const result = await this._pool.query({
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const result = await this._pool.query({
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deleteComment(commentId) {
    await this._pool.query({
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1',
      values: [commentId],
    });
  }

async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.date, comments.is_delete, 
             users.username, 
             CAST(COUNT(comment_likes.id) AS INTEGER) AS like_count
             FROM comments
             LEFT JOIN users ON comments.owner = users.id
             LEFT JOIN comment_likes ON comments.id = comment_likes.comment_id
             WHERE comments.thread_id = $1
             GROUP BY comments.id, users.username
             ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => ({
      id: row.id,
      username: row.username,
      date: row.date,
      // Logika untuk menghandle konten komentar yang dihapus
      content: row.is_delete ? '**komentar telah dihapus**' : row.content,
      likeCount: row.like_count,
    }));
  }


  async checkLikeExists(commentId, userId) {
    const query = {
      text: 'SELECT 1 FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async addLike(commentId, userId) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, userId, commentId],
    };

    await this._pool.query(query);
  }

  async deleteLike(commentId, userId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async getLikeCount(commentId) {
    const query = {
      text: 'SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = CommentRepositoryPostgres;
