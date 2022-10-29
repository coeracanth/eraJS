import * as assert from "../../assert.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";

export default async function varSize(vm: VM, arg: Expr[]): Promise<number> {
	const name = await arg[0].reduce(vm);
	assert.string(name, "1st Argument of VARSIZE should be a string");

	const depth = arg.length >= 2 ? await arg[1].reduce(vm) : 0n;
	assert.bigint(depth, "2nd argument of VARSIZE must be a number");
	return vm.getValue(name).length(Number(depth));
}
