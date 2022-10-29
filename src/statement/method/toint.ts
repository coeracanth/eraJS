import * as assert from "../../assert.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";

export default async function toInt(vm: VM, arg: Expr[]): Promise<number> {
	const value = await arg[0].reduce(vm);
	assert.string(value, "1st Argument of TOINT should be a string");

	const result = Number(value);
	return isNaN(result) ? 0 : result;
}
