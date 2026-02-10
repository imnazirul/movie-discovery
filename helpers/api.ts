import axios from "axios";

export const baseURL = "https://api.themoviedb.org/3";

const axiosApi = axios.create({
  baseURL: baseURL,
});

axiosApi.interceptors.request.use(async (config) => {
  const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// interceptor
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export async function get(url: string, params = {}, config = {}) {
  try {
    const response = await axiosApi.get(url, { ...config, params });
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

// const updateRequest = (url: string, data: any) => {
//   axiosApi.defaults.headers.common["Content-Type"] = "application/json";
//   const variables = url.match(/:[a-zA-Z]+/g);
//   if (variables?.length) {
//     variables.forEach((variable) => {
//       url = url.replace(variable, data[variable.replace(":", "")]);
//       delete data[variable.replace(":", "")];
//     });
//   }
//   return { url, data };
// };

// export async function post(url: string, data: any, config = {}) {
//   const { url: newUrl, data: newData } = updateRequest(url, data);
//   try {
//     return axiosApi
//       .post(newUrl, newData, { ...config })
//       .then((response) => {
//         return { ...response.data, success: true };
//       })
//       .catch((error: any) => {
//         console.log(error);

//         if (error.response ? error.response.data : error.message)
//           toast.error(
//             error?.response?.data?.message || "Something went wrong!",
//           );
//       });
//   } catch (err) {
//     toast.error("Something went wrong!");
//   }
// }

// export async function postAxiosMultipart(url: string, data: any, config = {}) {
//   axiosApi.defaults.headers.common["Content-Type"] = "";
//   try {
//     return axiosApi
//       .post(url, data, { ...config })
//       .then((response) => {
//         return { ...response.data, success: true };
//       })
//       .catch((error) => {
//         toast.error(error?.response?.data?.message || "Something went wrong!");
//       });
//   } catch (err) {
//     throw err;
//   }
// }

// export async function patchAxiosMultipart(url: any, data: any, config = {}) {
//   axiosApi.defaults.headers.common["Content-Type"] = "";
//   try {
//     return axiosApi
//       .patch(url, data, { ...config })
//       .then((response) => {
//         return { ...response.data, success: true };
//       })
//       .catch((error) => {
//         toast.error(error?.response?.data?.message || "Something went wrong!");
//       });
//   } catch (err) {
//     throw err;
//   }
// }

// export async function patch(url: string, data: any, config = {}) {
//   const { url: newUrl, data: newData } = updateRequest(url, data);
//   try {
//     return axiosApi
//       .patch(newUrl, newData, { ...config })
//       .then((response) => {
//         return { ...response.data, success: true };
//       })
//       .catch((error) => {
//         toast.error(error?.response?.data?.message || "Something went wrong!");
//       });
//   } catch (err) {
//     toast.error("Something went wrong!");
//   }
// }

// export async function put(url: string, data: any, config = {}) {
//   const { url: newUrl, data: newData } = updateRequest(url, data);
//   try {
//     return axiosApi
//       .put(newUrl, newData, { ...config })
//       .then((response) => {
//         return { ...response.data, success: true };
//       })
//       .catch((error) => {
//         toast.error(error?.response?.data?.message || "Something went wrong!");
//       });
//   } catch (err) {
//     toast.error("Something went wrong!");
//   }
// }

// export async function del(url: string, config = {}) {
//   try {
//     return await axiosApi
//       .delete(url, { ...config })
//       .then((response) => {
//         return { ...response.data, success: true };
//       })
//       .catch((error) => {
//         toast.error(error?.response?.data?.message || "Something went wrong!");
//       });
//   } catch (err) {
//     toast.error("Something Went Wrong");
//   }
// }
