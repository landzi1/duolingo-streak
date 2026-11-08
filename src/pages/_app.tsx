import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import { useEffect } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    useBoundStore.getState().initFromStorage?.();
  }, []);

  return (
    <>
      <Head>
        <title>React Duolingo Clone</title>
        <meta
          name="description"
          content="Duolingo web app clone written with React"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0A0" />
        <link rel="manifest" href="/app.webmanifest" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
