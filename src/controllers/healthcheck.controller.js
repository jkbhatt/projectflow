import { ApiResponse } from "../utils/apiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js"; 

// const healthCheck = async (req, res , next) => {
//   try {
//     const user = await getUserFromDB();

//     res
//       .status(200)
//       .json(new ApiResponse(true, "Server is running"));
//   } catch (error) {
//     next(error);
//   }
// };
const healthCheck = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(true, "Server is running"));
});
export { healthCheck };