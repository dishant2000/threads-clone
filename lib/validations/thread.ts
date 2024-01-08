import * as z from "zod";
import User from "../models/user.model";
const createThreadFormSchema = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  accountId : z.string()
});

export default createThreadFormSchema;