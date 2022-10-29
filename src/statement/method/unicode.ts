import * as assert from "../../assert.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";

export default async function unicode(vm: VM, arg: Expr[]): Promise<string> {
	const value = await arg[0].reduce(vm);
	assert.bigint(value, "1st Argument of UNICODE should be a number");

	return String.fromCharCode(Number(value));
}
