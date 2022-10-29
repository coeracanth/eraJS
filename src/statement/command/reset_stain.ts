import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import Int1DValue from "../../value/int-1d.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(X.expr);
export default class ResetStain extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const num = await this.arg.get().reduce(vm);
		assert.bigint(num, "1st Argument of RESET_STAIN should be an integer");

		assert.cond(
			vm.characterList.length > num,
			`Character #${num} does not exist`,
		);
		const character = vm.characterList[Number(num)];

		character.getValue<Int1DValue>("STAIN").reset([0, 0, 2, 1, 8]);

		return null;
	}
}
