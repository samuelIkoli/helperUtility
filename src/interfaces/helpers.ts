export interface createAid {
  language_code?: string;
  slug: string;
  text: string;
  created_by: string;
}

export const isCreateAid = (body: any): body is createAid => {
  return (
    (typeof body.language_code === "string" ||
      typeof body.language_code === "undefined") &&
    typeof body.slug === "string" &&
    typeof body.text === "string" &&
    typeof body.created_by === "string"
  );
};

export interface updateAid {
  language_code?: string;
  text?: string;
  modified_by?: string;
}

export const isUpdateteAid = (body: any): body is createAid => {
  return (
    (typeof body.language_code === "string" ||
      typeof body.language_code === "undefined") &&
    typeof body.text === "string" &&
    typeof body.modified_by === "string"
  );
};
