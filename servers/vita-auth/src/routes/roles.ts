import HyperExpress from "hyper-express";
import db, { enforccer } from "../database";
import { uuid } from "@vita/common/utils";
import { StatusCodes } from "@vita/common/http";
import { zodValidate } from "../middleware";
import z from "zod";
import httpError from '@vita/common/exception'

const router = new HyperExpress.Router();

router.post(
  "/",
  zodValidate({
    body: z.object({
      roleName: z
        .string({ required_error: "角色名不能为空" })
        .min(2, "角色名最少2位")
        .max(50, "角色名不能超过50位"),
      description: z.string({ required_error: "角色类型不能为空" }),
    }),
  }),
  async (req, res) => {
    const data = await req.json();
    await db.roles.create({
      data: { ...data, roleId: `VR${uuid()}` },
    });
    res.status(StatusCodes.CREATED).send();
  }
);

router.get("/:id/resources", async (req, res) => {
  const id = +req.params.id;
  if (isNaN(id) || id == 0) throw new httpError.BadRequest("ID不能为空");
  const rules = await enforccer.getFilteredNamedPolicy('p', 0, `r:${id}`);
  res.json(rules);
});

router.post(
  "/resources",
  zodValidate({
    body: z.object({
      roleId: z.number({ required_error: "角色ID不能为空" }),
      resources: z.array(z.number({ required_error: "功能ID不能为空" })),
    }),
  }),
  async (req, res) => {
    const { roleId, resources } = await req.json();
    await enforccer.addPolicies(resources.map((res) => [`r:${roleId}`, res.toString(), "read"]));
    res.status(StatusCodes.CREATED).send();
  }
);

router.get("/", async (req, res) => {
  const roles = await db.roles.findMany({
    where: { status: true },
    select: {
      id: true,
      roleId: true,
      roleName: true,
      description: true,
      sort: true,
    },
  });
  return res.json(roles);
});

export default router;
