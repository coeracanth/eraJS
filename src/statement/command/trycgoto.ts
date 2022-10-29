import * as E from "../../error.ts";
import { parseThunk } from "../../parser/erb.ts";
import * as C from "../../parser/const.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type Thunk from "../../thunk.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";
import Goto from "./goto.ts";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
const PARSER = U.arg1R1(C.Identifier);
export default class TryCGoto extends Statement {
	public static parse(
		arg: Slice,
		lines: Slice[],
		from: number,
	): [TryCGoto, number] {
		let index = from + 1;
		if (lines.length <= index) {
			throw E.parser("Unexpected end of thunk in TRYCGOTO expression");
		} else if (!CATCH.test(lines[index].content)) {
			throw E.parser("Could not find CATCH for TRYCGOTO expression");
		}
		index += 1;

		const [catchThunk, consumed] = parseThunk(
			lines,
			index,
			(l) => ENDCATCH.test(l),
		);
		index += consumed + 1;

		return [new TryCGoto(arg, catchThunk), index - from];
	}

	public arg: Lazy<string>;
	public catchThunk: Thunk;

	public constructor(raw: Slice, catchThunk: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
		this.catchThunk = catchThunk;
	}

	public async *run(vm: VM, label?: string) {
		const target = this.arg.get().toUpperCase();
		const context = vm.context();
		if (context.fn.thunk.labelMap.has(target)) {
			return yield* Goto.exec(vm, target);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
