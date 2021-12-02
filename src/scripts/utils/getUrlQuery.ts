export const getUrlQuery = () => Object.fromEntries(decodeURIComponent(location.search).slice(1).split('&').map(prop => prop.split('=')));
