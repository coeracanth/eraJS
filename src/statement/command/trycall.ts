import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";
import Call from "./call.ts";

export default class TryCall extends Statement {
	public arg: Call["arg"];

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
	}

	public async *run(vm: VM) {
		const [target, argExpr] = this.arg.get();
		const realTarget = target.toUpperCase();
		if (vm.fnMap.has(realTarget)) {
			return yield* Call.exec(vm, realTarget, argExpr);
		}

		return null;
	}
}
