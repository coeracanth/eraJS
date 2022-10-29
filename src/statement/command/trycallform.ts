import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";
import Call from "./call.ts";
import CallForm from "./callform.ts";

export default class TryCallForm extends Statement {
	public arg: CallForm["arg"];

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER("(,"));
	}

	public async *run(vm: VM) {
		const [targetExpr, argExpr] = this.arg.get();
		const target = (await targetExpr.reduce(vm)).toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* Call.exec(vm, target, argExpr);
		}

		return null;
	}
}
