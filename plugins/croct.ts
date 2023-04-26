import {Plugin} from "@nuxt/types";
import {CID_HEADER} from "~/server-middleware/cid";
import croct from "@croct/plug";
import {ContentFetcher, DynamicContentOptions} from '@croct/sdk/contentFetcher';
import {JsonObject} from '@croct/json';

type ServerSideFetchOptions = DynamicContentOptions & {
  apiKey: string,
  fallback?: JsonObject,
};

export function fetchContent(slotId: string, options?: ServerSideFetchOptions): Promise<JsonObject> {
  const {apiKey, fallback, ...rest} = options ?? {};
  const [id, version = 'latest'] = slotId.split('@') as [string, `${number}`|undefined];
  const resolvedOptions = version === 'latest' ? rest : {...rest, version: version};

  let promise = (new ContentFetcher({apiKey: apiKey})).fetch(id, resolvedOptions);

  if (fallback !== undefined) {
    promise = promise.catch(() => ({content: fallback}));
  }

  return promise;
}

type FetchOptions = {
  version?: `${number}` | number,
  fallback: JsonObject,
}

function getHeader(headers: any, name: string): string | undefined {
  if (typeof headers[name] === 'string') {
    return headers[name];
  }

  return undefined;
}

const plugin: Plugin = ({req, $config}, inject) => {
  if (process.client) {
    croct.plug({
      appId: $config.CROCT_APP_ID,
      cidAssignerEndpointUrl: $config.CID_ASSIGNER_ENDPOINT_URL,
    });

    return;
  }

  const apiKey = $config.CROCT_API_KEY ?? '';

  if (apiKey === '') {
    throw new Error('CROCT_API_KEY environment variable is not set');
  }

  const clientId = getHeader(req.headers, CID_HEADER);
  const userAgent = getHeader(req.headers, 'user-agent')
  const clientIp = getHeader(req.headers, 'x-forwarded-for') ?? req.socket.remoteAddress;

  const url = new URL(req?.url ?? '', $config.BASE_URL);
  const previewToken = url.searchParams.get('croct-preview') ?? undefined;

  url.searchParams.delete('croct-preview');

  inject('croct', {
    fetch: (slotId: string, options: FetchOptions) => {
      return fetchContent(slotId, {
        apiKey: apiKey,
        version: options.version,
        clientId: clientId,
        userAgent: userAgent,
        clientIp: clientIp,
        previewToken: previewToken,
        fallback: options.fallback,
        timeout: 300,
        context: {
          page: {
            url: url.href,
            referrer: getHeader(req.headers, 'referer'),
          },
        }
      });
    }
  });
}

export default plugin;
