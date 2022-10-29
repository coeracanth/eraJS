import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg3R3(X.expr, X.expr, X.expr);
export default class SubstringU extends Statement {
	public arg: Lazy<[Expr, Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const [valueExpr, startExpr, endExpr] = this.arg.get();

		const value = await valueExpr.reduce(vm);
		assert.string(value, "1st argument of SUBSTRINGU must be a string!");
		const start = await startExpr.reduce(vm);
		assert.bigint(start, "2nd argument of SUBSTRINGU must be a number!");
		const end = await endExpr.reduce(vm);
		assert.bigint(end, "3rd argument of SUBSTRINGU must be a number!");
		if (end < 0) {
			vm.getValue("RESULTS").set(vm, value.slice(Number(start)), [0]);
		} else {
			vm.getValue("RESULTS").set(
				vm,
				value.slice(Number(start), Number(end)),
				[0],
			);
		}

		return null;
	}
}
