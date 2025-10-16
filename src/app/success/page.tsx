// "use client";

// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setCredentials } from "@/authSlice";
// import { cookies } from "next/headers";

// export default function CallbackPage() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchTokens = async () => {
//       const cookieStore = await cookies();
//       const accessToken = cookieStore.get('spotify_access_token')?.value;
//       const refreshToken = cookieStore.get('spotify_refresh_token')?.value;
//       if (accessToken) {
//         dispatch(
//           setCredentials({
//             accessToken: accessToken,
//             refreshToken: refreshToken,
//           })
//         );
//         window.location.replace("/");
//       } else {
//         window.location.replace("/error");
//       }
//     };

//     fetchTokens();
//   }, [dispatch]);

//   return <p>Logging you in with Spotify...</p>;
// }
