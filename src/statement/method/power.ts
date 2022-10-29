import * as assert from "../../assert.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";

export default async function power(vm: VM, arg: Expr[]): Promise<bigint> {
	const base = await arg[0].reduce(vm);
	assert.bigint(base, "1st argument of POWER must be a number");
	const exponent = await arg[1].reduce(vm);
	assert.bigint(exponent, "2nd argument of POWER must be a number");

	return base ** exponent;
}
