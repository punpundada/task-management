import { jsonToBase64 } from "@/lib/utils";
import React from "react";
import { useSearchParams } from "react-router-dom";

type Props<T> = {
  name: string;
  defaultValue?: T;
};

function useQueryState<T>({ defaultValue, name }: Props<T>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = React.useState<T | string | undefined | null>(
    typeof defaultValue === "object" ? jsonToBase64(defaultValue) : defaultValue
  );

  React.useEffect(() => {
    if (state) {
      setSearchParams(name);
    } else {
      searchParams.delete(name);
      setSearchParams(searchParams);
    }
  }, [name, searchParams, setSearchParams, state]);

  return [state, setState] as const;
}

export default useQueryState;
