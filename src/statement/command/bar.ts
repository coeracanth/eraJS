import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg3R3(X.expr, X.expr, X.expr);
export default class Bar extends Statement {
	public arg: Lazy<[Expr, Expr, Expr]>;
	public newline: boolean;

	public constructor(raw: Slice, newline: boolean = false) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
		this.newline = newline;
	}

	public async *run(vm: VM) {
		if (vm.printer.skipDisp) {
			return null;
		}

		const [valueExpr, maxExpr, lengthExpr] = this.arg.get();

		const value = await valueExpr.reduce(vm);
		assert.bigint(value, "1st argument of BAR must be a number");
		const max = await maxExpr.reduce(vm);
		assert.bigint(max, "2nd argument of BAR must be a number");
		const length = await lengthExpr.reduce(vm);
		assert.bigint(length, "3rd argument of BAR must be a number");

		const filled = length * value / max;
		const text = "[" + "*".repeat(Number(filled)) +
			".".repeat(Number(length - filled)) + "]";
		yield* vm.printer.print(text, new Set());

		if (this.newline) {
			yield* vm.printer.newline();
		}

		return null;
	}
}
