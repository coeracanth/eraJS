import * as E from "../../error.ts";
import { parseThunk } from "../../parser/erb.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type Thunk from "../../thunk.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";
import CallForm from "./callform.ts";
import Jump from "./jump.ts";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCJumpForm extends Statement {
	public static parse(
		arg: Slice,
		lines: Slice[],
		from: number,
	): [TryCJumpForm, number] {
		let index = from + 1;
		if (lines.length <= index) {
			throw E.parser(
				"Unexpected end of thunk in TRYCJUMPFORM expression",
			);
		} else if (!CATCH.test(lines[index].content)) {
			throw E.parser("Could not find CATCH for TRYCJUMPFORM expression");
		}
		index += 1;

		const [catchThunk, consumed] = parseThunk(
			lines,
			index,
			(l) => ENDCATCH.test(l),
		);
		index += consumed + 1;

		return [new TryCJumpForm(arg, catchThunk), index - from];
	}

	public arg: CallForm["arg"];
	public catchThunk: Thunk;

	public constructor(raw: Slice, catchThunk: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER(""));
		this.catchThunk = catchThunk;
	}

	public async *run(vm: VM, label?: string) {
		const [targetExpr, argExpr] = this.arg.get();
		const target = (await targetExpr.reduce(vm)).toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* Jump.exec(vm, target, argExpr);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
