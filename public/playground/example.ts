import { query, table, column as col } from "typesafe-query-builder";
import { db, show } from "playground";

export const Manufacturers = table("classicgames.manufacturers", {
  id: col("id").integer().primary().default(),
  name: col("name").string(),
  country: col("country").string(),
});

export const Systems = table("classicgames.systems", {
  id: col("id").integer().primary().default(),
  name: col("name").string(),
  year: col("year").integer(),
  manufacturerId: col("manufacturer_id").integer(),
});

const res = await query(Manufacturers).select(Manufacturers.all()).fetch(db);

show(res);
