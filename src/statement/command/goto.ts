import * as assert from "../../assert.ts";
import * as C from "../../parser/const.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(C.Identifier);
export default class Goto extends Statement {
	public static *exec(vm: VM, target: string) {
		const realTarget = target.toUpperCase();
		const context = vm.context();
		assert.cond(
			context.fn.thunk.labelMap.has(realTarget),
			`Label ${realTarget} does not exist`,
		);

		return {
			type: "goto",
			label: target,
		} as const;
	}

	public arg: Lazy<string>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(vm: VM) {
		const target = this.arg.get();
		return yield* Goto.exec(vm, target);
	}
}
