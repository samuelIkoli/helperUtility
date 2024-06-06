import express, { RequestHandler, Request, Response } from "express";
import { knex } from "../knexfile";

export const ping = (req: Request, res: Response) => {
  return res.send("Pinging is working");
};

export const getHelpers: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const helpers = await knex("help").where("deleted_flag", 0);
    // console.log(user)
    return res.status(200).json({
      message: "Success",
      helpers,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

export const createHelper: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { language_code, slug, text, created_by, modified_by } = req.body;
  if (!language_code || !slug || !text || !created_by || !modified_by)
    return res
      .status(400)
      .json({ error: "Input all fields, some fields are missing!" });
  const newHelp = {
    language_code,
    slug,
    text,
    created_on: new Date(Date.now()),
    created_by,
    modified_on: new Date(Date.now()),
    modified_by,
  };
  try {
    const helpers = await knex("help").insert(newHelp);
    // console.log(user)
    return res.status(200).json({
      message: "Success",
      helpers,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};
