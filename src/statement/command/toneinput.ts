import * as assert from "../../assert.ts";
import * as C from "../../parser/const.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type Expr from "../expr/index.ts";
import type VM from "../../vm.ts";
import Statement, { EraGenerator } from "../index.ts";

const PARSER = U.arg4R2(X.expr, X.expr, X.expr, C.charSeq());
export default class TOneInput extends Statement {
	public arg: Lazy<[Expr, Expr, Expr | undefined, string | undefined]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM): EraGenerator {
		const [timeoutExpr, defExpr, showExpr, message] = this.arg.get();
		const timeout = await timeoutExpr.reduce(vm);
		assert.bigint(timeout, "1st argument of TONEINPUT should be a number");
		const def = await defExpr.reduce(vm);
		assert.bigint(def, "2nd argument of TONEINPUT should be a number");
		const show = await showExpr?.reduce(vm) ?? 0n;
		assert.bigint(show, "3rd argument of TONEINPUT should be a number");

		const input = yield* vm.printer.tinput(
			true,
			Number(timeout),
			show === 1n,
		);

		let value: bigint;
		if (input == null) {
			if (message != null) {
				yield* vm.printer.print(message, new Set(["S"]));
			}
			value = def;
		} else {
			value = BigInt(input[0]);
		}
		yield* vm.printer.print(value.toString(), new Set(["S"]));

		vm.getValue("RESULT").set(vm, value, [0]);

		return null;
	}
}
