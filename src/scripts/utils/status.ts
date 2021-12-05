import {getUrlQuery} from './getUrlQuery';

const cache: {
  $_GET: any,
  url: string,
} = {
  $_GET: {},
  url: '',
};

export const status = {
  get $_GET() {
    if (cache.url !== location.href) {
      cache.url = location.href;
      cache.$_GET = getUrlQuery();
    }

    return cache.$_GET;
  }
}
