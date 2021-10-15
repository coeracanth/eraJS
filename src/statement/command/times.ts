import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg2R2(E.variable, U.Float);
export default class Times extends Statement {
	public arg: Lazy<[Variable, number]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const [dest, value] = this.arg.get();

		const original = dest.reduce(vm);
		assert.number(original, "1st argument of TIMES must be a number");
		const index = dest.reduceIndex(vm);

		dest.getCell(vm).set(vm, Math.floor(original * value), index);

		return null;
	}
}
