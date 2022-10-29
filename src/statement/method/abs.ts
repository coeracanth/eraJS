import * as assert from "../../assert.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";

export default async function abs(vm: VM, arg: Expr[]): Promise<bigint> {
	const value = await arg[0].reduce(vm);
	assert.bigint(value, "1st argument of ABS must a be number");

	return value >= 0 ? value : -value;
}
