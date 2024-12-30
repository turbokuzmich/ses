import { object, boolean, enum as enumSchema, infer as inferType } from "zod";

export const roleSchema = enumSchema(["user", "artist", "promo"], {
  message: "Пожалуйста, укажите роль",
});
export type Role = inferType<typeof roleSchema>;

export const entitySchema = enumSchema(["music", "announcements"]);
export type Entity = inferType<typeof entitySchema>;

export const entityRelationSchema = enumSchema(["viewer", "editor"]);
export type EntityRelation = inferType<typeof entityRelationSchema>;

export const checkEntitySchema = object({
  allowed: boolean(),
}).required();
export type CheckEntity = inferType<typeof checkEntitySchema>;
