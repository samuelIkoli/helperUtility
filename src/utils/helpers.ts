import { knex } from "../knexfile";

export const fetchHelper = async (slug: string, language_code?: string) => {
  const query = knex("help")
    .where({ slug, deleted_flag: 0 })
    .select("id", "slug", "text", "language_code");

  if (language_code) {
    query.andWhere({ language_code });
  }

  const helper = await query;
  return helper;
};
