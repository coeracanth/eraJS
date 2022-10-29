import P from "../../../deps/parsimmon.ts";

import * as assert from "../../assert.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Variable from "../expr/variable.ts";
import Statement from "../index.ts";

const PARSER = P.eof;
type Operator = "++" | "--";
export default class AssignPostfix extends Statement {
	public dest: Variable;
	public operator: Operator;
	public arg: Lazy<undefined>;

	public constructor(dest: Variable, operator: Operator, raw: Slice) {
		super(raw);
		this.dest = dest;
		this.operator = operator;

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		this.raw.get();

		const dest = this.dest.getCell(vm);
		assert.cond(
			dest.type === "number",
			"++/-- should be used with a numeric variable",
		);
		const index = await this.dest.reduceIndex(vm);
		const original = dest.get(vm, index) as bigint;

		switch (this.operator) {
			case "++":
				dest.set(vm, original + 1n, index);
				break;
			case "--":
				dest.set(vm, original - 1n, index);
				break;
		}

		return null;
	}
}
