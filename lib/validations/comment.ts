import * as z from "zod";
import User from "../models/user.model";
const commentFormSchema = z.object({
  message: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
});

export default commentFormSchema;