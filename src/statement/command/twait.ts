import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type Expr from "../expr/index.ts";
import type VM from "../../vm.ts";
import Statement, { EraGenerator } from "../index.ts";

const PARSER = U.arg2R2(X.expr, X.expr);
export default class TWait extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM): EraGenerator {
		const [timeoutExpr, forceExpr] = this.arg.get();
		const timeout = await timeoutExpr.reduce(vm);
		assert.bigint(timeout, "1st argument of TWAIT should be a number");
		const force = await forceExpr.reduce(vm);
		assert.bigint(force, "2nd argument of TWAIT should be a number");

		yield* vm.printer.wait(force !== 0n);

		return null;
	}
}
