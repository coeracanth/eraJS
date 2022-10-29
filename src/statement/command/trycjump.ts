import * as E from "../../error.ts";
import { parseThunk } from "../../parser/erb.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type Thunk from "../../thunk.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";
import Call from "./call.ts";
import Jump from "./jump.ts";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCJump extends Statement {
	public static parse(
		arg: Slice,
		lines: Slice[],
		from: number,
	): [TryCJump, number] {
		let index = from + 1;
		if (lines.length <= index) {
			throw E.parser("Unexpected end of thunk in TRYCJUMP expression");
		} else if (!CATCH.test(lines[index].content)) {
			throw E.parser("Could not find CATCH for TRYCJUMP expression");
		}
		index += 1;

		const [catchThunk, consumed] = parseThunk(
			lines,
			index,
			(l) => ENDCATCH.test(l),
		);
		index += consumed + 1;

		return [new TryCJump(arg, catchThunk), index - from];
	}

	public arg: Jump["arg"];
	public catchExpr: Thunk;

	public constructor(raw: Slice, catchExpr: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
		this.catchExpr = catchExpr;
	}

	public async *run(vm: VM, label?: string) {
		const [target, argExpr] = this.arg.get();
		const realTarget = target.toUpperCase();
		if (vm.fnMap.has(realTarget)) {
			return yield* Jump.exec(vm, realTarget, argExpr);
		} else {
			return yield* this.catchExpr.run(vm, label);
		}
	}
}
