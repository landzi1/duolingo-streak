import type { NextPage } from "next";
import Head from "next/head";
import { StreakScreen } from "~/components/StreakScreen";

const StreakPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Streak - Duolingo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <main className="min-h-screen bg-[#f7f7f7]">
        <StreakScreen />
      </main>
    </>
  );
};

export default StreakPage;
