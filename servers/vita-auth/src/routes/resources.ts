import HyperExpress from "hyper-express";
import db from "../database";
import { uuid } from "@vita/common/utils";
import { StatusCodes } from "@vita/common/http";
import { zodValidate } from "../middleware";
import z from "zod";

const router = new HyperExpress.Router();

router.post(
  "/",
  zodValidate({
    body: z.object({
      resourceCode: z.string({ required_error: "资源编码不能为空" }),
      parentId: z.number().nullable().optional(),
      resourceName: z
        .string({ required_error: "资源名不能为空" })
        .min(2, "资源名最少2位")
        .max(50, "资源名不能超过50位"),
      resourceType: z.number({ required_error: "资源类型不能为空" }),
      resourcePath: z.string({ required_error: "资源路径不能为空" }),
      resourceIcon: z.string().optional(),
    }),
  }),
  async (req, res) => {
    const data = await req.json();
    await db.resources.create({
      data: { ...data, resourceId: `VR${uuid()}` },
    });
    res.status(StatusCodes.CREATED).send();
  }
);

router.patch(
  "/",
  zodValidate({
    body: z.object({
      id: z.number({ required_error: "资源ID不能为空" }),
      resourceCode: z.string().optional(),
      parentId: z.number().nullable().optional(),
      resourceName: z
        .string()
        .min(2, "资源名最少2位")
        .max(50, "资源名不能超过50位")
        .optional(),
      resourcePath: z.string().optional(),
      resourceIcon: z.string().optional(),
    }),
  }),
  async (req, res) => {
    const { id, ...data } = await req.json();
    await db.resources.update({
      data,
      where: { id },
    });
    res.status(StatusCodes.CREATED).send();
  }
);

router.get("/", async (req, res) => {
  const resources = await db.resources.findMany({
    where: { status: true },
    select: {
      id: true,
      resourceId: true,
      resourceCode: true,
      resourceType: true,
      resourcePath: true,
      resourceName: true,
      resourceIcon: true,
      sort: true,
    },
  });
  return res.json(resources);
});

export default router;
