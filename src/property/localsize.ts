import * as assert from "../assert.ts";
import Expr from "../statement/expr/index.ts";
import Int1DValue from "../value/int-1d.ts";
import type VM from "../vm.ts";

export default class LocalSize {
	public size: Expr;

	public constructor(size: Expr) {
		this.size = size;
	}

	public async apply(vm: VM, fn: string) {
		const size = await this.size.reduce(vm);
		assert.bigint(size, "Argument of LOCALSIZE should be a number");
		vm.staticMap.get(fn)!.set(
			"LOCAL",
			new Int1DValue("LOCAL", [Number(size)]),
		);
	}
}
