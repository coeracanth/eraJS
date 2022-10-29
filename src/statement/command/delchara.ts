import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.argNR0(X.expr);
export default class DelChara extends Statement {
	public arg: Lazy<Expr[]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const arg = this.arg.get();
		const indexList: bigint[] = [];
		for (let i = 0; i < arg.length; ++i) {
			const index = await arg[i].reduce(vm);
			assert.bigint(
				index,
				`${i + 1}th argument of DELCHARA should be a number`,
			);
			indexList.push(index);
		}
		indexList.sort();
		indexList.reverse();

		for (const index of indexList) {
			vm.characterList.splice(Number(index), 1);
		}

		return null;
	}
}
