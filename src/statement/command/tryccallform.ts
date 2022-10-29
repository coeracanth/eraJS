import { parseThunk } from "../../parser/erb.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type Thunk from "../../thunk.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";
import Call from "./call.ts";
import CallForm from "./callform.ts";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCCallForm extends Statement {
	public static parse(
		arg: Slice,
		lines: Slice[],
		from: number,
	): [TryCCallForm, number] {
		let index = from + 1;

		const [thenThunk, consumedT] = parseThunk(
			lines,
			index,
			(l) => CATCH.test(l),
		);
		index += consumedT + 1;

		const [catchThunk, consumedC] = parseThunk(
			lines,
			index,
			(l) => ENDCATCH.test(l),
		);
		index += consumedC + 1;

		return [new TryCCallForm(arg, thenThunk, catchThunk), index - from];
	}

	public arg: CallForm["arg"];
	public thenThunk: Thunk;
	public catchThunk: Thunk;

	public constructor(raw: Slice, thenThunk: Thunk, catchThunk: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER(""));
		this.thenThunk = thenThunk;
		this.catchThunk = catchThunk;
	}

	public async *run(vm: VM, label?: string) {
		if (label != null && this.thenThunk.labelMap.has(label)) {
			return yield* this.thenThunk.run(vm, label);
		}
		if (label != null && this.catchThunk.labelMap.has(label)) {
			return yield* this.catchThunk.run(vm, label);
		}

		const [targetExpr, argExpr] = this.arg.get();
		const target = (await targetExpr.reduce(vm)).toUpperCase();
		if (vm.fnMap.has(target)) {
			yield* Call.exec(vm, target, argExpr);
			return yield* this.thenThunk.run(vm, label);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
