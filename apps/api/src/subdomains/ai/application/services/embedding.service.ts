import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Sermon search using PostgreSQL full-text search (tsvector).
 * Searches across sermon transcripts, summaries, tags, and titles.
 *
 * This can be upgraded to pgvector cosine similarity search later
 * by adding an embedding provider (e.g., Voyage AI).
 */
@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Search sermons by text query using PostgreSQL full-text search
   * Searches across: sermon title, metadata summary, tags, transcript
   */
  async searchSermons(query: string, limit: number = 10): Promise<{
    sermonId: string;
    title: string;
    summary: string | null;
    rank: number;
  }[]> {
    this.logger.log(`Searching sermons for: "${query}"`);

    const results = await this.dataSource.query(
      `
      SELECT
        s.id as "sermonId",
        s.title,
        sm.summary,
        ts_rank(
          to_tsvector('english', COALESCE(s.title, '') || ' ' || COALESCE(sm.summary, '') || ' ' || COALESCE(sm.transcript_text, '') || ' ' || COALESCE(array_to_string(sm.tags, ' '), '')),
          plainto_tsquery('english', $1)
        ) as rank
      FROM sermons s
      LEFT JOIN sermon_metadata sm ON sm.sermon_id = s.id
      WHERE
        s.status = 'published'
        AND s.deleted_at IS NULL
        AND (
          to_tsvector('english', COALESCE(s.title, '') || ' ' || COALESCE(sm.summary, '') || ' ' || COALESCE(sm.transcript_text, '') || ' ' || COALESCE(array_to_string(sm.tags, ' '), ''))
          @@ plainto_tsquery('english', $1)
        )
      ORDER BY rank DESC
      LIMIT $2
      `,
      [query, limit],
    );

    this.logger.log(`Found ${results.length} matching sermons`);
    return results;
  }

  /**
   * Find sermons similar to a given sermon (by shared tags/content)
   */
  async findSimilar(sermonId: string, limit: number = 5): Promise<{
    sermonId: string;
    title: string;
    summary: string | null;
  }[]> {
    const results = await this.dataSource.query(
      `
      SELECT
        s2.id as "sermonId",
        s2.title,
        sm2.summary
      FROM sermon_metadata sm1
      JOIN sermon_metadata sm2 ON sm1.sermon_id != sm2.sermon_id
      JOIN sermons s2 ON s2.id = sm2.sermon_id AND s2.status = 'published' AND s2.deleted_at IS NULL
      WHERE sm1.sermon_id = $1
        AND sm1.tags IS NOT NULL
        AND sm2.tags IS NOT NULL
        AND sm1.tags && sm2.tags
      ORDER BY array_length(
        ARRAY(SELECT unnest(sm1.tags) INTERSECT SELECT unnest(sm2.tags)),
        1
      ) DESC NULLS LAST
      LIMIT $2
      `,
      [sermonId, limit],
    );

    return results;
  }
}
