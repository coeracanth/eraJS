import {assert, assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(E.expr);
export default class CsvNickname extends Statement {
	public arg: Lazy<Expr>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const numExpr = this.arg.get();
		const num = numExpr.reduce(vm);
		assertNumber(num, "1st Argument of CSVNICKNAME should be an integer");

		const character = vm.code.data.character.get(num);
		assert(character != null, `Character #${num} does not exist`);

		const result = character.nickname;
		vm.getValue("RESULTS").set(vm, result, [0]);

		return null;
	}
}
