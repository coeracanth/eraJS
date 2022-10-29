import * as assert from "../../assert.ts";
import { parseThunk } from "../../parser/erb.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type Thunk from "../../thunk.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const REND = /^REND$/i;
const PARSER = U.arg1R1(X.expr);
export default class Repeat extends Statement {
	public static parse(
		arg: Slice,
		lines: Slice[],
		from: number,
	): [Repeat, number] {
		let index = from + 1;

		const [thunk, consumed] = parseThunk(lines, index, (l) => REND.test(l));
		index += consumed + 1;

		return [new Repeat(arg, thunk), index - from];
	}

	public arg: Lazy<Expr>;
	public thunk: Thunk;

	public constructor(raw: Slice, thunk: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
		this.thunk = thunk;
	}

	public async *run(vm: VM, label?: string) {
		if (label != null) {
			if (this.thunk.labelMap.has(label)) {
				return yield* this.thunk.run(vm, label);
			}
		}

		const condition = await this.arg.get().reduce(vm);
		assert.bigint(condition, "Condition for REPEAT should be an integer");

		loop:
		for (let i = 0n; i < condition; ++i) {
			vm.getValue("COUNT").set(vm, i, []);
			const result = yield* this.thunk.run(vm);
			switch (result?.type) {
				case "begin":
					return result;
				case "goto":
					return result;
				case "break":
					break loop;
				case "continue":
					continue loop;
				case "throw":
					return result;
				case "return":
					return result;
				case "quit":
					return result;
				case undefined:
					continue loop;
			}
		}

		return null;
	}
}
