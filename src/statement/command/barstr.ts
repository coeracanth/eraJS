import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg3R3(X.expr, X.expr, X.expr);
export default class BarStr extends Statement {
	public arg: Lazy<[Expr, Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const [valueExpr, maxExpr, lengthExpr] = this.arg.get();

		const value = valueExpr.reduce(vm);
		assert.number(value, "1st argument of BAR must be a number");
		const max = maxExpr.reduce(vm);
		assert.number(max, "2nd argument of BAR must be a number");
		const length = lengthExpr.reduce(vm);
		assert.number(length, "3rd argument of BAR must be a number");

		const filled = Math.floor(length * (value / max));
		const result = "[" + "*".repeat(filled) + ".".repeat(length - filled) + "]";
		vm.getValue("RESULTS").set(vm, result, [0]);

		return null;
	}
}
