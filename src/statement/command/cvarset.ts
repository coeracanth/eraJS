import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import type Variable from "../expr/variable.ts";
import Statement from "../index.ts";

const PARSER = U.arg5R1(X.variable, X.expr, X.expr, X.expr, X.expr);
export default class VarSet extends Statement {
	public arg: Lazy<[
		Variable,
		Expr | undefined,
		Expr | undefined,
		Expr | undefined,
		Expr | undefined,
	]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const [destExpr, indexExpr, valueExpr, startExpr, endExpr] = this.arg
			.get();

		const index = await indexExpr?.reduce(vm) ?? 0n;
		assert.bigint(index, "2nd argument of CVARSET must be a number");
		const value = await valueExpr?.reduce(vm);
		const start = await startExpr?.reduce(vm) ?? 0n;
		assert.bigint(start, "4th argument of CVARSET must be a number");
		const end = await endExpr?.reduce(vm) ??
			BigInt(vm.characterList.length);
		assert.bigint(end, "5th argument of CVARSET must be a number");

		for (let i = start; i < end; ++i) {
			const character = vm.characterList[Number(i)];
			const cell = character.getValue(destExpr.name);
			if (value != null) {
				cell.set(vm, value, [Number(index)]);
			} else {
				if (cell.type === "number") {
					cell.set(vm, 0n, [Number(index)]);
				} else {
					cell.set(vm, "", [Number(index)]);
				}
			}
		}

		return null;
	}
}
