import {assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg2R2(E.expr, E.expr);
export default class StrFind extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const [valueExpr, searchExpr] = this.arg.get();

		const value = valueExpr.reduce(vm);
		assertString(value, "1st argument of STRFIND must be a string!");
		const search = searchExpr.reduce(vm);
		assertString(search, "2nd argument of STRFIND must be a string!");
		vm.getValue("RESULT").set(vm, value.indexOf(search), [0]);

		return null;
	}
}
