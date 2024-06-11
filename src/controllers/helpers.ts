import express, {
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import { knex } from "../knexfile";
import { fetchHelper } from "../utils/helpers";
import {
  createAid,
  isCreateAid,
  updateAid,
  isUpdateteAid,
} from "../interfaces/helpers";

const getResponse = (data: object) => {
  return {
    status: "success",
    message: "Information returned successfully",
    data,
  };
};

export const ping = (req: Request, res: Response) => {
  return res.send("Pinging is working");
};

export const getHelpers: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const helpers = await knex("help")
      .where("deleted_flag", 0)
      .select("id", "slug", "language_code", "text");
    return res.status(200).json(getResponse(helpers));
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

export const getHelpersByLanguage: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { language_code } = req.params;
    const helpers = await knex("help")
      .where({ deleted_flag: 0, language_code })
      .select("id", "slug", "text", "language_code");
    if (!helpers.length) {
      return res.status(404).json({ error: "Resources not found" });
    }
    return res.status(200).json(getResponse(helpers));
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

export const getHelper: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { slug } = req.params;
    if (!slug || typeof slug !== "string" || slug == ":slug") {
      return res.status(400).json({
        error: "You didn't pass in a slug or slug is not of type string",
      });
    }
    const helper = await fetchHelper(slug);
    if (!helper.length) {
      return res.status(404).json({ error: "Resource not found" });
    }
    return res.status(200).json(getResponse(helper));
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

export const getHelperByLanguage: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    let { slug, language_code } = req.params;
    if (typeof slug !== "string" || typeof language_code !== "string") {
      return res.status(400).json({
        error: "Both slug and language code must be of type string",
      });
    }
    if (language_code === ":language_code" || !language_code) {
      language_code = "";
      const response = await fetchHelper(slug, language_code);
      return res.status(200).json({ message: "Success", helper: response });
    }
    const helper = await knex("help")
      .where({ slug, deleted_flag: 0, language_code })
      .select("id", "slug", "text", "language_code");
    if (!helper.length) {
      return res.status(404).json({ error: "Resource not found" });
    }
    return res.status(200).json(getResponse(helper));
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

export const createHelper: RequestHandler = async (
  req: Request,
  res: Response
) => {
  if (!isCreateAid(req.body)) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  let { language_code, slug, text, created_by } = req.body;
  if (!slug || !text || !created_by)
    return res
      .status(400)
      .json({ error: "Input all fields, some fields are missing!" });
  if (!language_code || language_code.length < 2) {
    language_code = "EN";
  }
  const today = new Date(Date.now());
  const newHelp = {
    language_code,
    slug,
    text,
    created_on: today,
    created_by,
    modified_on: today,
    modified_by: created_by,
  };
  try {
    const helper = await knex("help")
      .insert(newHelp)
      .onConflict("slug")
      .ignore();
    if (!helper[0]) {
      return res
        .status(409)
        .json({ error: "Entry already exists for that slug" });
    }
    return res.status(201).json({
      message: "Success",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "An error occured while creating resource, please contact support",
    });
  }
};

export const updateHelper: RequestHandler = async (
  req: Request,
  res: Response
) => {
  let { language_code, text, modified_by } = req.body;
  const { slug } = req.params;
  if (!Object.keys(req.body).length)
    return res.status(400).json({ error: "No request body found" });
  if (!isUpdateteAid(req.body)) {
    return res.status(400).json({
      error: "Invalid request body, pass in text and modified_by as strings",
    });
  }
  if (!slug || slug === ":slug")
    return res.status(400).json({ error: "Input slug, slug is missing!" });
  const newHelp = {
    ...req.body,
    modified_on: new Date(Date.now()),
  };
  try {
    // const exists =
    const helper = await knex("help")
      .where({ slug })
      .update(newHelp)
      .onConflict("slug")
      .ignore();
    if (!helper) {
      return res.status(404).json({ error: "Resource not found" });
    }
    return res.status(201).json({
      message: "Success",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "An error occured while updating resource, please contact support",
    });
  }
};

export const deleteHelper: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { slug } = req.params;
    const deletion = {
      deleted_flag: 1,
      deleted_on: new Date(Date.now()),
      deleted_by: req.body.deleted_by,
    };
    const helper = await knex("help")
      .where({ slug, deleted_flag: 0 })
      .update(deletion);
    if (!helper) {
      return res
        .status(404)
        .json({ error: "Resource not found, unable to delete" });
    }
    return res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};
