import axiosJWT from "./axiosInstance";

export const postRequest = async (
  data: any,
  url: string,
  accessToken: string | null,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>, 
  setError?: React.Dispatch<React.SetStateAction<null | string>>
) => {
  try {
    if (setError) setError(null);
    if (setLoading) setLoading(true); 
    console.log(accessToken);

    const res = await axiosJWT.post(url, data);
    console.log("Response: ", res);

    return res.data;
  } catch (err: any) {
    if (setError) setError(err.message); 
  } finally {
    if (setLoading) setLoading(false); 
  }
};



export const getRequest = async (
  url: string,
  accessToken:string | null,
  setLoading:React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<null | string>>
) => {
  try {
    setError(null);
    setLoading(true);
    const res = await axiosJWT.get(url,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

    return res.data;

  } catch (err: any) {
    setError(err.message);
    
  } finally {
    setLoading(false);

  }
}
