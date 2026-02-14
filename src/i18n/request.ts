// Configuration i18n pour next-intl (Server Components)
// Mode mono-locale francais pour l'instant, pret pour le multi-langue

import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "fr";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: "Europe/Paris",
  };
});
