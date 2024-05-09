import {
  RefreshTokenModel,
  PasswordModel,
  Callback,
  Client,
  Falsey,
  RefreshToken,
  Token,
  User,
  OAuthError,
} from "oauth2-server";
import db from "../database/index.js";
import sign from "jsonwebtoken/sign.js";
import verify from "jsonwebtoken/verify.js";
import { addMilliseconds } from "date-fns";
import crypto from "crypto";

export class OAuthModel implements RefreshTokenModel, PasswordModel {
  generateRefreshToken(
    client: Client,
    user: User,
    scope: string | string[],
    callback: Callback<string>
  ): Promise<string> {
    const now = Date.now();
    const token = sign(
      {
        userId: user.userId,
        exp: addMilliseconds(now, 60 * 60).getTime(),
        iat: now,
      },
      client.secret
    );
    callback(null, token);
    return Promise.resolve(token);
  }
  async getRefreshToken(
    refreshToken: string,
    callback: Callback<RefreshToken>
  ): Promise<RefreshToken | Falsey> {
    const token = await db.refreshTokens.findFirst({ where: { refreshToken } });
    if (!token) {
      callback(new OAuthError("token无效"));
      return;
    }
    const client = await db.clients.findUnique({
      where: { clientId: token?.clientId },
      select: { clientId: true, clientSecret: true, grants: true },
    });
    if (!client || !verify(refreshToken, client!.clientSecret)) {
      callback(new OAuthError("token无效"));
      return;
    }
    const user = await db.users.findUnique({
      where: { userId: token.userId },
      select: {
        userId: true,
        username: true,
        email: true,
        phone: true,
        avatar: true,
      },
    });
    const rToken = {
      refreshToken,
      refreshTokenExpiresAt: token.expiresAt,
      client: { id: client.clientId, grants: client.grants.split(",") },
      user: user!,
    };
    callback(null, rToken);
    return Promise.resolve(rToken);
  }
  async revokeToken(
    token: RefreshToken | Token,
    callback: Callback<boolean>
  ): Promise<boolean> {
    try {
      await db.accessTokens.delete({ where: { userId: token.user.userId } });
    } catch (error) {
      console.log(error)
    }
    callback(null, true);
    return Promise.resolve(true);
  }
  async getUser(
    username: string,
    password: string,
    callback: Callback<User | Falsey>
  ): Promise<User | Falsey> {
    const { password: realPwd, ...user } =
      (await db.users.findFirst({
        where: { OR: [{ username }, { email: username }, { phone: username }] },
        select: {
          id: true,
          userId: true,
          username: true,
          email: true,
          phone: true,
          avatar: true,
          password: true,
        },
      })) ?? {};
    const pwd = crypto
      .createHmac("sha256", username)
      .update(password)
      .digest("hex");
    callback(
      realPwd !== pwd ? new OAuthError("用户名或密码错误!") : null,
      user
    );
    return Promise.resolve(user);
  }
  validateScope?(
    user: User,
    client: Client,
    scope: string | string[],
    callback: Callback<string | false | 0 | null | undefined>
  ): Promise<string | false | 0 | string[] | null | undefined> {
    console.log("🔥validateScope");
    callback(null, "base_info");
    return Promise.resolve("base_info");
  }
  generateAccessToken(
    client: Client,
    user: User,
    scope: string | string[],
    callback: Callback<string>
  ): Promise<string> {
    const now = Date.now();
    const token = sign(
      {
        userId: user.userId,
        exp: addMilliseconds(now, 60 * 30).getTime(),
        iat: now,
      },
      client.secret
    );
    callback(null, token);
    return Promise.resolve(token);
  }
  async getClient(
    clientId: string,
    clientSecret: string,
    callback: Callback<Client | Falsey>
  ): Promise<Client | Falsey> {
    const client = await db.clients.findUnique({
      where: { clientId, clientSecret },
      select: { grants: true },
    });
    if (!client) {
      callback(new OAuthError("登录信息有误！"));
      return;
    }
    callback(null, {
      id: clientId,
      secret: clientSecret,
      grants: client.grants.split(","),
    });
    return Promise.resolve({
      id: clientId,
      secret: clientSecret,
      grants: ["password"],
    });
  }
  async saveToken(
    token: Token,
    client: Client,
    user: User,
    callback: Callback<Token>
  ): Promise<Falsey | Token> {
    const newToken = { ...token, client, user };
    try {
      await db.accessTokens.delete({ where: { userId: user.userId } });
      await db.refreshTokens.delete({ where: { userId: user.userId } });
    } catch (e) {
      console.log("不存在记录");
    }
    console.log('++++++++++++++++++++')
    console.log(newToken)
    console.log('++++++++++++++++++++')
    await db.accessTokens.create({
      data: {
        accessToken: newToken.accessToken,
        clientId: client.id,
        userId: user.userId,
        expiresAt: token.accessTokenExpiresAt!,
      },
    });
    await db.refreshTokens.create({
      data: {
        refreshToken: newToken.refreshToken!,
        clientId: client.id,
        userId: user.userId,
        expiresAt: token.refreshTokenExpiresAt!,
      },
    });
    callback(null, newToken);
    return Promise.resolve(newToken);
  }
  async getAccessToken(
    accessToken: string,
    callback?: Callback<Token>
  ): Promise<Falsey | Token> {
    const token = await db.accessTokens.findFirst({ where: { accessToken } })
    if (!token) {
      callback?.(new OAuthError("token无效"));
      return;
    }
    const client = await db.clients.findUnique({
      where: { clientId: token?.clientId },
      select: { clientId: true, clientSecret: true, grants: true },
    });
    if (!client || !verify(accessToken, client!.clientSecret)) {
      callback?.(new OAuthError("token无效"));
      return;
    }
    const user = await db.users.findUnique({
      where: { userId: token.userId },
      select: {
        userId: true,
        username: true,
        email: true,
        phone: true,
        avatar: true,
      },
    });
    const aToken = {
      accessToken,
      accessTokenExpiresAt: token.expiresAt,
      client: { id: client.clientId, grants: client.grants.split(",") },
      user: user!,
    };
    callback?.(null, aToken);
    return Promise.resolve(aToken);
  }
  verifyScope(
    token: Token,
    scope: string | string[],
    callback?: Callback<boolean> | undefined
  ): Promise<boolean> {
    console.log("🔥verifyScope");
    throw new Error("Method not implemented.");
  }
}
