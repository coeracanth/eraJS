import Lazy from "../../lazy.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Variable from "../expr/variable.ts";
import Statement from "../index.ts";

const PARSER = U.sepBy0(",", X.expr);
export default class AssignInt extends Statement {
	public dest: Variable;
	public arg: Lazy<Expr[]>;

	public constructor(dest: Variable, raw: Slice) {
		super(raw);
		this.dest = dest;

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const dest = this.dest.getCell(vm);
		const index = await this.dest.reduceIndex(vm);
		const arg = this.arg.get();

		const partialIndex = index.slice(0, -1);
		const lastIndex = index[index.length - 1] ?? 0;

		for (let i = 0; i < arg.length; ++i) {
			const value = await arg[i].reduce(vm);
			dest.set(vm, value, [...partialIndex, lastIndex + i]);
		}

		return null;
	}
}
