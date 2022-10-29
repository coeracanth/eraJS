import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";
import Call from "./call.ts";
import Jump from "./jump.ts";

export default class TryJump extends Statement {
	public arg: Jump["arg"];

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
	}

	public async *run(vm: VM) {
		const [target, argExpr] = this.arg.get();
		const realTarget = target.toUpperCase();
		if (vm.fnMap.has(realTarget)) {
			return yield* Jump.exec(vm, realTarget, argExpr);
		}

		return null;
	}
}
