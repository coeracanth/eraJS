import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function abs(vm: VM, arg: Expr[]): number {
	const value = arg[0].reduce(vm);
	assertNumber(value, "1st argument of ABS must a be number");

	return Math.abs(value);
}
