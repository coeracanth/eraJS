import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg2R2(X.expr, X.expr);
export default class StrFindU extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const [valueExpr, searchExpr] = this.arg.get();

		const value = await valueExpr.reduce(vm);
		assert.string(value, "1st argument of STRFINDU must be a string!");
		const search = await searchExpr.reduce(vm);
		assert.string(search, "2nd argument of STRFINDU must be a string!");
		// TODO: unicode
		vm.getValue("RESULT").set(vm, BigInt(value.indexOf(search)), [0]);

		return null;
	}
}
