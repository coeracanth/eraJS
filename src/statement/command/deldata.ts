import * as assert from "../../assert.ts";
import * as E from "../../error.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(X.expr);
export default class DelData extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const index = await this.arg.get().reduce(vm);
		assert.bigint(index, "Argument of DELDATA must be a number");

		throw E.notImpl("DELDATA");

		return null;
	}
}
