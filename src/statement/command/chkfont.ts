import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(X.expr);
export default class ChkFont extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const arg = await this.arg.get().reduce(vm);
		assert.string(arg, "1st argument of CHKFONT should be a string");

		const result = vm.external.getFont(arg) ? 1n : 0n;
		vm.getValue("RESULT").set(vm, result, [0]);

		return null;
	}
}
