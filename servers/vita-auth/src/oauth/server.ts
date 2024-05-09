import OAuth2Server from "oauth2-server";
import { OAuthModel } from "./model";

export const model = new OAuthModel()

export default new OAuth2Server({
  model,
  accessTokenLifetime: 60 * 60 * 24, // 24 hours, or 1 day
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
});
