import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg5R1(E.variable, E.expr, E.expr, E.expr, E.expr);
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

	public *run(vm: VM) {
		const [destExpr, indexExpr, valueExpr, startExpr, endExpr] = this.arg.get();

		const index = indexExpr?.reduce(vm) ?? 0;
		assert.number(index, "2nd argument of CVARSET must be a number");
		const value = valueExpr?.reduce(vm);
		const start = startExpr?.reduce(vm) ?? 0;
		assert.number(start, "4th argument of CVARSET must be a number");
		const end = endExpr?.reduce(vm) ?? vm.characterList.length;
		assert.number(end, "5th argument of CVARSET must be a number");

		for (let i = start; i < end; ++i) {
			const character = vm.characterList[i];
			const cell = character.getValue(destExpr.name);
			if (value != null) {
				cell.set(vm, value, [index]);
			} else {
				if (cell.type === "number") {
					cell.set(vm, 0, [index]);
				} else {
					cell.set(vm, "", [index]);
				}
			}
		}

		return null;
	}
}
