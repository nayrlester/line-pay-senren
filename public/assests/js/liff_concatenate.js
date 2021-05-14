function convertUrlFromConcatToReplace(concatenateModeUrl, endpointUrl) {
  if (!concatenateModeUrl || !endpointUrl) {
    throw new TypeError('`concatenateModeUrl` and `endpointUrl` are required');
  }
  const concatenateURL = new URL(concatenateModeUrl);
  const endpointURL = new URL(endpointUrl);
  const {
    pathname: concatenateModeUrlPathname,
    searchParams: concatenateModeUrlSearchParams,
  } = concatenateURL;
  const {
    pathname: endpointUrlPathname,
    searchParams: endpointUrlSearchParams,
  } = endpointURL;
  concatenateURL.pathname = concatenateModeUrlPathname.replace(
    endpointUrlPathname,
    '',
  );
  const concatenateModeUrlSearchParamsEntries = [
    ...concatenateModeUrlSearchParams.entries(),
  ];
  let endpointUrlSearchParamsEntries = [...endpointUrlSearchParams.entries()];
  const newSearchParamsEntries = concatenateModeUrlSearchParamsEntries.reduce(
    (ret, entry) => {
      const index = endpointUrlSearchParamsEntries.findIndex(
        ([key, val]) => key === entry[0] && val === entry[1],
      );
      if (index !== -1) {
        endpointUrlSearchParamsEntries = endpointUrlSearchParamsEntries.filter(
          (_, i) => i !== index,
        );
        return ret;
      }
      return [...ret, entry];
    },
    [],
  );
  [...concatenateModeUrlSearchParams.keys()].forEach((key) => {
    concatenateModeUrlSearchParams.delete(key);
  });
  newSearchParamsEntries.forEach(([k, v]) => {
    concatenateModeUrlSearchParams.append(k, v);
  });
  const url = concatenateURL.toString();
  return url;
}
