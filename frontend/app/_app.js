"use client";

import ProviderWrapper from "../app/store/providerWrapper";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ProviderWrapper>
      <Component {...pageProps} />
    </ProviderWrapper>

  );
}

export default MyApp;