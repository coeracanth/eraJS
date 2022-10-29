import * as E from "../../error.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Form from "../expr/form.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(X.form[""]);
export default class GotoForm extends Statement {
	public arg: Lazy<Form>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const arg = await this.arg.get().reduce(vm);
		const target = arg.toUpperCase();

		const context = vm.context();
		if (!context.fn.thunk.labelMap.has(target)) {
			throw E.notFound("Label", target);
		}

		return {
			type: "goto",
			label: target,
		} as const;
	}
}
