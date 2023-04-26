import { ServerMiddleware } from "@nuxt/types"
import {IncomingMessage} from "connect";
import cookie from "cookie";
import {uuid4} from "@croct/sdk/uuid";

export const CID_HEADER = 'x-cid';

// 1 year
const CID_EXPIRATION = 60 * 60 * 24 * 365;
const CID_COOKIE_NAME = 'cid';

function getCid(req: IncomingMessage) {
  const cookies = cookie.parse(req.headers.cookie || '');

  // Fallbacks back to query string cid
  let cid = cookies[CID_COOKIE_NAME] ?? '';

  if (cid === '') {
    const url = new URL(req.url ?? '', 'http://localhost/');
    cid = url.searchParams.get('cid') ?? '';
  }

  if (cid === '') {
    cid = uuid4().replace(/-/g, '');
  }

  return cid;
}

const cid: ServerMiddleware = function (req, res, next) {
  const path = req.url ?? '';

  // skip assets
  if (path.startsWith('/_nuxt/')) {
    return next()
  }

  const cid = getCid(req);

  res.setHeader('Set-Cookie', cookie.serialize(CID_COOKIE_NAME, cid, {
    httpOnly: true,
    maxAge: CID_EXPIRATION,
    domain: process.env.CID_COOKIE_DOMAIN,
    path: '/',
  }));

  req.headers[CID_HEADER] = cid;

  if (path === '/cid') {
    res.setHeader('Content-Type', 'text/plain');
    res.end(cid);

    return;
  }

  next();
}

export default cid;
