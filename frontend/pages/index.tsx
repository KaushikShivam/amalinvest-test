import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: true,
      destination: "/watchlist",
    },
  };
};

export const PageRedirect = (): JSX.Element => {
  const { replace } = useRouter();
  useEffect(() => {
    replace("/");
  }, [replace]);
  return <></>;
};

export default PageRedirect;
