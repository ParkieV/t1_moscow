import {useEffect, useState} from "react";

export const handledFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  return await fetch(url, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzMyOTczMDQ1fQ.lLrQUDKhFM-sTeiCMe_-F9zEWQZ_QSfWFg_lAkOV4Xs'}`
    },
    ...options
  })
}




export const useFetch = (url: string, options?: RequestInit) => {
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await handledFetch(url, options);
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);

  return data
}
