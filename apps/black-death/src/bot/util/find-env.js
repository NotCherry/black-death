import { findUp } from "find-up";

export const findEnv = async () => await findUp(".env");
