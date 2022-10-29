import * as assert from "../../assert.ts";
import type { Leaf } from "../../value/index.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";

export default async function groupMatch(vm: VM, arg: Expr[]): Promise<number> {
	assert.cond(arg.length > 0, "1st argument of GROUPMATCH must exist");
	const key = await arg[0].reduce(vm);
	const values: Array<Leaf> = [];
	for (const a of arg.slice(1)) {
		values.push(await a.reduce(vm));
	}

	return values.reduce((acc: number, val) => acc + (val === key ? 1 : 0), 0);
}
