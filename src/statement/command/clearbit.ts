import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import type Variable from "../expr/variable.ts";
import Statement from "../index.ts";

const PARSER = U.argNR1(X.variable, X.expr);
export default class ClearBit extends Statement {
	public arg: Lazy<[Variable, ...Expr[]]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const [destExpr, ...bitExpr] = this.arg.get();

		const value = await destExpr.reduce(vm);
		assert.bigint(value, "1st argument of CLEARBIT must be a number");
		const bitList: bigint[] = [];
		for (let i = 0; i < bitExpr.length; ++i) {
			const bit = await bitExpr[i].reduce(vm);
			assert.bigint(
				bit,
				`${i + 1}th Argument of CLEARBIT must be a number`,
			);
			bitList.push(bit);
		}

		let result = value;
		for (const bit of bitList) {
			// eslint-disable-next-line no-bitwise
			result &= ~(1n << bit);
		}
		destExpr.getCell(vm).set(vm, result, await destExpr.reduceIndex(vm));

		return null;
	}
}
