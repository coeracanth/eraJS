import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Form from "../expr/form.ts";
import Statement from "../index.ts";
import Goto from "./goto.ts";

const PARSER = U.arg1R1(X.form[""]);
export default class TryGotoForm extends Statement {
	public static parse(arg: Slice): TryGotoForm {
		return new TryGotoForm(arg);
	}

	public arg: Lazy<Form>;

	public constructor(raw: Slice) {
		super(raw);
		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const target = (await this.arg.get().reduce(vm)).toUpperCase();
		const context = vm.context();
		if (context.fn.thunk.labelMap.has(target)) {
			return yield* Goto.exec(vm, target);
		}

		return null;
	}
}
