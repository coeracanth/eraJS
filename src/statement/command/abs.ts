import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(E.expr);
export default class Abs extends Statement {
	public arg: Lazy<Expr>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const value = this.arg.get().reduce(vm);
		assert.number(value, "1st Argument of ABS should be an integer");

		const result = Math.abs(value);
		vm.getValue("RESULT").set(vm, result, [0]);

		return null;
	}
}
