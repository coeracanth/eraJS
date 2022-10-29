import * as assert from "../../assert.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";

export default async function sign(vm: VM, arg: Expr[]): Promise<number> {
	const value = await arg[0].reduce(vm);
	assert.bigint(value, "1st argument of SIGN must a be number");

	if (value > 0) {
		return 1;
	} else if (value < 0) {
		return -1;
	} else {
		return 0;
	}
}
