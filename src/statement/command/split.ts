import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import type Variable from "../expr/variable.ts";
import Statement from "../index.ts";

const PARSER = U.arg3R3(X.expr, X.expr, X.variable);
export default class Split extends Statement {
	public arg: Lazy<[Expr, Expr, Variable]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const [valueExpr, sepExpr, destExpr] = this.arg.get();

		const value = await valueExpr.reduce(vm);
		assert.string(value, "1st argument of SPLIT must be a string!");
		const sep = await sepExpr.reduce(vm);
		assert.string(sep, "2nd argument of SPLIT must be a number!");
		const dest = destExpr.getCell(vm);
		const index = await destExpr.reduceIndex(vm);

		const chunkList = value.split(sep);
		for (let i = 0; i < chunkList.length; ++i) {
			dest.set(vm, chunkList[i], [...index, i]);
		}
		vm.getValue("RESULT").set(vm, BigInt(chunkList.length), [0]);

		return null;
	}
}
